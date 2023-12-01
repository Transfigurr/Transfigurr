import sqlalchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.sql import select
metadata = MetaData()

def instance_to_dict(instance):
    return {c.key: getattr(instance, c.key)
            for c in sqlalchemy.inspect(instance).mapper.column_attrs}

class GlobalState:
    def __init__(self):
        self.engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")

    async def get_all_from_table(self, model):
        async with self.engine.begin() as conn:
            async with AsyncSession(self.engine) as async_session:
                res = await async_session.execute(select(model))
                objects = res.scalars().all()
                return [instance_to_dict(obj) for obj in objects]
            
    async def get_object_from_table(self, model, id):
        async with self.engine.begin() as conn:
                async with AsyncSession(self.engine) as async_session:
                    result = await async_session.execute(select(model).where(model.id == id))
                    obj = result.scalars().first()
                    return instance_to_dict(obj)
                
    async def set_object_to_table(self, model, o):
        async with AsyncSession(self.engine) as async_session:
            result = await async_session.execute(select(model).where(model.id == o['id']))
            obj = result.scalars().first()
            if obj:
                for key, value in o.items():
                    setattr(obj, key, value)
            else:
                obj = model(**o)
                async_session.add(obj)
            await async_session.commit()