import asyncio
from functools import partial
import os
import shutil
from fastapi import BackgroundTasks 
import ffmpeg
from src.api.controllers.codec_controller import get_all_codecs
from src.api.controllers.episode_controller import get_episode
from src.api.controllers.series_controller import get_series
from src.api.routes.codec_routes import get_all_containers_route
from src.api.routes.profile_routes import get_all_profiles
from src.api.routes.scan_routes import scan_all_series, scan_queue, scan_series, validate_database
from src.api.utils import get_root_folder, get_series_folder, get_transcode_folder

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
            await process_episode(queue_instance.peek())
            await queue_instance.dequeue()


async def process_episode(e):
    if not e:
        return
    episode = await get_episode(e['id'])
    series = await get_series(episode['series_id'])
    profiles = await get_all_profiles()
    profile = profiles[series['profile_id']]
    file_name = os.path.splitext(episode['filename'])[0]  # Remove existing extension

    preset = profile['speed']
    encoder = profile['encoder']
    output_container = profile['container']
    output_extension = profile['extension']

    input_file = os.path.join(await get_series_folder(), series['id'], episode['season_name'], episode['filename'])
    output_file = os.path.join(await get_transcode_folder(), f"{file_name}.{output_extension}")


    probe = ffmpeg.probe(input_file)
    video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)

    check = video_stream['codec_name']
    if check == profile['codec']:
        return
    loop = asyncio.get_event_loop()
    if encoder == 'mpeg4' or encoder == 'h264': 
        await loop.run_in_executor(None, lambda: ffmpeg.input(input_file).output(output_file, vcodec=encoder, f=output_container).run())
        await loop.run_in_executor(None, partial(shutil.move, output_file, input_file))
    else:
        await loop.run_in_executor(None, lambda: ffmpeg.input(input_file).output(output_file, vcodec=encoder, preset=preset, f=output_container).run())
        await loop.run_in_executor(None, partial(shutil.move, output_file, input_file))    
        await asyncio.sleep(20)
    return




class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        print(f'File {event.src_path} has been modified')
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(asyncio.gather(scan_all_series(), validate_database()))

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