import asyncio
from collections import defaultdict
from functools import partial
import json
from pathlib import Path
import ffmpeg
import os
import aiofiles
import aiofiles.os as aos

file_locks = defaultdict(asyncio.Lock)

async def verify_folders():
    root_folder_path = await get_root_folder()
    paths = []
    config_folder_path = root_folder_path + '/config'
    paths.append(config_folder_path + '/metadata/series')
    paths.append(config_folder_path + '/metadata/movies')
    paths.append(root_folder_path + '/series')
    paths.append(root_folder_path + '/movies')
    paths.append(root_folder_path + '/transcode')
    
    loop = asyncio.get_event_loop()

    for path in paths:
        await loop.run_in_executor(None, partial(os.makedirs, path, exist_ok=True))
    return

async def get_root_folder():
    current_file = Path(__file__).resolve()
    root_folder = current_file.parents[2]
    return str(root_folder)

def get_root_folder2():
    current_file = Path(__file__).resolve()
    root_folder = current_file.parents[2]
    return str(root_folder)

async def get_config_folder():
    return await get_root_folder() + '/config'


async def get_series_folder():
    return await get_root_folder() + '/series'

async def get_series_metadata_folder():
    return await get_root_folder() + '/config/metadata/series'

async def get_transcode_folder():
    return await get_root_folder() + '/transcode'

async def open_json(folder,file_path,default):
    await verify_folders()
    await asyncio.get_event_loop().run_in_executor(None, partial(os.makedirs, folder, exist_ok=True))
    path = os.path.join(folder, file_path)
    if not await asyncio.get_event_loop().run_in_executor(None, partial(os.path.exists, path)):
        await write_json(folder, file_path, default)
    async with file_locks[path]:
        async with aiofiles.open(path, "r") as json_file:
            data = await json_file.read()
    return json.loads(data)

async def write_json(folder, file_path, data):
    await verify_folders()
    await asyncio.get_event_loop().run_in_executor(None, partial(os.makedirs, folder, exist_ok=True))
    path = os.path.join(folder, file_path)
    async with file_locks[path]:
        async with aiofiles.open(path, "w") as file:
            await file.write(json.dumps(data, indent=4))
    return


async def analyze_media_file(file_path):
    try:
        loop = asyncio.get_event_loop()
        probe = await loop.run_in_executor(None, partial(ffmpeg.probe, file_path))
        return probe['streams'][0]['codec_name']
    except Exception as e:
        print(f"Error analyzing the media file: {e}")
        return None