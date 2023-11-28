from fastapi import APIRouter, Request

from src.api.utils import get_config_folder, open_json, write_json

from src.global_state import GlobalState

global_state = GlobalState()
router = APIRouter()



@router.get("/api/settings")
async def getSettings():
    return await global_state.get_settings()

@router.put("/api/settings")
async def updateSettings(request: Request):
    req = await request.json()
    newSettings = req['settings']
    await global_state.set_settings(newSettings)
    return