from fastapi import APIRouter
from src.api.controllers.codec_controller import get_all_codecs, get_all_containers, get_all_encoders
router = APIRouter()

@router.get("/api/codecs")
async def get_all_codecs_route():
    return await get_all_codecs()

@router.get('/api/containers')
async def get_all_containers_route():
    return await get_all_containers()

@router.get('/api/encoders')
async def get_all_encoders_route():
    return await get_all_encoders()
