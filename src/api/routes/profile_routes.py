
from fastapi import APIRouter, Request
from src.global_state import GlobalState
from src.api.controllers.profile_controller import delete_profile, get_all_profiles, get_profile, set_profile
router = APIRouter()
global_state = GlobalState()


@router.get("/api/profiles")
async def get_all_profiles_route():
    return await get_all_profiles()


@router.get("/api/profiles/{profile_id}")
async def get_profile_route(profile_id):
    return await get_profile(profile_id)


@router.put('/api/profiles')
async def set_profile_route(request: Request):
    return await set_profile(request)


@router.delete('/api/profiles/{profile_id}')
async def delete_profile_route(profile_id):
    await delete_profile(profile_id)
    return
