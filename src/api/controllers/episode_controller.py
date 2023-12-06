from src.models.episode import Episode
from src.global_state import GlobalState
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select

global_state = GlobalState()
engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")

async def get_all_episodes():
    return await global_state.get_all_from_table(Episode)

async def get_episode(episode_id):
    return await global_state.get_object_from_table(Episode, episode_id)

async def set_episode(episode):
    return await global_state.set_object_to_table(Episode, episode)


async def remove_episode(episode_id: str):
    async with AsyncSession(engine) as async_session:
        result = await async_session.execute(select(Episode).where(Episode.id == episode_id))
        episode = result.scalars().first()
        if episode:
            await async_session.delete(episode)
            await async_session.commit()