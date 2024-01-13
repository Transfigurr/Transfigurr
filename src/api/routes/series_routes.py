
from fastapi import APIRouter, Request
from src.api.controllers.series_controller import get_all_series, get_series, set_series
router = APIRouter()


@router.get("/api/series")
async def get_all_series_route():
    return await get_all_series()


@router.get("/api/series/{series_id}")
async def get_series_route(series_id):
    return await get_series(series_id)


@router.put('/api/series/{series_id}')
async def set_series_route(request: Request):
    return await set_series(await request.json())
