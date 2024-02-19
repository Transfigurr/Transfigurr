from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.user_controller import get_user, set_user
router = APIRouter()


@router.get("/api/user")
async def get_user_route(user: str = Depends(login_with_token)):
    return await get_user()


@router.put('/api/user')
async def set_settings(request: Request, user: str = Depends(login_with_token)):
    return await set_user(request)
