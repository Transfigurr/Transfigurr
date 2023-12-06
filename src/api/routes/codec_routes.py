
from fastapi import APIRouter

from src.api.controllers.codec_controller import get_all_codecs
from src.models.codec import default_codecs
router = APIRouter()

@router.get("/api/codecs")
async def get_all_codecs_route():
    return codecs  


@router.get('/api/containers')
async def get_all_containers_route():
    return containers


containers = {
    "mp4": {"extensions": ["mp4","m4a","m4v","f4v","f4a","m4b","m4r","f4b","mov"]},
    "matroska": {"extensions": ["mkv","mk3d","mka","mks"]},
}


codecs = {
    "Any": {"containers":[], "encoders":[]},
    "h264": {"containers":["mp4","matroska"], "encoders":["libx264", "h264"]},
    "hevc": {"containers":["mp4","matroska"], "encoders":["libx265"]},
    "mpeg4": {"containers":["mp4","matroska"], "encoders":["mpeg4"]},
    "vp8": {"containers":["mp4","matroska"], "encoders":["libvpx-vp8"]},
    "vp9" : {"containers":["mp4","matroska"], "encoders":["libvpx-vp9"]},
    "av1": {"containers":["mp4","matroska"], "encoders":["libaom-av1"]},
}