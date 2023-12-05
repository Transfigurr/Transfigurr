from src.models.codec import Codec
from src.global_state import instance_to_dict
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select

engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")

async def get_all_codecs():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Codec))
        codecs = res.scalars().all()
        return [instance_to_dict(codec) for codec in codecs]