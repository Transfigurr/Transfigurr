from fastapi import APIRouter, Request
from src.global_state import GlobalState
from src.models.setting import Setting
from src.api.controllers.settings_controller import get_all_settings, set_setting

router = APIRouter()
global_state = GlobalState()

@router.get("/api/settings")
async def get_all_settings_route():
    return await get_all_settings()

@router.get("/api/settings/{settings_id}")
async def get_setting(settings_id):
    return await global_state.get_object_from_table(Setting, settings_id) 

@router.put('/api/settings')
async def set_settings(request: Request):
    return await set_setting(request)
