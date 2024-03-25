
from src.api.controllers.settings_controller import get_all_settings
from src.models.profile import Profile
from src.models.profile_audio_language import Profile_Audio_Language
from src.models.profile_codec import Profile_Codec
from sqlalchemy import delete, insert
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.profile_subtitle_language import Profile_Subtitle_Language
from src.utils.db import engine, instance_to_dict


async def get_all_profiles():
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Profile))
        profiles = [instance_to_dict(profile) for profile in res.scalars().all()]
        p = {}
        for profile in profiles:
            profile_codecs = await async_session.execute(select(Profile_Codec).where(Profile_Codec.profile_id == profile['id']))
            profile_audio_languages = await async_session.execute(select(Profile_Audio_Language).where(Profile_Audio_Language.profile_id == profile['id']))
            profile_subtitle_languages = await async_session.execute(select(Profile_Subtitle_Language).where(Profile_Subtitle_Language.profile_id == profile['id']))
            profile['audio_languages'] = [(instance_to_dict(obj))['language'] for obj in profile_audio_languages.scalars().all()]
            profile['subtitle_languages'] = [(instance_to_dict(obj))['language'] for obj in profile_subtitle_languages.scalars().all()]
            profile['codecs'] = [(instance_to_dict(obj))['codec_id'] for obj in profile_codecs.scalars().all()]
            p[profile['id']] = profile
        return p


async def get_profile(profile_id):
    async with AsyncSession(engine) as async_session:
        res = await async_session.execute(select(Profile).where(Profile.id == profile_id))
        profile = instance_to_dict(res.scalars().first())
        profile_codecs = await async_session.execute(select(Profile_Codec).where(Profile_Codec.profile_id == profile['id']))
        profile['codecs'] = [(instance_to_dict(obj))['codec_id'] for obj in profile_codecs.scalars().all()]
        return profile


async def set_profile(profile):
    codec_ids = profile.pop('codecs', [])
    audio_languages = profile.pop('audio_languages', [])
    subtitle_languages = profile.pop('subtitle_languages', [])
    profile_id = 0
    async with AsyncSession(engine) as async_session:
        if 'id' in profile:
            profile_id = profile['id']
            res = await async_session.execute(select(Profile).where(Profile.id == profile['id']))
            obj = res.scalars().first()
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
            await async_session.flush()
            await async_session.refresh(obj)
            profile_id = obj.id

    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(Profile_Codec).where(Profile_Codec.profile_id == profile_id))
        for codec_id in codec_ids:
            stmt = insert(Profile_Codec).values(profile_id=profile_id, codec_id=codec_id)
            await async_session.execute(stmt)
        await async_session.commit()

    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(Profile_Audio_Language).where(Profile_Audio_Language.profile_id == profile_id))
        for language in audio_languages:
            stmt = insert(Profile_Audio_Language).values(profile_id=profile_id, language=language)
            await async_session.execute(stmt)
        await async_session.commit()

    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(Profile_Subtitle_Language).where(Profile_Subtitle_Language.profile_id == profile_id))
        for language in subtitle_languages:
            stmt = insert(Profile_Subtitle_Language).values(profile_id=profile_id, language=language)
            await async_session.execute(stmt)
        await async_session.commit()
    return


async def delete_profile(profile_id):
    settings = await get_all_settings()
    default_profile = settings.get('default_profile', '')
    if profile_id == default_profile:
        return
    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(Profile).where(Profile.id == profile_id))
        await async_session.execute(delete(Profile_Codec).where(Profile_Codec.profile_id == profile_id))
        await async_session.execute(delete(Profile_Audio_Language).where(Profile_Audio_Language.profile_id == profile_id))
        await async_session.execute(delete(Profile_Subtitle_Language).where(Profile_Subtitle_Language.profile_id == profile_id))
        await async_session.commit()
