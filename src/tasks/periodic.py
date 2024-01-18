import asyncio
import datetime
from functools import partial
import os
import re
import shutil
import subprocess
import time
import ffmpeg
from src.api.controllers.episode_controller import get_episode, set_episode
from src.api.controllers.history_controller import set_history
from src.api.controllers.series_controller import get_series
from src.api.routes.profile_routes import get_all_profiles
from src.api.routes.scan_routes import (
    scan_all_series,
    scan_series,
)
from src.api.utils import get_series_folder, get_transcode_folder
from src.models.queue import queue_instance
import logging
from src.tasks.scan import scan_system

logger = logging.getLogger('logger')


async def process_episodes_in_queue_periodic():
    while True:
        q = queue_instance.queue
        w = True
        while q and w:
            await asyncio.sleep(5)
            item = queue_instance.peek()
            if item:
                await process_episode(item)
                await scan_all_series()
                await queue_instance.dequeue()


async def run_ffmpeg(input_file, output_file, encoder, output_container, preset=None):
    try:
        logger.info(f"Encoding {input_file}")
        loop = asyncio.get_event_loop()
        queue_instance.processing = True
        # Get the total duration of the video
        probe = ffmpeg.probe(input_file)
        total_duration = float(probe["format"]["duration"])

        if preset:
            command = [
                "ffmpeg",
                "-i",
                input_file,
                "-vcodec",
                encoder,
                "-preset",
                preset,
                "-f",
                output_container,
                output_file,
            ]
        else:
            command = [
                "ffmpeg",
                "-i",
                input_file,
                "-vcodec",
                encoder,
                "-f",
                output_container,
                output_file,
            ]

        process = await loop.run_in_executor(
            None,
            partial(
                subprocess.Popen,
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
            ),
        )

        start_time = time.time()
        queue_instance.stage = "transcoding"
        while True:
            output = await loop.run_in_executor(None, process.stdout.readline)
            if output == "" and process.poll() is not None:
                break
            if output:
                match = re.search(r"time=(\d+:\d+:\d+.\d+)", output)
                if match:
                    current_time = match.group(1)
                    FMT = "%H:%M:%S.%f"
                    tdelta = datetime.datetime.strptime(
                        current_time, FMT
                    ) - datetime.datetime.strptime("00:00:00.00", FMT)
                    current_seconds = tdelta.total_seconds()
                    queue_instance.current_progress = (
                        current_seconds / total_duration
                    ) * 100

                    elapsed_time = time.time() - start_time
                    estimated_total_time = elapsed_time / (
                        queue_instance.current_progress / 100
                    )
                    queue_instance.current_eta = estimated_total_time - elapsed_time
    except Exception as e:
        logger.error(f"An error occurred while running ffmpeg on {input_file}: {e}")
    return


async def process_episode(e):
    try:
        logger.info(f"Processing {e['filename']}")
        if not e:
            return
        queue_instance.stage = "analyzing"
        episode = await get_episode(e["id"])
        series = await get_series(episode["series_id"])
        profiles = await get_all_profiles()
        profile = profiles[series["profile_id"]]
        file_name = os.path.splitext(episode["filename"])[0]  # Remove existing extension

        preset = profile["speed"]
        encoder = profile["encoder"]
        output_container = profile["container"]
        output_extension = profile["extension"]

        input_file = os.path.join(
            await get_series_folder(),
            series["id"],
            episode["season_name"],
            episode["filename"],
        )
        output_file = os.path.join(
            await get_transcode_folder(), f"{file_name}.{output_extension}"
        )

        probe = ffmpeg.probe(input_file)
        video_stream = next(
            (stream for stream in probe["streams"] if stream["codec_type"] == "video"), None
        )

        check = video_stream["codec_name"]
        if check == profile["codec"]:
            return

        loop = asyncio.get_event_loop()

        await run_ffmpeg(input_file, output_file, encoder, output_container, preset)

        queue_instance.stage = "Copying"

        await loop.run_in_executor(None, partial(shutil.move, output_file, input_file))

        await asyncio.sleep(5)

        new_size = os.path.getsize(input_file)
        episode["space_saved"] = episode["original_size"] - new_size
        episode["size"] = new_size
        await set_episode(episode)
        await scan_series(series["id"])
        await scan_system()

        await set_history(episode, profile)

        queue_instance.stage = "idle"
        queue_instance.current_progress = 0
        queue_instance.current_eta = 0
    except Exception as e:
        logger.error(f"An error occurred processing {input_file}: {e}")
    return
