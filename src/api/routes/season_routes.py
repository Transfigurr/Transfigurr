
from fastapi import APIRouter, Depends
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.season_controller import get_all_seasons, get_season, set_season, remove_season
router = APIRouter()


@router.get("/api/season", tags=["Season"], description="Get all Seasons")
async def get_all_seasons_route(user: str = Depends(login_with_token)):
    return await get_all_seasons()


@router.get("/api/season/{season_id}", tags=["Season"], description="Get Season by ID")
async def get_season_route(season_id, user: str = Depends(login_with_token)):
    return await get_season(season_id)


@router.put('/api/season/{season}', tags=["Season"], description="Upsert a season. If the season exists, it is updated. Otherwise, a new season is created.")
async def set_season_route(season, user: str = Depends(login_with_token)):
    return await set_season(season)


@router.delete("/api/season/{season_id}", tags=["Season"], description="Remove a Season by ID")
async def remove_season_route(season_id, user: str = Depends(login_with_token)):
    return await remove_season(season_id)
