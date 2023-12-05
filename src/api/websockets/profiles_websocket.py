import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.routes.profile_routes import get_all_profiles, get_profile
router = APIRouter()

@router.websocket("/ws/profiles/{profile_id}")
async def profiles_websocket(websocket: WebSocket, profile_id):
    try:
        await websocket.accept()
        while True:
            profile_json = json.dumps(await get_profile(profile_id))
            await websocket.send_text(profile_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

@router.websocket("/ws/profiles")
async def profile_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            profiles_json = json.dumps(await get_all_profiles())
            await websocket.send_text(profiles_json)
            await asyncio.sleep(10)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

