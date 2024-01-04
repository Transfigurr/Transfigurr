
from fastapi import Request
from src.global_state import GlobalState
from src.models.setting import Setting
from sqlalchemy import delete, insert

from src.global_state import GlobalState, instance_to_dict
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


global_state = GlobalState()

async def get_all_settings():
    settings = await global_state.get_all_from_table(Setting)
    s = {}
    for setting in settings:
        s[setting['id']] = setting['value']
    return s
        

async def get_setting(setting_id):
    return await global_state.get_object_from_table(Setting, setting_id) 

async def set_setting(request: Request):
    setting = await request.json()
    print('test',setting)
    async with AsyncSession(engine) as async_session:
        result = await async_session.execute(select(Setting).where(Setting.id == setting['id']))
        obj = result.scalars().first()
        if obj:
            for key, value in setting.items():
                if value is not None:
                    setattr(obj, key, value)
        else:
            obj = setting(**setting)
            async_session.add(obj)
        await async_session.commit() 
    return

async def delete_setting(setting_id):
    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(Setting).where(Setting.id == setting_id))
        await async_session.commit()