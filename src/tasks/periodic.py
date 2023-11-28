import asyncio
import os
from fastapi import BackgroundTasks

import ffmpeg
from src.api.routes.profiles import getProfiles
from src.api.routes.scan import scan_all_series, scan_queue
from src.api.utils import get_config_folder, open_json, write_json
from src.global_state import GlobalState

global_state = GlobalState()


async def scan_queue_periodic():
    while True:
        await asyncio.sleep(5)  # Sleep for 5 seconds (adjust as needed)
        await scan_queue()

async def process_episodes_in_queue_periodic():
    print("process epi task started")
    while True:
        q = await global_state.get_queue()
        w = True
        await asyncio.sleep(5)
        while q and w:
            await asyncio.sleep(5)
            await process_episode(q[-1])
            q.pop(-1)
            await global_state.set_queue(q)


async def process_episode(episode):

    profiles = await getProfiles()
    profile = profiles[episode['profile']]
    file_path = episode['episode']['path']
    file_name = episode['episode']['filename']

    preset = profile['speed']
    vcodec = profile['codec']

    input_file = file_path + file_name
    output_file = file_path + 'temp' + file_name
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, lambda: ffmpeg.input(input_file).output(output_file, vcodec='libx265', preset=preset).run())
    #os.rename(output_file, input_file)
    return