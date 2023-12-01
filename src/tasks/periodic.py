import asyncio
from functools import partial
import os
from fastapi import BackgroundTasks 
import ffmpeg
from src.api.routes.profile_routes import get_all_profiles
from src.api.routes.scan_routes import scan_all_series, scan_queue
from src.api.utils import get_config_folder, get_root_folder, get_transcode_folder, open_json, write_json



async def scan_queue_periodic():
    while True:
        await asyncio.sleep(5)  # Sleep for 5 seconds (adjust as needed)
        await scan_queue()

async def process_episodes_in_queue_periodic():
    print("process epi task started")
    return
    while True:
        q = await get_queue()
        w = True
        while q and w:
            await asyncio.sleep(5)
            await process_episode(q[-1])
            q.pop(-1)
            await global_state.set_queue(q)


async def process_episode(episode):

    profiles = await get_all_profiles()
    profile = profiles[episode['profile']]
    file_path = episode['episode']['path']
    file_name = episode['episode']['filename']

    preset = profile['speed']
    vcodec = profile['codec']

    input_file = file_path + file_name
    output_file = os.path.join(await get_transcode_folder(), file_name)
    loop = asyncio.get_event_loop()
    #await loop.run_in_executor(None, lambda: ffmpeg.input(input_file).output(output_file, vcodec='libx264', preset='ultrafast').run())
    #await loop.run_in_executor(None, partial(os.replace, output_file, input_file))
    return