import asyncio
import logging
from src.api.controllers.settings_controller import get_all_settings
from src.utils.ffmpeg import process_episode

logger = logging.getLogger('logger')


class EncodeService:
    def __init__(self):
        self.encode_queue = asyncio.Queue()
        self.encode_set = set()
        self.active = True
        self.stage = 'idle'
        self.current = None
        self.processing = False
        self.current_progress = 0
        self.current_eta = 0

    async def enqueue(self, episode):
        episode_id = episode['id']
        if episode_id not in self.encode_set:
            self.encode_set.add(episode['id'])
            await self.encode_queue.put(episode)

    async def process(self):
        while True:
            try:
                settings = await get_all_settings()
                if settings['queue_status'] != 'active':
                    await asyncio.sleep(5)
                    continue
                episode = await self.encode_queue.get()
                self.current = episode
                if not episode:
                    continue
                logger.info(f"Encoding {episode['filename']}", extra={'service': 'Encode'})
                await process_episode(episode)
                self.encode_set.remove(episode['id'])
                self.current = None
            except Exception as e:
                logger.error("An error occurred while processing series %s", str(e), extra={'service': 'Encode'})
            await asyncio.sleep(1)

    async def to_list(self):
        return list(self.encode_queue._queue)

    async def get_encode_queue_data(self):
        return {
            'queue': await self.to_list(),
            'stage': self.stage,
            'processing': self.processing,
            'progress': self.current_progress,
            'eta': self.current_eta,
            'current': self.current
        }


encode_service = EncodeService()
