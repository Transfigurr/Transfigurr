import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.routes.queue_routes import get_all_queue, get_queue
from src.models.queue import queue_instance
router = APIRouter()

@router.websocket("/ws/queue/{queue_id}")
async def queue_websocket(websocket: WebSocket, queue_id):
    try:
        await websocket.accept()
        while True:
            queue_json = json.dumps({'queue': queue_instance.queue, 'progress': queue_instance.current_progress, 'eta': queue_instance.current_eta})
            await websocket.send_text(queue_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

@router.websocket("/ws/queue")
async def queue_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            queue_json = json.dumps({'queue': queue_instance.to_list(), 'progress': queue_instance.current_progress, 'eta': int(queue_instance.current_eta), 'processing': queue_instance.processing, 'active': queue_instance.active, 'stage': queue_instance.stage})                           
            await websocket.send_text(queue_json)
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

