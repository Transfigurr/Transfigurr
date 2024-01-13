
from cProfile import Profile
from src.api.controllers.episode_controller import get_episode
from src.api.controllers.profile_controller import get_profile
from src.global_state import GlobalState
from sqlalchemy import delete

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from src.models.episode import Episode
from src.models.history import History
engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


global_state = GlobalState()


async def get_all_historys():
    historys = await global_state.get_all_from_table(History)
    res = {}
    for h in historys:
        res[h['id']] = h
        episode = await get_episode(h['episode_id'])
        profile = await get_profile(h['profile_id'])
        res[h['id']]['episode'] = episode
        res[h['id']]['profile'] = profile
    return res


async def get_history(history_id):
    historys = await global_state.get_object_from_table(History, history_id)
    res = {}
    for h in historys:
        res[h['id']] = h
        print('trying to get episode and profile')
        episode = await global_state.get_object_from_table(Episode, h['episode_id'])
        profile = await global_state.get_object_from_table(Profile, h['profile_id'])
        print(episode, profile)
        res[h['id']]['episode'] = episode
        res[h['id']]['profile'] = profile
    return res


async def set_history(episode, profile):

    async with AsyncSession(engine) as async_session:

        history = {}
        history['episode_id'] = episode['id']
        history['profile_id'] = profile['id']
        history['prev_codec'] = episode['video_codec']
        history['new_codec'] = profile['codec']

        obj = History(**history)
        async_session.add(obj)
        await async_session.commit()
    return


async def delete_history(history_id):
    async with AsyncSession(engine) as async_session:
        await async_session.execute(delete(History).where(History.id == history_id))
        await async_session.commit()
