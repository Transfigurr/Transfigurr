from src.models.movie import Movie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.utils.db import engine, instance_to_dict


async def get_all_movies():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Movie))
        movies_dict = {}
        for obj in res.scalars().all():
            movies_dict[obj.id] = instance_to_dict(obj)
        return movies_dict


async def get_movie(movie_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Movie).where(Movie.id == movie_id))
        obj = res.scalars().first()
        return instance_to_dict(obj)


async def set_movie(movie):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Movie).where(Movie.id == movie['id']))
        m = res.scalars().first()
        if m:
            for key, value in movie.items():
                if value is not None:
                    setattr(m, key, value)
        else:
            m = Movie(**movie)
            async_session.add(m)
        await async_session.commit()


async def remove_movie(movie_id: str):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Movie).where(Movie.id == movie_id))
        movie = res.scalars().first()
        if movie:
            await async_session.delete(movie)
            await async_session.commit()
