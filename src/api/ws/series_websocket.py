import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.routes.series_routes import get_all_series, get_series
router = APIRouter()

@router.websocket("/ws/series/{series_id}")
async def series_websocket(websocket: WebSocket, series_id):
    try:
        await websocket.accept()
        while True:
            series_json = json.dumps(await get_series(series_id))
            await websocket.send_text(series_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

@router.websocket("/ws/series")
async def series_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            series_json = json.dumps(await get_all_series())
            await websocket.send_text(series_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

