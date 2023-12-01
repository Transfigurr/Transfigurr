import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.routes.series import get_series
router = APIRouter()

@router.websocket("/ws/series/single/{series_name}")
async def singleSeriesWS(websocket: WebSocket, series_name):
    await websocket.accept()
    try:
        while True:
            try:
                data = await get_series(series_name)
                await websocket.send_text(json.dumps(data))
                await asyncio.sleep(10)
            except WebSocketDisconnect:
                break
    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        await websocket.close()