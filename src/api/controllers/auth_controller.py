import secrets
from fastapi import Depends, HTTPException, Query
from jose import jwt
import jose
from src.models.user import User
from src.utils.db import engine, instance_to_dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def generate_secret_key(length=32):
    return secrets.token_hex(length)


async def get_user():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(User))
        return instance_to_dict(res.scalars().first())


def create_access_token(data: dict, secret):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, secret, algorithm="HS256")
    return encoded_jwt


async def get_activated():
    user = await get_user()
    if not user:
        return False
    return True


async def login(username, password):
    user = await get_user()
    if not user or username != user['username'] or not pwd_context.verify(password, user['password']):
        raise HTTPException(status_code=401, detail="Unauthorized")
    secret = user.get('secret', '')
    access_token = create_access_token(data={"sub": user['username']}, secret=secret)
    return access_token


async def register(username, password):
    user = await get_user()
    if user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    secret = generate_secret_key()
    async with AsyncSession(engine) as async_session:
        async_session.add(User(username=username, password=pwd_context.hash(password), secret=secret))
        await async_session.commit()
    return True


async def login_with_token(token: str = Depends(oauth2_scheme)):
    user = await get_user()
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        payload = jwt.decode(token, user.get('secret', ''), algorithms=["HS256"])
        username = payload.get("sub")
        if username != user['username']:
            raise HTTPException(status_code=401, detail="Unauthorized")
    except jose.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    return


async def login_websocket(token: str = Query(...)):
    user = await get_user()
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        secret = user.get('secret', '')
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        username = payload.get("sub")
        if username != user['username']:
            raise HTTPException(status_code=401, detail="Unauthorized")
    except jose.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    return
