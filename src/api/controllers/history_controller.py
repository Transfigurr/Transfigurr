
from sqlalchemy.future import select
from src.api.controllers.episode_controller import get_episode
from src.api.controllers.profile_controller import get_profile
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.history import History
from src.utils.db import engine, instance_to_dict


async def get_all_historys():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(History))
        historys = [instance_to_dict(profile) for profile in res.scalars().all()]
        return historys


async def get_history(history_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(History).where(History.id == history_id))
        res = {}
        for h in res.scalars().first():
            res[h['id']] = h
            episode = await get_episode(h['episode_id'])
            profile = await get_profile(h['profile_id'])
            res[h['id']]['episode'] = episode
            res[h['id']]['profile'] = profile
        return res


async def set_history(history):
    async with AsyncSession(engine) as async_session:
        obj = History(**history)
        async_session.add(obj)
        await async_session.commit()
    return


async def delete_history(history_id):
    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(History).where(History.id == history_id))
        await async_session.commit()
