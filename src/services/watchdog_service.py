
import asyncio
import logging
import os
import re
import time
from src.services.scan_service import scan_service
from watchdog.observers.polling import PollingObserver
from watchdog.events import FileSystemEventHandler

logger = logging.getLogger('logger')


class FileChangeHandler(FileSystemEventHandler):
    def on_created(self, event):
        try:
            logger.info("Watchdog detected a file creation")
            self.wait_until_done(event.src_path)
            series = get_series_name(event.src_path)
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            if series:
                loop.run_until_complete(scan_service.enqueue(series))
            else:
                pass
                loop.run_until_complete(scan_service.enqueue_all())
            loop.close()
        except Exception as e:
            logger.info(f'An error occurred while handling a file creation: {e}')

    def on_deleted(self, event):
        try:
            logger.info('Watchdog detected a file deletion.')
            series = get_series_name(event.src_path)
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            if series:
                loop.run_until_complete(scan_service.enqueue(series))
            else:
                loop.run_until_complete(scan_service.enqueue_all())
            loop.close()
        except Exception as e:
            logger.info(f'An error occurred while handling a file deletion: {e}')

    def on_modified(self, event):
        try:
            logger.info('Watchdog detected a file modification.')
            self.wait_until_done(event.src_path)
            series = get_series_name(event.src_path)
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            if series:
                loop.run_until_complete(scan_service.enqueue(series))
            else:
                loop.run_until_complete(scan_service.enqueue_all())
            loop.close()
        except Exception as e:
            logger.info(f'An error occurred while handling a file modification: {e}')

    def wait_until_done(self, path):
        try:
            old_file_size = -1
            while True:
                try:
                    new_file_size = os.path.getsize(path)
                    if new_file_size == old_file_size:
                        break
                    else:
                        old_file_size = new_file_size
                        time.sleep(5)
                except OSError:
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


def start_watchdog(directory):
    try:
        logger.info(f"Starting the file watchdog for {directory}")
        observer = PollingObserver()
        handler = FileChangeHandler()
        observer.schedule(handler, directory, recursive=True)
        observer.start()
    except Exception as e:
        logger.error(f"An xwerror occurred starting the file watchdog: {e}")
