import logging
import os
from src.api.controllers.series_controller import get_all_series, get_full_series
from src.api.controllers.series_controller import remove_episode, remove_season, remove_series
from src.utils.folders import get_series_folder
logger = logging.getLogger('logger')


async def validate_all_series():
    for series_id in await get_all_series():
        await validate_series(series_id)


async def validate_series(series_id):
    try:
        logger.info(f"Validating {series_id}", extra={'service': 'Scan'})
        series = await get_full_series(series_id)
        series_path = os.path.join(await get_series_folder(), series_id)
        if not os.path.isdir(series_path):
            await remove_series(series_id)
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
        logger.error(f"An error occurred while validating {series_id}: {e}", extra={'service': 'Scan'})
    return
