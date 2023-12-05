import asyncio
from functools import partial
import os
from fastapi import BackgroundTasks 
import ffmpeg
from src.api.controllers.episode_controller import get_episode
from src.api.controllers.series_controller import get_series
from src.api.routes.profile_routes import get_all_profiles
from src.api.routes.scan_routes import scan_all_series, scan_queue, scan_series, validate_database
from src.api.utils import get_transcode_folder

from src.models.queue import queue_instance
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

async def scan_queue_periodic():
    while True:
        await asyncio.sleep(20)
        await scan_queue()

async def process_episodes_in_queue_periodic():
    while True:
        q = queue_instance.queue
        w = True
        while q and w:
            await asyncio.sleep(5)
            await process_episode(await queue_instance.dequeue())


async def process_episode(e):
    if not e:
        return
    episode = await get_episode(e['id'])
    series = await get_series(episode['series_id'])
    print(episode)
    


    profiles = await get_all_profiles()
    profile = profiles[series['profile_id']]
    file_name = episode['filename']

    preset = profile['speed']
    vcodec = profile['codec']
    print(preset,vcodec)
    return
    input_file = file_path + file_name
    output_file = os.path.join(await get_transcode_folder(), file_name)
    loop = asyncio.get_event_loop()
    #await loop.run_in_executor(None, lambda: ffmpeg.input(input_file).output(output_file, vcodec='libx264', preset='ultrafast').run())
    #await loop.run_in_executor(None, partial(os.replace, output_file, input_file))
    return




class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        print(f'File {event.src_path} has been modified')
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(asyncio.gather(scan_series(), validate_database()))

    def on_created(self, event):
        print(f'File {event.src_path} has been created')
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(asyncio.gather(scan_all_series(), validate_database()))

    def on_deleted(self, event):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(validate_database())
        loop.run_until_complete(asyncio.gather(scan_all_series(), validate_database()))

def start_watchdog(directory):
    observer = Observer()
    handler = FileChangeHandler()
    observer.schedule(handler, directory, recursive=True)
    observer.start()