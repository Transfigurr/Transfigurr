from fastapi import APIRouter, Depends
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.codec_controller import get_all_codecs, get_all_containers, get_all_encoders
router = APIRouter()


@router.get("/api/codecs", tags=["Codec"])
async def get_all_codecs_route(user: str = Depends(login_with_token)):
    return await get_all_codecs()


@router.get('/api/containers', tags=["Codec"])
async def get_all_containers_route(user: str = Depends(login_with_token)):
    return await get_all_containers()


@router.get('/api/encoders', tags=["Codec"])
async def get_all_encoders_route(user: str = Depends(login_with_token)):
    return await get_all_encoders()
