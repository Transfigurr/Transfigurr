
from fastapi import Request
from src.global_state import GlobalState
from src.models.codec import Codec
from src.models.profile import Profile, profile_codec
from sqlalchemy import delete, insert

from src.models.series import Series
from src.global_state import GlobalState, instance_to_dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import Session
engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


global_state = GlobalState()

async def get_all_profiles():
    profiles = await global_state.get_all_from_table(Profile)
    for profile in profiles:
        async with AsyncSession(engine) as async_session:
            query = await async_session.execute(select(profile_codec).where(profile_codec.profile_id == profile['id']))
            res = query.scalars().all()
            profile['codecs'] = [(instance_to_dict(obj))['codec_id'] for obj in res]
    return profiles
        

async def get_profile(profile_id):
    return await global_state.get_object_from_table(Profile, profile_id) 

async def set_profile(request: Request):
    profile = await request.json()
    codec_ids = profile['codecs']
    await global_state.set_object_to_table(Profile, profile) 

    async with AsyncSession(engine) as async_session:

        # Delete all profile_codec entries associated with the profile
        await async_session.execute(delete(profile_codec).where(profile_codec.profile_id == profile['id']))

        # Add the codecs to the profile
        for codec_id in codec_ids:
            stmt = insert(profile_codec).values(profile_id=profile['id'], codec_id=codec_id)
            await async_session.execute(stmt)

        # Commit the changes to the database
        await async_session.commit()

    return

