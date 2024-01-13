
from fastapi import APIRouter, Request
from src.api.controllers.system_controller import get_all_system, get_system, set_system
router = APIRouter()


@router.get("/api/system")
async def get_all_series_route():
    return await get_all_system()


@router.get("/api/system/{system_id}")
async def get_series_route(system_id):
    return await get_system(system_id)


@router.put('/api/system/{system_id}')
async def set_series_route(request: Request):
    return await set_system(await request.json())
