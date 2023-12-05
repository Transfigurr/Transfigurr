from src.models.season import Season
from src.global_state import GlobalState
global_state = GlobalState()
import sqlalchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
metadata = MetaData()


def instance_to_dict(instance):
    if not instance:
        return {}
    return {c.key: getattr(instance, c.key)
            for c in sqlalchemy.inspect(instance).mapper.column_attrs}

engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


async def get_all_seasons():
    return await global_state.get_all_from_table(Season)

async def get_seasons_by_id(series_id):
    async with engine.begin() as conn:
        async with AsyncSession(engine) as async_session:
            res = await async_session.execute(select(Season).where(Season.series_id == series_id))
            objects = res.scalars().all()
            return [instance_to_dict(obj) for obj in objects]

async def get_season(season_name):
    return await global_state.get_object_from_table(Season, season_name)


async def set_season(season):
    return await global_state.set_object_to_table(Season, season)



async def remove_season(season_id: str):
    async with AsyncSession(engine) as async_session:
        result = await async_session.execute(select(Season).where(Season.id == season_id))
        season = result.scalars().first()
        if season:
            await async_session.delete(season)
            await async_session.commit()