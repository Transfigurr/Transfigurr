
from fastapi import APIRouter
from src.global_state import GlobalState
from src.models.season import Season

router = APIRouter()
global_state = GlobalState()

@router.get("/api/season")
async def get_all_season():
    return await global_state.get_all_from_table(Season) 

@router.get("/api/season/{season_id}")
async def get_season(season_id):
    return await global_state.get_object_from_table(Season, season_id) 

@router.put('/api/season/{season}')
async def set_season(season):
    return await global_state.set_object_to_table(Season, season) 
