import logging
from fastapi import APIRouter
from src.tasks.metadata import get_all_series_metadata, get_series_metadata
from src.tasks.scan import scan_all_series, scan_series

router = APIRouter()
logger = logging.getLogger('logger')


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


@router.get('/api/scan/queue')
async def scan_queue():
    return
