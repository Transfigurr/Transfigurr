from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.season import Season
from src.utils.db import engine, instance_to_dict


async def get_all_seasons():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Season))
        return [instance_to_dict(obj) for obj in res.scalars().all()]


async def get_seasons_by_id(series_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Season).where(Season.series_id == series_id))
        return [instance_to_dict(obj) for obj in res.scalars().all()]


async def get_season(season_name):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Season).where(Season.id == season_name))
        return instance_to_dict(res.scalars().first())


async def set_season(season):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Season).where(Season.id == season['id']))
        obj = res.scalars().first()
        if obj:
            for key, value in season.items():
                if value is not None:
                    setattr(obj, key, value)
        else:
            obj = Season(**season)
            async_session.add(obj)
        await async_session.commit()


async def remove_season(season_id: str):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Season).where(Season.id == season_id))
        season = res.scalars().first()
        if season:
            await async_session.delete(season)
            await async_session.commit()
