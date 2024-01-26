from src.api.controllers.episode_controller import remove_episode
from src.api.controllers.season_controller import remove_season
from src.models.episode import Episode
from src.models.series import Series
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.season import Season
from sqlalchemy.future import select
from src.utils.db import engine, instance_to_dict


async def get_all_series():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Series))
        series_dict = {}
        for obj in res.scalars().all():
            series_dict[obj.id] = await get_full_series(obj.id)
        return series_dict


async def get_series(series_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Series).where(Series.id == series_id))
        obj = res.scalars().first()
        return instance_to_dict(obj)


async def set_series(series):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Series).where(Series.id == series['id']))
        s = res.scalars().first()
        if s:
            for key, value in series.items():
                if value is not None:
                    setattr(s, key, value)
        else:
            s = Series(**series)
            async_session.add(s)
        await async_session.commit()


async def get_full_series(series_id: str):
    async with AsyncSession(engine) as async_session:
        series = await get_series(series_id)
        res = await async_session.execute(select(Season).where(Season.series_id == series_id))
        seasons = {}
        for season in res.scalars().all():
            res = await async_session.execute(select(Episode).where(Episode.season_id == season.id))
            season = instance_to_dict(season)
            season['episodes'] = {}
            for episode in res.scalars().all():
                episode = instance_to_dict(episode)
                season['episodes'][episode['episode_number']] = episode
            seasons[season['season_number']] = season
        series['seasons'] = seasons
        return series


async def remove_series(series_id: str):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Series).where(Series.id == series_id))
        series = res.scalars().first()
        full_series = await get_full_series(series_id)
        if series:
            for season_number in full_series['seasons']:
                season = full_series['seasons'][season_number]
                for episode_number in season['episodes']:
                    episode = season['episodes'][episode_number]
                    await remove_episode(episode['id'])
                await remove_season(season['id'])
            await async_session.delete(series)
            await async_session.commit()
