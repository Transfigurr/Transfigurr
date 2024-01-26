from src.models.episode import Episode
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.utils.db import engine, instance_to_dict


async def get_all_episodes():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Episode))
        return [instance_to_dict(obj) for obj in res.scalars().all()]


async def get_episode(episode_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Episode).where(Episode.id == episode_id))
        return instance_to_dict(res.scalars().first())


async def set_episode(episode):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Episode).where(Episode.id == episode['id']))
        obj = res.scalars().first()
        if obj:
            for key, value in episode.items():
                if value is not None:
                    setattr(obj, key, value)
        else:
            obj = Episode(**episode)
            async_session.add(obj)
        await async_session.commit()


async def remove_episode(episode_id: str):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Episode).where(Episode.id == episode_id))
        episode = res.scalars().first()
        if episode:
            await async_session.delete(episode)
            await async_session.commit()
