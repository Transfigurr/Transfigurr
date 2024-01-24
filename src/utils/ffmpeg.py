import asyncio
from functools import partial
import os
import stat
import ffmpeg
import logging

logger = logging.getLogger('logger')


async def analyze_media_file(file_path):
    try:
        logger.info(f"Analyzing {file_path}", extra={'service': 'Scan'})
        # Check if the file exists
        if not os.path.exists(file_path):
            logger.error(f"The file {file_path} does not exist.", extra={'service': 'Scan'})
            return

        # Check if the file is readable
        if not os.access(file_path, os.R_OK):
            logger.info(f"The file {file_path} is not readable.", extra={'service': 'Scan'})
            try:
                os.chmod(file_path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)
            except PermissionError:
                logger.error(f"Permission denied when trying to change the permissions of {file_path}", extra={'service': 'Scan'})
                return
        # Check if the file is writable, if not, change permissions
        if not os.access(file_path, os.W_OK):
            logger.info(f"The file {file_path} is not writable.", extra={'service': 'Scan'})
            try:
                os.chmod(file_path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)
            except PermissionError:
                logger.error(f"Permission denied when trying to change the permissions of {file_path}", extra={'service': 'Scan'})
                return
        loop = asyncio.get_event_loop()
        probe = await loop.run_in_executor(None, partial(ffmpeg.probe, file_path))
        # Extract the video codec
        for stream in probe['streams']:
            if stream['codec_type'] == 'video':
                return stream['codec_name']
    except Exception as e:
        logger.error(f"Error analyzing the media file {file_path}: {e}", extra={'service': 'Scan'})
        return
