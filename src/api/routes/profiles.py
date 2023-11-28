
from fastapi import APIRouter, Request
from src.global_state import GlobalState

from src.api.utils import get_config_folder, open_json, write_json
router = APIRouter()

global_state = GlobalState()

# Profiles
@router.get("/api/profiles")
async def getProfiles():
    return await global_state.get_profiles()



@router.put("/api/profiles/{profile_id}")
async def updateProfile(profile_id, request: Request):
    profiles = await getProfiles()
    req = await request.json()
    newProfile = req['profile']
    profiles[profile_id] = newProfile
    await global_state.set_profiles(profiles)
    return