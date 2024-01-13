
from fastapi import APIRouter
from src.global_state import GlobalState
from src.models.episode import Episode

router = APIRouter()
global_state = GlobalState()


@router.get("/api/episode")
async def get_all_episode():
    return await global_state.get_all_from_table(Episode)


@router.get("/api/episode/{episode_id}")
async def get_episode(episode_id):
    return await global_state.get_object_from_table(Episode, episode_id)


@router.put('/api/episode/{episode_id}')
async def set_episode(episode_id):
    return await global_state.set_object_to_table(Episode, episode_id)
