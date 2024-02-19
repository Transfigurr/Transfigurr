from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.settings_controller import get_all_settings, get_setting, set_setting
router = APIRouter()


@router.get("/api/settings")
async def get_all_settings_route(user: str = Depends(login_with_token)):
    return await get_all_settings()


@router.get("/api/settings/{settings_id}")
async def get_setting_route(settings_id, user: str = Depends(login_with_token)):
    return await get_setting(settings_id)


@router.put('/api/settings')
async def set_settings(request: Request, user: str = Depends(login_with_token)):
    return await set_setting(request)
