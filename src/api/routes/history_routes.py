from fastapi import APIRouter, Request
from src.api.controllers.history_controller import get_all_historys, get_history, set_history
router = APIRouter()


@router.get("/api/history")
async def get_all_history_route():
    return await get_all_historys()


@router.get("/api/history/{history_id}")
async def get_setting(history_id):
    return await get_history(history_id)


@router.put('/api/history')
async def set_settings(request: Request):
    history = await request.json()
    return await set_history(history)
