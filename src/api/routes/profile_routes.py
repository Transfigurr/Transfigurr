
import asyncio
from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.profile_controller import delete_profile, get_all_profiles, get_profile, set_profile
router = APIRouter()


@router.get("/api/profiles", tags=["Profiles"])
async def get_all_profiles_route(user: str = Depends(login_with_token)):
    return await get_all_profiles()


@router.get("/api/profiles/{profile_id}", tags=["Profiles"])
async def get_profile_route(profile_id, user: str = Depends(login_with_token)):
    return await get_profile(profile_id)


async def after_profile(profile):
    from src.services.scan_service import scan_service
    await scan_service.enqueue_by_profile(profile['id'])
    return


@router.put('/api/profiles', tags=["Profiles"])
async def set_profile_route(request: Request, user: str = Depends(login_with_token)):
    profile = await request.json()
    await set_profile(profile)
    asyncio.create_task(after_profile(profile))
    return


@router.delete('/api/profiles/{profile_id}', tags=["Profiles"])
async def delete_profile_route(profile_id, user: str = Depends(login_with_token)):
    await delete_profile(profile_id)
    return
