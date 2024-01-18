import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websockets import ConnectionClosedError
from src.api.controllers.websocket_controller import get_all_websocket_data

router = APIRouter()


@router.websocket("/ws")
async def websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            data = await get_all_websocket_data()
            try:
                await websocket.send_text(json.dumps(data))
            except ConnectionClosedError:
                return

    except WebSocketDisconnect:
        return
    except asyncio.CancelledError:
        return
    except Exception:
        await websocket.close(code=1000)
