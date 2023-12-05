
from fastapi import APIRouter

from src.api.controllers.codec_controller import get_all_codecs
router = APIRouter()

@router.get("/api/codecs")
async def get_all_codecs_route():
    return await get_all_codecs()    
