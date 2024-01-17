
import asyncio
import logging
import os
import time
from src.api.routes.scan_routes import scan_queue
from src.tasks.scan import scan_all_series, validate_database
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

logger = logging.getLogger('logger')


class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        try:
            if os.path.isfile(event.src_path):
                logger.info(f"File {event.src_path} has been modified")
                self.wait_until_done(event.src_path)
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(
                    asyncio.gather(scan_all_series(), validate_database(), scan_queue())
                )
        except Exception as e:
            logger.error(f"An error occurred monitoring changes on {event.src_path}: {e}")

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

    def on_deleted(self, event):
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(validate_database())
        except Exception as e:
            logger.error(f"An error occurred while monitoring deleted file: {e}")


async def start_watchdog(directory):
    try:
        observer = Observer()
        handler = FileChangeHandler()
        observer.schedule(handler, directory, recursive=True)
        observer.start()
    except Exception as e:
        logger.error(f"An error occurred starting the file watchdog: {e}")
