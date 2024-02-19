import asyncio
import logging
import datetime
from functools import partial
import os
import re
import shutil
import stat
import subprocess
import time
import ffmpeg
from src.api.controllers.episode_controller import get_episode, set_episode
from src.api.controllers.history_controller import set_history
from src.api.controllers.series_controller import get_series
from src.api.controllers.settings_controller import get_all_settings
from src.api.routes.profile_routes import get_all_profiles
from src.utils.folders import get_transcode_folder
from src.utils.ffmpeg import analyze_media_file

logger = logging.getLogger('logger')


class EncodeService:
    def __init__(self):
        self.encode_queue = asyncio.Queue()
        self.encode_set = set()
        self.active = True
        self.stage = 'idle'
        self.current = None
        self.processing = False
        self.current_progress = 0
        self.current_eta = 0

    async def enqueue(self, episode):
        episode_id = episode['id']
        if episode_id not in self.encode_set:
            self.encode_set.add(episode['id'])
            await self.encode_queue.put(episode)

    async def process(self):
        while True:
            try:
                settings = await get_all_settings()
                if settings['queue_status'] != 'active':
                    await asyncio.sleep(5)
                    continue
                episode = await self.encode_queue.get()
                self.current = episode
                if not episode:
                    continue
                logger.info(f"Encoding {episode['filename']}", extra={'service': 'Encode'})
                await process_episode(episode)
                self.encode_set.remove(episode['id'])
                self.current = None
            except Exception as e:
                logger.error("An error occurred while processing series %s", str(e), extra={'service': 'Encode'})
            await asyncio.sleep(1)

    async def to_list(self):
        return list(self.encode_queue._queue)

    async def get_encode_queue_data(self):
        return {
            'queue': await self.to_list(),
            'stage': self.stage,
            'processing': self.processing,
            'progress': self.current_progress,
            'eta': self.current_eta,
            'current': self.current
        }


encode_service = EncodeService()


async def run_ffmpeg(input_file, output_file, encoder, output_container, preset=None):
    try:
        loop = asyncio.get_event_loop()
        encode_service.processing = True
        # Get the total duration of the video
        probe = ffmpeg.probe(input_file)
        total_duration = float(probe["format"]["duration"])

        if preset:
            command = [
                "ffmpeg",
                "-y",
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
                "-y",
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
        encode_service.stage = "encoding"
        while True:
            output = await loop.run_in_executor(None, process.stdout.readline)
            if process.poll() is not None:
                if process.poll() != 0:
                    logger.error(f"An error occurred while running ffmpeg on {input_file}: {output}", extra={'service': 'Encode'})
                    return False
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
                    encode_service.current_progress = (
                        current_seconds / total_duration
                    ) * 100

                    elapsed_time = time.time() - start_time
                    estimated_total_time = elapsed_time / (
                        encode_service.current_progress / 100
                    )
                    encode_service.current_eta = estimated_total_time - elapsed_time
    except Exception as e:
        logger.error(f"An error occurred while running ffmpeg on {input_file}: {e}", extra={'service': 'Encode'})
        return False
    return True


async def process_episode(e):
    try:
        if not e:
            return
        encode_service.stage = "analyzing"
        episode = await get_episode(e["id"])
        series = await get_series(episode["series_id"])
        profiles = await get_all_profiles()
        profile = profiles[series["profile_id"]]
        file_name = os.path.splitext(episode["filename"])[0]

        preset = profile["speed"]
        encoder = profile["encoder"]
        output_container = profile["container"]
        output_extension = profile["extension"]

        input_file = episode['path']
        output_file = os.path.join(
            await get_transcode_folder(), f"{file_name}.{output_extension}"
        )

        if not os.path.exists(input_file):
            logger.error(f"{input_file} does not exist", extra={'service': 'Encode'})
            return
        if not os.access(input_file, os.R_OK):
            logger.debug(f"Changing permissions of {input_file} to make it readable", extra={'service': 'Encode'})
            os.chmod(input_file, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)
        if not os.access(input_file, os.W_OK):
            logger.debug(f"Changing permissions of {input_file} to make it writable", extra={'service': 'Encode'})
            os.chmod(input_file, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)

        if os.path.exists(output_file) and not os.access(output_file, os.W_OK):
            logger.debug(f"Changing permissions of {output_file} to make it writable", extra={'service': 'Encode'})
            os.chmod(output_file, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)

        video_stream = await analyze_media_file(input_file)

        if video_stream == profile["codec"]:
            return

        loop = asyncio.get_event_loop()

        encoding_succesful = await run_ffmpeg(input_file, output_file, encoder, output_container, preset)

        if not encoding_succesful:
            encode_service.stage = "idle"
            logger.error(f"An error occurred while encoding {input_file}", extra={'service': 'Encode'})
            return

        encode_service.stage = "Copying"

        await loop.run_in_executor(None, partial(shutil.move, output_file, input_file))

        await asyncio.sleep(5)

        new_size = os.path.getsize(input_file)
        episode["space_saved"] = episode["original_size"] - new_size
        episode["size"] = new_size
        await set_episode(episode)

        await set_history(episode, profile)

        encode_service.stage = "idle"
        encode_service.current_progress = 0
        encode_service.current_eta = 0
    except Exception as e:
        logger.error(f"An error occurred processing {input_file}: {e}", extra={'service': 'Encode'})
    return
