from dataclasses import asdict
import os
import re
from src.api.controllers.episode_controller import get_episode, remove_episode, set_episode
from src.api.controllers.profile_controller import get_profile
from src.api.controllers.season_controller import remove_season, set_season
from src.api.controllers.series_controller import get_all_series, get_full_series, get_series, remove_series, set_series
from src.api.controllers.settings_controller import get_all_settings
from src.api.controllers.system_controller import set_system
from src.api.routes.scan_routes import get_series_metadata
from src.api.utils import analyze_media_file, get_config_folder, get_series_folder, get_transcode_folder, verify_folders, get_movies_folder
from src.models.episode import Episode
from src.models.season import Season
from src.models.series import Series


async def scan_all_series():
    await verify_folders()
    print('scan all series')
    series_folder = await get_series_folder()
    for series_name in os.listdir(series_folder):
        if series_name == ".DS_Store":
            continue
        await scan_series(series_name)
    return


async def scan_series(series_id):
    if series_id in [".DS_Store", '']:
        return
    await scan_system()
    old_series = await get_series(series_id)
    series_path = os.path.join(await get_series_folder(), series_id)
    if not os.path.isdir(series_path):
        return
    missing_metadata = False
    # Create a new Series instance
    series_dict = await get_series(series_id)
    series = Series(**series_dict)
    series_size = 0
    series_space_saved = 0
    series_episode_count = 0
    series_missing_episodes = 0
    series.id = series_id
    settings = await get_all_settings()
    if not old_series or not old_series['profile_id']:
        series.profile_id = settings['default_profile']
    if not series.name:
        missing_metadata = True
    profile = await get_profile(series.profile_id)
    settings = await get_all_settings()
    pattern = re.compile(r"(?:S(\d{2})E(\d{2})|E(\d{2}))")
    for season_name in os.listdir(series_path):
        if season_name == ".DS_Store":
            continue

        season_number = int("".join(re.findall(r'\d+', season_name)))
        season_path = os.path.join(series_path, season_name)

        # Create a new Season instance and link it to the Series
        season = Season()
        season_size = 0
        episode_count = 0
        missing_episodes = 0
        season_size_saved = 0
        season.id = str(series_id)+str(season_number)
        season.season_number = season_number
        season.name = season_name
        season.series_id = series_id

        if not os.path.isdir(season_path):
            continue
        files = [f for f in os.listdir(season_path) if os.path.isfile(os.path.join(season_path, f))]
        for file in files:
            match = pattern.search(file)
            if not match:
                continue

            if match.group(1):
                episode_number = int(match.group(2))
            else:
                episode_number = int(match.group(3))

            episode_path = os.path.join(season_path, file)
            analysis_data = await analyze_media_file(episode_path)

            # Create a new Episode instance and link it to the Season
            episode_id = str(series_id) + str(season_number) + str(episode_number)

            episode = await get_episode(episode_id)
            episode['id'] = episode_id
            episode_count += 1
            episode['series_id'] = series_id
            episode['episode_number'] = episode_number
            episode['filename'] = file
            episode['video_codec'] = analysis_data
            episode['season_name'] = season_name
            episode['season_id'] = season.id
            episode['season_number'] = season_number
            
            episode_size = os.path.getsize(episode_path)
            if 'original_size' not in episode:
                episode['original_size'] = episode_size

            if 'size' not in episode or episode['size'] != episode_size:
                episode['original_size'] = episode_size
                episode['space_saved'] = 0
            if episode['video_codec'] != profile['codec']:
                missing_episodes += 1

            episode['size'] = episode_size
            season_size += episode['size']
            season_size_saved += episode['space_saved']
            test = await get_episode(episode['id'])
            if 'episode_name' not in test:
                missing_metadata = True


            await set_episode(episode)

        season.size = season_size
        season.space_saved = season_size_saved
        season.episode_count = episode_count
        season.missing_episodes = missing_episodes 

        series_episode_count += episode_count
        series_size += season_size
        series_space_saved += season_size_saved
        series_missing_episodes += missing_episodes
        await set_season(asdict(season))

    # Save the Series instance to the database
    series.size = series_size
    series.space_saved = series_space_saved
    series.episode_count = series_episode_count
    series.missing_episodes = series_missing_episodes
    await set_series(asdict(series))
    if missing_metadata:
        await get_series_metadata(series.id)
    return



async def validate_database():
    # Get all series from the database
    series_list = await get_all_series()
    for s in series_list:
        series = await get_full_series(s['id'])
        series_path = os.path.join(await get_series_folder(), series['id'])
        if not os.path.isdir(series_path):
            # If the series folder doesn't exist, remove the series from the database
            await remove_series(series['id'])
        else:
            for season_number in series['seasons']:
                season = series['seasons'][season_number]
                season_path = os.path.join(series_path, season['name'])
                if not os.path.isdir(season_path):
                    # If the season folder doesn't exist, remove the season from the database
                    await remove_season(season['id'])
                else:
                    # Get all episodes for the season
                    for episode_number in season['episodes']:
                        episode = season['episodes'][episode_number]
                        episode_path = os.path.join(season_path, episode['filename'])
                        if not os.path.isfile(episode_path):
                            # If the episode file doesn't exist, remove the episode from the database
                            await remove_episode(episode['id'])
    return


async def scan_system():

    series = await get_all_series()
    series_count = 0
    episode_count = 0
    file_count  = 0
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
    transcode_free_space, transcode_total_space = get_disk_space(await get_transcode_folder())

    for id in series:
        s = series[id]
        series_count += 1
        size_on_disk += s['size']
        space_saved += s['space_saved']
        episode_count += s['episode_count']
        file_count += s['episode_count']
        if s['monitored']:
            monitored_count += 1
        else:
            unmonitored_count += 1
        if s['status'] == 'Ended':
            ended_count += 1
        else:
            continuing_count += 1
        
    await set_system({'id': 'series_count', 'value': series_count})
    await set_system({'id': 'episode_count', 'value': episode_count})
    await set_system({'id': 'files_count', 'value': file_count})
    await set_system({'id': 'size_on_disk', 'value': size_on_disk})
    await set_system({'id': 'space_saved', 'value': space_saved})

    await set_system({'id': 'monitored_count', 'value': monitored_count})
    await set_system({'id': 'unmonitored_count', 'value': unmonitored_count})
    await set_system({'id': 'ended_count', 'value': ended_count})
    await set_system({'id': 'continuing_count', 'value': continuing_count})

    await set_system({'id': 'series_total_space', 'value': series_total_space})
    await set_system({'id': 'series_free_space', 'value': series_free_space})
    await set_system({'id': 'movies_total_space', 'value': movies_total_space})
    await set_system({'id': 'movies_free_space', 'value': movies_free_space})
    await set_system({'id': 'config_total_space', 'value': config_total_space})
    await set_system({'id': 'config_free_space', 'value': config_free_space})
    await set_system({'id': 'transcode_total_space', 'value': transcode_total_space})
    await set_system({'id': 'transcode_free_space', 'value': transcode_free_space})
    return