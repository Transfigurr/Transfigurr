
from fastapi import APIRouter, Request
from src.api.controllers.series_controller import get_all_series, get_series, set_series
from src.tasks.scan import scan_series, scan_system
from src.tasks.validate import validate_series
router = APIRouter()


@router.get("/api/series")
async def get_all_series_route():
    return await get_all_series()


@router.get("/api/series/{series_id}")
async def get_series_route(series_id):
    return await get_series(series_id)


@router.put('/api/series/{series_id}')
async def set_series_route(request: Request):
    series = await request.json()
    await set_series(series)
    await validate_series(series['id'])
    await scan_series(series['id'])
    await scan_system()
    return
