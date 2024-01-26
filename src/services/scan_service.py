import asyncio
import logging
import os
from src.api.controllers.series_controller import get_all_series
from src.utils.folders import get_series_folder
from src.tasks.scan import scan_series, scan_system
from src.tasks.validate import validate_series

logger = logging.getLogger('logger')


class ScanService:
    def __init__(self):
        self.scan_queue = asyncio.Queue()
        self.scan_set = set()

    async def enqueue(self, series_id):
        if series_id not in self.scan_set:
            self.scan_set.add(series_id)
            await self.scan_queue.put(series_id)

    async def enqueue_by_profile(self, profile_id):
        series_dict = await get_all_series()
        for series_id in series_dict:
            if series_dict[series_id]['profile_id'] == profile_id:
                await self.enqueue(series_id)

    async def enqueue_all(self):
        series_folder = await get_series_folder()
        for series_name in os.listdir(series_folder):
            await self.enqueue(series_name)

    async def process(self):
        while True:
            try:
                series_id = await self.scan_queue.get()
                await scan_series(series_id)
                await validate_series(series_id)
                await scan_system()
                self.scan_set.remove(series_id)
                await asyncio.sleep(1)
            except Exception as e:
                logger.error("An error occurred while processing series %s", str(e), extra={'service': 'Scan'})
            await asyncio.sleep(1)


scan_service = ScanService()
