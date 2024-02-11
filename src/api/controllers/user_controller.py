
from fastapi import Request
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.user import User
from src.utils.db import engine, instance_to_dict
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def get_user():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(User))
        user = instance_to_dict(res.scalars().first())
        return user.get('username', '')


async def set_user(request: Request):
    newUser = await request.json()
    username = newUser.get('username', '')
    password = newUser.get('password', '')
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(User))
        obj = res.scalars().first()
        if not obj:
            return
        changed = False

        if username != obj.username:
            obj.username = username
            changed = True
        if password != 'passwordplaceholder':
            obj.password = pwd_context.hash(password)
            changed = True
        if changed:
            async_session.add(obj)
            await async_session.commit()
    return
