
from fastapi import APIRouter
from src.global_state import GlobalState
from src.models.series_model import series_model

router = APIRouter()
global_state = GlobalState()

@router.get("/api/series")
async def get_all_series():
    return await global_state.get_all_from_table(series_model) 

@router.get("/api/series/{series_name}")
async def get_series(series_name):
    return await global_state.get_object_from_table(series_model, series_name) 

@router.put('/api/series/{series_name}')
async def set_series(series_name):
    return await global_state.set_object_to_table(series_model, series_name) 
