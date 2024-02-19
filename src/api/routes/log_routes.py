
from fastapi import APIRouter, Depends
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.log_controller import get_all_logs, get_log
router = APIRouter()


@router.get("/api/log")
async def get_all_log_route(user: str = Depends(login_with_token)):
    return await get_all_logs()


@router.get("/api/log/{log_id}")
async def get_log_route(log_id, user: str = Depends(login_with_token)):
    return await get_log(log_id)
