import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.controllers.season_controller import get_all_seasons, get_season

router = APIRouter()
@router.websocket("/ws/seasons/{season_id}")
async def series_websocket(websocket: WebSocket, series_id):
    try:
        await websocket.accept()
        while True:
            data = json.dumps(await get_season(series_id))
            await websocket.send_text(data)
            await asyncio.sleep(10)
    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

@router.websocket("/ws/seasons")
async def series_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            data = json.dumps(await get_all_seasons())
            await websocket.send_text(data)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

