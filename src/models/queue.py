import queue
import asyncio

class Queue:
    # Queue functionality
    queue = queue.Queue()
    items = set()
    active = True
    stage = 'idle'

    processing = False
    current_progress = 0
    current_eta = 0

    @classmethod
    async def enqueue(cls, episode):
        episode_id = episode['id']
        if episode_id not in cls.items:
            cls.items.add(episode_id)
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, cls.queue.put, episode)

    @classmethod
    async def dequeue(cls):
        if not cls.queue.empty():
            loop = asyncio.get_event_loop()
            episode = await loop.run_in_executor(None, cls.queue.get)
            episode_id = episode['id']
            cls.items.remove(episode_id)
            return episode
        
    @classmethod
    def to_list(cls):
        items = list(cls.queue.queue)
        return items
    
    @classmethod
    def peek(cls, index=0):
        try:
            return list(cls.queue.queue)[index]
        except IndexError:
            return None

# Global instance of Queue
queue_instance = Queue()