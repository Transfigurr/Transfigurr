from src.models.log import Log
from src.global_state import GlobalState, instance_to_dict
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select


global_state = GlobalState()
engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


async def get_all_logs():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Log).order_by(Log.timestamp.desc()))
        logs = res.scalars().all()
        return [instance_to_dict(log) for log in logs]


async def get_log(log_id):
    async with AsyncSession(engine) as async_session:
        result = await async_session.execute(select(Log).where(Log.id == log_id))
        obj = result.scalars().first()
        return instance_to_dict(obj)
