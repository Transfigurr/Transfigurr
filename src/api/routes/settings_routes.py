from fastapi import APIRouter
from src.global_state import GlobalState
from src.models.setting import Setting

router = APIRouter()
global_state = GlobalState()

@router.get("/api/settings")
async def get_all_settings():
    return await global_state.get_all_from_table(Setting) 

@router.get("/api/settings/{settings_id}")
async def get_setting(settings_id):
    return await global_state.get_object_from_table(Setting, settings_id) 

@router.put('/api/settings/{settings_id}')
async def set_settings(settings_id):
    return await global_state.set_object_to_table(Setting, settings_id) 
