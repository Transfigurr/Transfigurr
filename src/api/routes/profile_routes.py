
from fastapi import APIRouter, Request
from src.global_state import GlobalState
from src.models.profile import Profile

router = APIRouter()
global_state = GlobalState()

@router.get("/api/profiles")
async def get_all_profiles():
    return await global_state.get_all_from_table(Profile) 

@router.get("/api/profiles/{profile_id}")
async def get_profile(profile_id):
    return await global_state.get_object_from_table(Profile, profile_id) 

@router.put('/api/profiles')
async def set_profile(request: Request):
    profile = await request.json()
    return await global_state.set_object_to_table(Profile, profile) 
