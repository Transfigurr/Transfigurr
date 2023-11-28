
import os
from fastapi import APIRouter, Request
from src.global_state import GlobalState

from src.api.utils import get_config_folder, get_series_metadata_folder, open_json, write_json
router = APIRouter()

global_state = GlobalState()

# Profiles
@router.get("/api/profiles")
async def getProfiles():
    return await global_state.get_profiles()



@router.put("/api/series/{series_name}")
async def updateSeries(series_name, request: Request):
    await global_state.set_series_config(series_name, await request.json())
    return