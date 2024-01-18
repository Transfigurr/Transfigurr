import asyncio
from functools import partial
import ffmpeg
import logging

logger = logging.getLogger('logger')


async def analyze_media_file(file_path):
    try:
        loop = asyncio.get_event_loop()
        probe = await loop.run_in_executor(None, partial(ffmpeg.probe, file_path))
        return probe['streams'][0]['codec_name']
    except Exception as e:
        logger.error(f"Error analyzing the media file: {e}")
        return None
