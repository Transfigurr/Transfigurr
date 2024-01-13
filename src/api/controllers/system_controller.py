from src.models.system import System
from src.global_state import GlobalState, instance_to_dict
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select


global_state = GlobalState()
engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


async def get_all_system():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(System))
        systems = res.scalars().all()
        s = {}
        for system in systems:
            s[system.id] = system.value
    return s


async def get_system(system_id):
    async with AsyncSession(engine) as async_session:
        result = await async_session.execute(select(System).where(System.id == system_id))
        obj = result.scalars().first()
        return instance_to_dict(obj)


async def set_system(system):
    async with AsyncSession(engine) as async_session:
        result = await async_session.execute(select(System).where(System.id == system['id']))
        s = result.scalars().first()
        if s:
            for key, value in system.items():
                if value is not None:
                    setattr(s, key, value)
        else:
            s = System(**system)
            async_session.add(s)
        await async_session.commit()
