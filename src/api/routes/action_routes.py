from fastapi import APIRouter, Depends
from src.api.controllers.actions_controller import restart, shutdown
from src.api.controllers.auth_controller import login_with_token
router = APIRouter()


@router.put("/api/actions/restart", tags=["Actions"])
async def restart_route(user: str = Depends(login_with_token)):
    return await restart()


@router.put('/api/actions/shutdown', tags=["Actions"])
async def shutdown_route(user: str = Depends(login_with_token)):
    return await shutdown()
