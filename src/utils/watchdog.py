
import asyncio
import logging
import os
import re
import time
from src.tasks.scan import scan_all_series, scan_series, scan_system
from src.tasks.validate import validate_all_series, validate_series
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

logger = logging.getLogger('logger')


class FileChangeHandler(FileSystemEventHandler):
    def on_created(self, event):
        try:
            self.wait_until_done(event.src_path)
            series = get_series_name(event.src_path)
            if series:
                asyncio.run(scan_series(series))
                asyncio.run(scan_system())
            else:
                asyncio.run(scan_all_series())
                asyncio.run(scan_system())
        except Exception as e:
            logger.info(f'An error occurred while handling a file creation: {e}')

    def on_deleted(self, event):
        try:
            series = get_series_name(event.src_path)
            if series:
                asyncio.run(validate_series(series))
                asyncio.run(scan_series(series))
                asyncio.run(scan_system())

            else:
                asyncio.run(validate_all_series())
                asyncio.run(scan_all_series())
                asyncio.run(scan_system())
        except Exception as e:
            logger.info(f'An error occurred while handling a file deletion: {e}')

    def on_modified(self, event):
        try:
            self.wait_until_done(event.src_path)
            series = get_series_name(event.src_path)
            if series:
                asyncio.run(scan_series(series))
                asyncio.run(scan_system())
            else:
                asyncio.run(scan_all_series())
                asyncio.run(scan_system())
        except Exception as e:
            logger.info(f'An error occurred while handling a file modification: {e}')

    def wait_until_done(self, path):
        try:
            old_file_size = -1
            while True:
                try:
                    new_file_size = os.path.getsize(path)
                    if new_file_size == old_file_size:
                        # File size hasn't changed, so assume it's done being written to.
                        break
                    else:
                        old_file_size = new_file_size
                        time.sleep(5)  # Wait for 1 second before checking again.
                except OSError:
                    # If the file doesn't exist yet, wait a bit before checking again.
                    time.sleep(5)
        except Exception as e:
            logger.error(f"An error occurred while waiting for file initialization: {e}")


def get_series_name(path):
    match = re.search(r'/series/([^/]*)', path)
    return match.group(1) if match else None


def get_season_name(path):
    match = re.search(r'/series/([^/]*)/([^/]*)', path)
    return match.group(2) if match else None


def get_episode_name(path):
    match = re.search(r'/series/([^/]*)/([^/]*)/([^/]*)', path)
    return match.group(3) if match else None


async def start_watchdog(directory):
    try:
        observer = Observer()
        handler = FileChangeHandler()
        observer.schedule(handler, directory, recursive=True)
        observer.start()
    except Exception as e:
        logger.error(f"An error occurred starting the file watchdog: {e}")
