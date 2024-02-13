from dataclasses import asdict
import os
import re
from src.api.controllers.episode_controller import (
    get_episode,
    set_episode,
)
from src.api.controllers.profile_controller import get_all_profiles, get_profile
from src.api.controllers.season_controller import set_season
from src.api.controllers.series_controller import (
    get_all_series,
    get_series,
    set_series,
)
from src.api.controllers.settings_controller import get_all_settings
from src.services.encode_service import encode_service
from src.api.controllers.system_controller import set_system
from src.utils.folders import (
    get_config_folder,
    get_series_folder,
    get_transcode_folder,
    get_movies_folder,
)
from src.services.metadata_service import metadata_service
from src.utils.ffmpeg import analyze_media_file
from src.models.episode import Episode
from src.models.season import Season
from src.models.series import Series
import logging

logger = logging.getLogger('logger')

season_pattern = re.compile(r"\d+")
episode_pattern = re.compile(r"(?:S(\d{2})E(\d{2})|E(\d{2}))")


def parse_episode_and_season_number(file, folder):
    match = episode_pattern.search(file)
    if not match:
        return None, None
    if match.group(1):
        return int(match.group(1)), int(match.group(2))
    else:
        parent = os.path.basename(folder)
        season_number = season_pattern.search(parent)
        if parent.lower() == "specials":
            return 0, int(match.group(3))
        if season_number:
            return int(season_number.group()), int(match.group(3))
        else:
            return None, int(match.group(3))


async def parse_episode(
    file, series_id, folder
):
    try:
        logger.debug(f"Parsing episode: {file}", extra={'service': 'Scan'})
        episode_number = 0
        season_number, episode_number = parse_episode_and_season_number(file, folder)
        if season_number is None or episode_number is None:
            return None
        episode_id = str(series_id) + str(season_number) + str(episode_number)
        episode: Episode = Episode(**await get_episode(episode_id))
        episode_path = os.path.join(folder, file)
        analysis_data = await analyze_media_file(episode_path)
        episode.id = episode_id
        episode.series_id = series_id
        episode.episode_number = episode_number
        episode.filename = file
        episode.video_codec = analysis_data
        if season_number == 0:
            episode.season_name = 'Specials'
        else:
            episode.season_name = f"Season {season_number}"
        episode.season_id = str(series_id) + str(season_number)
        episode.season_number = season_number

        episode_size = os.path.getsize(episode_path)
        if episode.original_size is None:
            episode.original_size = episode_size

        if episode.size is None or episode.size != episode_size:
            episode.original_size = episode_size
            episode.space_saved = 0
        episode.size = episode_size
    except Exception as e:
        logger.error(f"An error occurred parsing episode {file}: {e}", extra={'service': 'Scan'})
        return None
    return episode


async def parse_season(episode, season):
    try:
        logger.debug(f"Parsing season: {episode.season_name}", extra={'service': 'Scan'})
        if not season:
            return Season(**{"id": episode.season_id, "name": episode.season_name, "season_number": episode.season_number, "episode_count": 1, "size": episode.size, "series_id": episode.series_id, "space_saved": episode.space_saved, "missing_episodes": 0})
        else:
            season.episode_count += 1
            season.size += episode.size
            season.space_saved += episode.space_saved
    except Exception as e:
        logger.error(f"An error occurred parsing season {episode.season_name}: {e}", extra={'service': 'Scan'})
        return None
    return season


