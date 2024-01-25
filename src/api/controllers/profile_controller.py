
from src.models.profile import Profile, profile_codec
from sqlalchemy import delete, insert
from src.global_state import GlobalState, instance_to_dict
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


global_state = GlobalState()


async def get_all_profiles():
    profiles = await global_state.get_all_from_table(Profile)
    p = {}
    for profile in profiles:
        async with AsyncSession(engine) as async_session:
            query = await async_session.execute(select(profile_codec).where(profile_codec.profile_id == profile['id']))
            res = query.scalars().all()
            profile['codecs'] = [(instance_to_dict(obj))['codec_id'] for obj in res]
            p[profile['id']] = profile
    return p


async def get_profile(profile_id):
    return await global_state.get_object_from_table(Profile, profile_id)


async def set_profile(profile):
    codec_ids = profile.pop('codecs', [])
    profile_id = 0
    async with AsyncSession(engine) as async_session:
        if 'id' in profile:
            profile_id = profile['id']
            result = await async_session.execute(select(Profile).where(Profile.id == profile['id']))
            obj = result.scalars().first()
            if obj:
                for key, value in profile.items():
                    if value is not None:
                        setattr(obj, key, value)
            else:
                obj = Profile(**profile)
                async_session.add(obj)
            await async_session.commit()
        else:
            obj = Profile(**profile)
            async_session.add(obj)
            await async_session.commit()
            await async_session.flush()  # Flush to get the id of the new profile
            await async_session.refresh(obj)  # Refresh the object to get the new id
            profile_id = obj.id

    async with AsyncSession(engine) as async_session:

        # Delete all profile_codec entries associated with the profile
        await async_session.execute(delete(profile_codec).where(profile_codec.profile_id == profile_id))

        # Add the codecs to the profile
        for codec_id in codec_ids:
            stmt = insert(profile_codec).values(profile_id=profile_id, codec_id=codec_id)
            await async_session.execute(stmt)
        # Commit the changes to the database
        await async_session.commit()

    return


async def delete_profile(profile_id):
    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(Profile).where(Profile.id == profile_id))
        await async_session.commit()
