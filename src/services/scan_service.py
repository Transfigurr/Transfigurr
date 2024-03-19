import asyncio
import logging
import os
from src.api.controllers.movie_controller import get_all_movies
from src.api.controllers.series_controller import get_all_series
from src.api.controllers.system_controller import set_system
from src.utils.folders import get_movies_folder, get_series_folder
from src.tasks.scan import scan_movie, scan_series, scan_system
from src.tasks.validate import validate_movie, validate_series

logger = logging.getLogger('logger')


class ScanService:
    def __init__(self):
        self.scan_queue = asyncio.Queue()
        self.scan_set = set()

    async def enqueue(self, item_id, item_type):
        item_id = f"{item_type}_{item_id}"
        if item_id not in self.scan_set:
            self.scan_set.add(item_id)
            await self.scan_queue.put(item_id)

    async def enqueue_by_profile(self, profile_id):
        series_dict = await get_all_series()
        for series_id in series_dict:
            if series_dict[series_id]['profile_id'] == profile_id:
                await self.enqueue(series_id, 'series')
        movies_dict = await get_all_movies()
        for movie_id in movies_dict:
            if movies_dict[movie_id]['profile_id'] == profile_id:
                await self.enqueue(movie_id, 'movie')

    async def enqueue_all(self):
        await self.enqueue_all_movies()
        await self.enqueue_all_series()

    async def enqueue_all_movies(self):
        movies_folder = await get_movies_folder()
        for movie_name in os.listdir(movies_folder):
            await self.enqueue(movie_name, 'movie')
        movies_db = await get_all_movies()
        for movie_id in movies_db:
            await self.enqueue(movie_id, 'movie')

    async def enqueue_all_series(self):
        series_folder = await get_series_folder()
        for series_name in os.listdir(series_folder):
            await self.enqueue(series_name, 'series')
        series_db = await get_all_series()
        for series_id in series_db:
            await self.enqueue(series_id, 'series')

    async def process(self):
        while True:
            try:
                item_id = await self.scan_queue.get()
                item_type, item_id = item_id.split("_", 1)
                await set_system({'id': 'scan_running', 'value': True})
                await set_system({'id': 'scan_target', 'value': item_id})
                if item_type == 'series':
                    await scan_series(item_id)
                    await validate_series(item_id)
                elif item_type == 'movie':
                    await scan_movie(item_id)
                    await validate_movie(item_id)

                await scan_system()
                self.scan_set.remove(f"{item_type}_{item_id}")
                if self.scan_queue.empty():
                    await set_system({'id': 'scan_running', 'value': False})
                    await set_system({'id': 'scan_target', 'value': ''})
                await asyncio.sleep(1)
            except Exception as e:
                logger.error("An error occurred while processing %s", str(e), extra={'service': 'Scan'})
                try:
                    await set_system({'id': 'scan_running', 'value': False})
                except Exception as e:
                    logger.error("An error occurred while processing %s", str(e), extra={'service': 'Scan'})
            await asyncio.sleep(1)


scan_service = ScanService()
