from fastapi import APIRouter
from src.global_state import GlobalState
from src.models.settings_model import settings_model

router = APIRouter()
global_state = GlobalState()

@router.get("/api/settings")
async def get_all_settings():
    return await global_state.get_all_from_table(settings_model) 

@router.get("/api/settings/{settings_id}")
async def get_settings(settings_id):
    return await global_state.get_object_from_table(settings_model, settings_id) 

@router.put('/api/settings/{settings_id}')
async def set_settings(settings_id):
    return await global_state.set_object_to_table(settings_model, settings_id) 
