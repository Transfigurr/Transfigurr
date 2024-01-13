import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.controllers.websocket_controller import get_all_websocket_data

router = APIRouter()


@router.websocket("/ws")
async def websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            data = await get_all_websocket_data()
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)
