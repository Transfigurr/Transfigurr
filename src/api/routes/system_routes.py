
from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.system_controller import get_all_system, get_system, set_system
router = APIRouter()


@router.get("/api/system", tags=["System"], name="Get All System Info")
async def get_all_system_route(user: str = Depends(login_with_token)):
    return await get_all_system()


@router.get("/api/system/{system_id}", tags=["System"], name="Get System Info By Id")
async def get_system_route(system_id: str, user: str = Depends(login_with_token)):
    return await get_system(system_id)


@router.put('/api/system/{system_id}', tags=["System"], name="Update System Info")
async def set_system_route(system_id: str, request: Request, user: str = Depends(login_with_token)):
    return await set_system(await request.json())
