from fastapi import APIRouter, Depends
from src.api.controllers.artwork_controller import get_series_poster, get_series_backdrop
from src.api.controllers.auth_controller import login_with_token

router = APIRouter()


@router.get("/api/backdrop/series/{series_id}")
async def get_series_backdrop_route(series_id: str, user: str = Depends(login_with_token)):
    return await get_series_backdrop(series_id)


@router.get("/api/poster/series/{series_id}")
async def get_series_poster_route(series_id: str, user: str = Depends(login_with_token)):
    return await get_series_poster(series_id)