async def scan_series(series_id):
    try:
        logger.info(f"Scanning series: {series_id}", extra={'service': 'Scan'})
        series: Series = Series(**await get_series(series_id))
        series_path = os.path.join(await get_series_folder(), series_id)
        if not os.path.isdir(series_path):
            return
        missing_metadata = False

        series.id = series_id
        series.size = 0
        series.space_saved = 0
        series.episode_count = 0
        series.missing_episodes = 0

        settings = await get_all_settings()
        if not series or series.profile_id is None:
            series.profile_id = settings["default_profile"]
        if not series or series.monitored is None:
            series.monitored = 0
        if not series.name:
            missing_metadata = True
        profile = await get_profile(series.profile_id)
        series.seasons_count = 0

        seasons = {}

        for root, dirs, files in os.walk(series_path):
            for file in files:
                episode: Episode = await parse_episode(
                    file,
                    series_id,
                    root,
                )
                if not episode:
                    continue
                seasons[episode.season_id] = await parse_season(episode, seasons.get(episode.season_id, {}))
                if episode.video_codec != profile["codec"]:
                    seasons[episode.season_id].missing_episodes += 1
                    series.missing_episodes += 1
                series.size += episode.size
                series.space_saved += episode.space_saved
                if episode.episode_name is None:
                    missing_metadata = True
                series.episode_count += 1
                await set_episode(asdict(episode))
                await scan_queue(asdict(episode), asdict(series), profile)
        for season in seasons:
            series.seasons_count += 1
            await set_season(asdict(seasons[season]))
        await set_series(asdict(series))
        if missing_metadata:
            await metadata_service.enqueue(series_id)
    except Exception as e:
        logger.error(f"An error occurred scanning series {series_id}: {e}", extra={'service': 'Scan'})
    return


async def scan_system():
    try:
        logger.info("Scanning System", extra={'service': 'Scan'})
        series = await get_all_series()
        series_count = 0
        episode_count = 0
        file_count = 0
        size_on_disk = 0
        monitored_count = 0
        unmonitored_count = 0
        ended_count = 0
        continuing_count = 0
        space_saved = 0

        def get_disk_space(path):
            statvfs = os.statvfs(path)
            total_space = statvfs.f_frsize * statvfs.f_blocks
            free_space = statvfs.f_frsize * statvfs.f_bfree
            return free_space, total_space

        series_free_space, series_total_space = get_disk_space(await get_series_folder())
        movies_free_space, movies_total_space = get_disk_space(await get_movies_folder())

        config_free_space, config_total_space = get_disk_space(await get_config_folder())
        transcode_free_space, transcode_total_space = get_disk_space(
            await get_transcode_folder()
        )

        for id in series:
            s = series[id]
            series_count += 1
            size_on_disk += s["size"]
            space_saved += s["space_saved"]
            episode_count += s["episode_count"]
            file_count += s["episode_count"]
            if s["monitored"]:
                monitored_count += 1
            else:
                unmonitored_count += 1
            if s["status"] == "Ended":
                ended_count += 1
            else:
                continuing_count += 1

        await set_system({"id": "series_count", "value": series_count})
        await set_system({"id": "episode_count", "value": episode_count})
        await set_system({"id": "files_count", "value": file_count})
        await set_system({"id": "size_on_disk", "value": size_on_disk})
        await set_system({"id": "space_saved", "value": space_saved})

        await set_system({"id": "monitored_count", "value": monitored_count})
        await set_system({"id": "unmonitored_count", "value": unmonitored_count})
        await set_system({"id": "ended_count", "value": ended_count})
        await set_system({"id": "continuing_count", "value": continuing_count})

        await set_system({"id": "series_total_space", "value": series_total_space})
        await set_system({"id": "series_free_space", "value": series_free_space})
        await set_system({"id": "movies_total_space", "value": movies_total_space})
        await set_system({"id": "movies_free_space", "value": movies_free_space})
        await set_system({"id": "config_total_space", "value": config_total_space})
        await set_system({"id": "config_free_space", "value": config_free_space})
        await set_system({"id": "transcode_total_space", "value": transcode_total_space})
        await set_system({"id": "transcode_free_space", "value": transcode_free_space})
    except Exception as e:
        logger.error(f"An error occurred scanning system: {e}", extra={'service': 'Scan'})
    return


async def scan_queue(episode, series, profile):
    try:
        monitored = series['monitored']
        if not monitored:
            return
        profiles = await get_all_profiles()
        profile = profiles[series['profile_id']]
        targets = profile['codecs']
        wanted = profile['codec']
        if (episode['video_codec'] in targets or 'Any' in targets) and wanted != 'Any' and episode['video_codec'] != wanted:
            await encode_service.enqueue(episode)
    except Exception as e:
        logger.error(f"An error occurred while scanning for the queue {e}", extra={'service': 'Scan'})
