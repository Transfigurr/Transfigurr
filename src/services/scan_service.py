import asyncio
import logging
import os
from src.api.utils import get_series_folder
from src.tasks.scan import scan_series, scan_system
from src.tasks.validate import validate_series

logger = logging.getLogger('logger')


class ScanService:
    def __init__(self):
        self.scan_queue = asyncio.Queue()
        self.scan_set = set()
        self.scan_system_called = False

    async def enqueue(self, series_id):
        if series_id not in self.scan_set:
            self.scan_set.add(series_id)
            self.scan_system_called = False
            await self.scan_queue.put(series_id)

    async def enqueue_all(self):
        series_folder = await get_series_folder()
        for series_name in os.listdir(series_folder):
            if series_name == ".DS_Store":
                continue
            await self.enqueue(series_name)

    async def process(self):
        while True:
            try:
                series_id = await self.scan_queue.get()
                await validate_series(series_id)
                await scan_series(series_id)
                self.scan_set.remove(series_id)
                if self.scan_queue.empty() and not self.scan_system_called:
                    await scan_system()
                    self.scan_system_called = True
                await asyncio.sleep(1)
            except Exception as e:
                logger.error("An error occurred while processing series %s", str(e))
            await asyncio.sleep(1)


scan_service = ScanService()
