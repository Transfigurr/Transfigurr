from fastapi import APIRouter
from src.api.controllers.episode_controller import get_all_episodes
from src.api.controllers.series_controller import get_series
from src.api.routes.profile_routes import get_all_profiles
from src.models.queue import queue_instance
from src.tasks.metadata import get_all_series_metadata, get_series_metadata
from src.tasks.scan import scan_all_series, scan_series, validate_database

router = APIRouter()


@router.put("/api/scan/series/metadata")
async def get_all_series_metadata_route():
    await get_all_series_metadata()
    return


@router.get("/api/scan/series/metadata/{series_id}")
async def get_series_metadata_route(series_id):
    await get_series_metadata(series_id)
    return


@router.put('/api/scan/series')
async def scan_all_series_route():
    await scan_all_series()
    return


@router.get("/api/scan/series/{series_name}")
async def scan_series_route(series_name):
    await scan_series(series_name)
    return


@router.get('/api/scan/validate')
async def validate_database_route():
    await validate_database()
    return


@router.get('/api/scan/queue')
async def scan_queue():
    episodes = await get_all_episodes()
    profiles = await get_all_profiles()
    for episode in episodes:
        series = await get_series(episode['series_id'])
        profile_id = series['profile_id']
        monitored = series['monitored']
        if not monitored:
            continue
        profile = profiles[profile_id]
        targets = profile['codecs']
        wanted = profile['codec']
        if (episode['video_codec'] in targets or 'Any' in targets) and wanted != 'Any' and episode['video_codec'] != wanted:
            print('adding to queue', episode)
            await queue_instance.enqueue(episode)
