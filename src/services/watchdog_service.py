
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

    def __init__(self, media_type):
        self.media_type = media_type

    def on_created(self, event):
        try:
            logger.debug("Watchdog detected a file creation", extra={'service': 'Watchdog'})
            self.wait_until_done(event.src_path)
            self.handle_change(event)
        except Exception as e:
            logger.error(f'An error occurred while handling a file creation: {e}', extra={'service': 'Watchdog'})

    def on_deleted(self, event):
        try:
            logger.debug('Watchdog detected a file deletion.', extra={'service': 'Watchdog'})
            self.handle_change(event)
        except Exception as e:
            logger.error(f'An error occurred while handling a file deletion: {e}', extra={'service': 'Watchdog'})

    def on_modified(self, event):
        try:
            logger.debug('Watchdog detected a file modification.', extra={'service': 'Watchdog'})
            self.wait_until_done(event.src_path)
            self.handle_change(event)
        except Exception as e:
            logger.error(f'An error occurred while handling a file modification: {e}', extra={'service': 'Watchdog'})

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
            logger.error(f"An error occurred while waiting for file initialization: {e}", extra={'service': 'Watchdog'})

    def handle_change(self, event):
        media = None
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        if self.media_type == 'series':
            media = get_series_name(event.src_path)
            if media:
                loop.run_until_complete(scan_service.enqueue(media, 'series'))
            else:
                loop.run_until_complete(scan_service.enqueue_all_series())
        else:
            media = get_movie_name(event.src_path)
            if media:
                loop.run_until_complete(scan_service.enqueue(media, 'movie'))
            else:
                loop.run_until_complete(scan_service.enqueue_all_movies())
        loop.close()


def get_series_name(path):
    match = re.search(r'/series/([^/]*)', path)
    return match.group(1) if match else None


def get_movie_name(path):
    match = re.search(r'/movies/([^/]*)', path)
    return match.group(1) if match else None


def get_season_name(path):
    match = re.search(r'/series/([^/]*)/([^/]*)', path)
    return match.group(2) if match else None


def get_episode_name(path):
    match = re.search(r'/series/([^/]*)/([^/]*)/([^/]*)', path)
    return match.group(3) if match else None


def start_watchdog(directory, content_type):
    try:
        logger.debug(f"Starting the file watchdog for {directory}", extra={'service': 'Watchdog'})
        observer = PollingObserver()
        handler = FileChangeHandler(content_type)
        observer.schedule(handler, directory, recursive=True)
        observer.start()
    except Exception as e:
        logger.error(f"An xwerror occurred starting the file watchdog: {e}", extra={'service': 'Watchdog'})
