
from fastapi import APIRouter, Depends
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.episode_controller import get_all_episodes, get_episode, remove_episode, set_episode
router = APIRouter()


@router.get("/api/episode", tags=["Episode"], name="Get All Episodes")
async def get_all_episodes_route(user: str = Depends(login_with_token)):
    return await get_all_episodes()


@router.get("/api/episode/{episode_id}", tags=["Episode"], name="Get Episode By Id")
async def get_episode_route(episode_id, user: str = Depends(login_with_token)):
    return await get_episode(episode_id)


@router.put('/api/episode/{episode_id}', tags=["Episode"], name="Upsert Episode By Id")
async def set_episode_route(episode_id, user: str = Depends(login_with_token)):
    return await set_episode(episode_id)


@router.delete('/api/episode/{episode_id}', tags=["Episode"], name="Delete Episode By Id")
async def delete_episode_route(episode_id, user: str = Depends(login_with_token)):
    return await remove_episode(episode_id)
