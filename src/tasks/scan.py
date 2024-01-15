from dataclasses import asdict
import os
import re
from src.api.controllers.episode_controller import (
    get_episode,
    remove_episode,
    set_episode,
)
from src.api.controllers.profile_controller import get_profile
from src.api.controllers.season_controller import remove_season, set_season
from src.api.controllers.series_controller import (
    get_all_series,
    get_series,
    remove_series,
    set_series,
)
from src.api.controllers.settings_controller import get_all_settings
from src.api.controllers.system_controller import set_system
from src.api.routes.scan_routes import get_series_metadata
from src.api.utils import (
    analyze_media_file,
    get_config_folder,
    get_series_folder,
    get_transcode_folder,
    verify_folders,
    get_movies_folder,
)
from src.models.episode import Episode
from src.models.season import Season
from src.models.series import Series
import logging

logger = logging.getLogger('logger')


async def scan_all_series():
    logger.info("Scanning all series")
    try:
        await verify_folders()
        series_folder = await get_series_folder()
        for series_name in os.listdir(series_folder):
            if series_name == ".DS_Store":
                continue
            await scan_series(series_name)
    except Exception as e:
        logger.error(f"An error occurred scanning all series: {e}")
    return


async def parse_episode(
    file, series_id, season_id, season_path, season_number, season_name
):
    try:
        logger.info(f"Parsing episode: {file}")
        pattern = re.compile(r"(?:S(\d{2})E(\d{2})|E(\d{2}))")
        match = pattern.search(file)
        episode_number = 0
        if match.group(1):
            episode_number = int(match.group(2))
        else:
            episode_number = int(match.group(3))

        episode_id = str(series_id) + str(season_number) + str(episode_number)
        episode: Episode = Episode(**await get_episode(episode_id))

        episode_path = os.path.join(season_path, file)
        analysis_data = await analyze_media_file(episode_path)
        episode.id = episode_id
        episode.series_id = series_id
        episode.episode_number = episode_number
        episode.filename = file
        episode.video_codec = analysis_data
        episode.season_name = season_name
        episode.season_id = season_id
        episode.season_number = season_number

        episode_size = os.path.getsize(episode_path)
        if episode.original_size is None:
            episode.original_size = episode_size

        if episode.size is None or episode.size != episode_size:
            episode.original_size = episode_size
            episode.space_saved = 0
        episode.size = episode_size
    except Exception as e:
        logger.error(f"An error occurred parsing episode {file}: {e}")
    return episode


async def parse_season(season_name, series_id):
    try:
        logger.info(f"Parsing season: {season_name}")
        digits = re.findall(r"\d+", season_name)
        season_number = 0
        if digits:
            season_number = int("".join(digits))
        season_number = 0
        season_id = str(series_id) + str(season_number)
        season = Season()
        season.id = season_id
        season.season_number = season_number
        season.name = season_name
        season.series_id = series_id
        season.missing_episodes = 0
        season.size = 0
        season.space_saved = 0
        season.episode_count = 0
    except Exception as e:
        logger.error(f"An error occurred parsing season {season_name}: {e}")
    return season


async def scan_series(series_id):
    try:
        if series_id in [".DS_Store", ""]:
            return
        logger.info(f"Scanning series: {series_id}")
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
        settings = await get_all_settings()
        for season_name in os.listdir(series_path):
            if season_name == ".DS_Store":
                continue
            season_path = os.path.join(series_path, season_name)
            season: Season = await parse_season(season_name, series.id)
            if not os.path.isdir(season_path):
                continue
            files = [
                f
                for f in os.listdir(season_path)
                if os.path.isfile(os.path.join(season_path, f))
            ]
            for file in files:
                if file == ".DS_Store":
                    continue
                episode: Episode = await parse_episode(
                    file,
                    series_id,
                    season.id,
                    season_path,
                    season.season_number,
                    season_name,
                )
                if episode.video_codec != profile["codec"]:
                    season.missing_episodes += 1
                season.size += episode.size
                season.space_saved += episode.space_saved
                if episode.episode_name is None:
                    missing_metadata = True
                season.episode_count += 1
                await set_episode(asdict(episode))
            series.episode_count += season.episode_count
            series.size += season.size
            series.space_saved += season.space_saved
            series.missing_episodes += season.missing_episodes
            await set_season(asdict(season))
        await set_series(asdict(series))
        if missing_metadata:
            await get_series_metadata(series.id)
        await validate_database()
        await scan_system()
    except Exception as e:
        logger.error(f"An error occurred scanning series {series_id}: {e}")
    return


async def validate_database():
    try:
        logger.info("Validating database")
        series_list = await get_all_series()
        for s in series_list:
            series = series_list[s]
            series_path = os.path.join(await get_series_folder(), series["id"])
            if not os.path.isdir(series_path):
                await remove_series(series["id"])
            else:
                for season_number in series["seasons"]:
                    season = series["seasons"][season_number]
                    season_path = os.path.join(series_path, season["name"])
                    if not os.path.isdir(season_path):
                        await remove_season(season["id"])
                    else:
                        for episode_number in season["episodes"]:
                            episode = season["episodes"][episode_number]
                            episode_path = os.path.join(season_path, episode["filename"])
                            if not os.path.isfile(episode_path):
                                await remove_episode(episode["id"])
    except Exception as e:
        logger.error(f"An error occurred validating database: {e}")
    return


async def scan_system():
    try:
        logger.info("Scanning system")
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
        logger.error(f"An error occurred scanning system: {e}")
    return
