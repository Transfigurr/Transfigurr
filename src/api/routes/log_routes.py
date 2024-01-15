
from fastapi import APIRouter
from src.api.controllers.log_controller import get_all_logs, get_log
router = APIRouter()


@router.get("/api/log")
async def get_all_log_route():
    return await get_all_logs()


@router.get("/api/log/{log_id}")
async def get_log_route(log_id):
    return await get_log(log_id)
