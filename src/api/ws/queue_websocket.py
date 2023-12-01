import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.routes.queue_routes import get_all_queue, get_queue
router = APIRouter()

@router.websocket("/ws/queue/{queue_id}")
async def queue_websocket(websocket: WebSocket, queue_id):
    try:
        await websocket.accept()
        while True:
            queue_json = json.dumps(await get_queue(queue_id))
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
            queue_json = json.dumps(await get_all_queue())
            await websocket.send_text(queue_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

