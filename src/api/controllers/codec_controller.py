from src.global_state import GlobalState
from src.models.codec import Codec, codec_container
from src.global_state import instance_to_dict
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select

from src.models.container import Container

global_state = GlobalState()
engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")

async def get_all_codecs():
    codecs = await global_state.get_all_from_table(Codec)
    containers = await global_state.get_all_from_table(Container)
    for codec in codecs:
        async with AsyncSession(engine) as async_session:
            query = await async_session.execute(select(codec_container).where(codec_container.codec_id == codec['id']))
            res = query.scalars().all()
            codec['containers'] = [(instance_to_dict(obj))['container_id'] for obj in res]
    return codecs   