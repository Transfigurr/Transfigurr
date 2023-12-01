
from fastapi import APIRouter, Request
from src.global_state import GlobalState
from src.models.profile_model import profile_model

router = APIRouter()
global_state = GlobalState()

@router.get("/api/profiles")
async def get_all_profiles():
    return await global_state.get_all_from_table(profile_model) 

@router.get("/api/profiles/{profile_id}")
async def get_profile(profile_id):
    return await global_state.get_object_from_table(profile_model, profile_id) 

@router.put('/api/profiles')
async def set_profile(request: Request):
    profile = await request.json()
    return await global_state.set_object_to_table(profile_model, profile) 
