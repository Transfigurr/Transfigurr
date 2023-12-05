from dataclasses import asdict
import os
import re
from src.api.controllers.episode_controller import get_episode, remove_episode, set_episode
from src.api.controllers.season_controller import remove_season, set_season
from src.api.controllers.series_controller import get_all_series, get_full_series, get_series, remove_series, set_series
from src.api.routes.scan_routes import get_series_metadata
from src.api.utils import analyze_media_file, get_series_folder
from src.models.episode import Episode
from src.models.season import Season
from src.models.series import Series


async def scan_all_series():
    series_folder = await get_series_folder()
    for series_name in os.listdir(series_folder):
        if series_name == ".DS_Store":
            continue
        await scan_series(series_name)
    return



async def scan_series(series_id):
    if series_id in [".DS_Store", '']:
        return

    series_path = os.path.join(await get_series_folder(), series_id)
    if not os.path.isdir(series_path):
        return
    missing_metadata = False
    # Create a new Series instance
    series_dict = await get_series(series_id)
    series = Series(**series_dict)
    series.id = series_id
    series.name = series_id
    series.profile_id = 0
    if not series.name:
        missing_metadata = True
    pattern = re.compile(r"(?:S(\d{2})E(\d{2})|E(\d{2}))")
    for season_name in os.listdir(series_path):
        if season_name == ".DS_Store":
            continue

        season_number = int("".join(re.findall(r'\d+', season_name)))
        season_path = os.path.join(series_path, season_name)

        # Create a new Season instance and link it to the Series
        season = Season()
        season.id = str(series_id)+str(season_number)
        season.season_number = season_number
        season.name = season_name
        season.series_id = series_id
        await set_season(asdict(season))

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
            episode = Episode()
            episode.id = str(series_id) + str(season_number) + str(episode_number)
            episode.series_id = series_id
            episode.episode_number = episode_number
            episode.filename = file
            episode.video_codec = analysis_data
            episode.season_name = season_name
            episode.season_id = season.id

            test = await get_episode(episode.id)
            if 'episode_name' not in test:
                missing_metadata = True

            await set_episode(asdict(episode))

    # Save the Series instance to the database
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
