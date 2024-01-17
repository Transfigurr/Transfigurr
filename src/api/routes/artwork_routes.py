from fastapi import APIRouter
from src.api.controllers.artwork_controller import get_series_poster, get_series_backdrop

router = APIRouter()


@router.get("/api/backdrop/series/{series_id}")
async def get_series_backdrop_route(series_id: str):
    return await get_series_backdrop(series_id)


@router.get("/api/poster/series/{series_id}")
async def get_series_poster_route(series_id: str):
    return await get_series_poster(series_id)
