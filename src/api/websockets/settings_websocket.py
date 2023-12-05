import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.routes.settings_routes import get_all_settings, get_setting
router = APIRouter()

@router.websocket("/ws/settings/{setting_id}")
async def settings_websocket(websocket: WebSocket, setting_id):
    try:
        await websocket.accept()
        while True:
            setting_json = json.dumps(await get_setting(setting_id))
            await websocket.send_text(setting_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

@router.websocket("/ws/settings")
async def setting_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            settings_json = json.dumps(await get_all_settings())
            await websocket.send_text(settings_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

