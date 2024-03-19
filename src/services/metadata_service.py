import asyncio
from src.api.controllers.movie_controller import get_all_movies
from src.api.controllers.series_controller import get_all_series
from src.api.controllers.system_controller import set_system
from src.tasks.metadata import get_movie_metadata, get_series_metadata
import logging
logger = logging.getLogger('logger')


class MetadataService:
    def __init__(self):
        self.metadata_queue = asyncio.Queue()
        self.metadata_set = set()

    async def enqueue(self, item_id, item_type):
        item_id = f"{item_type}_{item_id}"
        if item_id not in self.metadata_set:
            self.metadata_set.add(item_id)
            await self.metadata_queue.put(item_id)

    async def enqueue_all(self):
        series_list = await get_all_series()
        for series in series_list:
            await self.enqueue(series, 'series')
        movie_list = await get_all_movies()
        for movie in movie_list:
            await self.enqueue(movie, 'movie')

    async def process(self):
        while True:
            try:
                item_id = await self.metadata_queue.get()
                item_type, item_id = item_id.split("_", 1)
                await set_system({'id': 'metadata_running', 'value': True})
                await set_system({'id': 'metadata_target', 'value': item_id})
                logger.info("Grabbing Metadata for %s: %s", item_type, item_id, extra={'service': 'Metadata'})
                if item_type == 'series':
                    await get_series_metadata(item_id)
                elif item_type == 'movie':
                    await get_movie_metadata(item_id)
                self.metadata_set.remove(f"{item_type}_{item_id}")
                if self.metadata_queue.empty():
                    await set_system({'id': 'metadata_running', 'value': False})
                    await set_system({'id': 'metadata_target', 'value': ''})
            except Exception as e:
                try:
                    await set_system({'id': 'metadata_running', 'value': False})
                except Exception as e:
                    logger.error("An error occurred while processing %s %s", item_type, str(e), extra={'service': 'Metadata'})
                logger.error("An error occurred while processing %s %s", item_type, str(e), extra={'service': 'Metadata'})
            await asyncio.sleep(1)


metadata_service = MetadataService()
