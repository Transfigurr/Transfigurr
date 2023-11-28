import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.utils import get_config_folder, open_json
from src.global_state import GlobalState

global_state = GlobalState()
router = APIRouter()

@router.websocket("/ws/series")
async def seriesWS(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            series_json = json.dumps(await global_state.get_series_list())
            await websocket.send_text(series_json)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)