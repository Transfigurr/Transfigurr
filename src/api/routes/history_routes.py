from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.history_controller import get_all_historys, get_history, set_history
router = APIRouter()


@router.get("/api/history")
async def get_all_history_route(user: str = Depends(login_with_token)):
    return await get_all_historys()


@router.get("/api/history/{history_id}")
async def get_setting(history_id, user: str = Depends(login_with_token)):
    return await get_history(history_id)


@router.put('/api/history')
async def set_settings(request: Request, user: str = Depends(login_with_token)):
    history = await request.json()
    return await set_history(history)
