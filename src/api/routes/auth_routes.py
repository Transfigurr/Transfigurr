from fastapi import APIRouter, Header, Request
from src.api.controllers.auth_controller import get_activated, login, login_with_token, register
router = APIRouter()


@router.post("/api/login")
async def login_route(request: Request):
    data = await request.json()
    return await login(data.get('username', ''), data.get('password', ''))


@router.post('/api/register')
async def register_route(request: Request):
    data = await request.json()
    return await register(data.get('username', ''), data.get('password', ''))


@router.get('/api/activated')
async def get_activated_route():
    return await get_activated()


@router.post('/api/logintoken')
async def login_with_token_route(authorization: str = Header(None)):
    return await login_with_token(authorization)
