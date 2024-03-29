
from fastapi import Request
from src.models.setting import Setting
from sqlalchemy import delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.db import engine, instance_to_dict
from src.api.controllers.user_controller import get_user


async def get_all_settings():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Setting))
        settings = {instance_to_dict(obj)['id']: instance_to_dict(obj)['value'] for obj in res.scalars().all()}
        settings['username'] = await get_user()
        return settings


async def get_setting(setting_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Setting).where(Setting.id == setting_id))
        return instance_to_dict(res.scalars().first())


async def set_setting(request: Request):
    setting = await request.json()
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Setting).where(Setting.id == setting['id']))
        obj = res.scalars().first()
        if obj:
            for key, value in setting.items():
                if value is not None:
                    setattr(obj, key, value)
            await async_session.commit()
    return


async def delete_setting(setting_id):
    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(Setting).where(Setting.id == setting_id))
        await async_session.commit()
