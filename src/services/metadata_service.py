import asyncio
import logging
from src.api.controllers.series_controller import get_all_series
from src.tasks.metadata import get_series_metadata

logger = logging.getLogger('logger')


class MetadataService:
    def __init__(self):
        self.metadata_queue = asyncio.Queue()
        self.metadata_set = set()

    async def enqueue(self, series_id):
        if series_id not in self.metadata_set:
            self.metadata_set.add(series_id)
            await self.metadata_queue.put(series_id)

    async def enqueue_all(self):
        series_list = await get_all_series()
        for series in series_list:
            await self.enqueue(series)

    async def process(self):
        while True:
            try:
                series_id = await self.metadata_queue.get()
                await get_series_metadata(series_id)
                self.metadata_set.remove(series_id)
            except Exception as e:
                logger.error("An error occurred while processing series %s", str(e))
            await asyncio.sleep(1)


metadata_service = MetadataService()
