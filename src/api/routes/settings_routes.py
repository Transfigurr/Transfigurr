from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.settings_controller import delete_setting, get_all_settings, get_setting, set_setting
router = APIRouter()


@router.get("/api/settings", tags=["Settings"], name="Get All Settings")
async def get_all_settings_route(user: str = Depends(login_with_token)):
    return await get_all_settings()


@router.get("/api/settings/{settings_id}", tags=["Settings"], name="Get Setting By Id")
async def get_setting_route(settings_id, user: str = Depends(login_with_token)):
    return await get_setting(settings_id)


@router.put('/api/settings', tags=["Settings"], name="Set Setting")
async def set_settings(request: Request, user: str = Depends(login_with_token)):
    return await set_setting(request)


@router.delete("/api/settings/{settings_id}", tags=["Settings"], name="Delete Setting By Id")
async def delete_setting_route(settings_id, user: str = Depends(login_with_token)):
    return await delete_setting(settings_id)
