from src.models.system import System
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.utils.db import engine, instance_to_dict


async def get_all_system():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(System))
        s = {}
        for system in res.scalars().all():
            s[system.id] = system.value
    return s


async def get_system(system_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(System).where(System.id == system_id))
        return instance_to_dict(res.scalars().first())


async def set_system(system):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(System).where(System.id == system['id']))
        s = res.scalars().first()
        if s:
            for key, value in system.items():
                if value is not None:
                    setattr(s, key, value)
        else:
            s = System(**system)
            async_session.add(s)
        await async_session.commit()
