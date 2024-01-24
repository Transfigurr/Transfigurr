import asyncio
import json
from typing import Callable
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.websockets import WebSocketState
from websockets import ConnectionClosedError, ConnectionClosedOK
from src.api.controllers.history_controller import get_all_historys
from src.api.controllers.profile_controller import get_all_profiles
from src.api.controllers.series_controller import get_all_series
from src.api.controllers.settings_controller import get_all_settings
from src.api.controllers.system_controller import get_all_system
from src.api.controllers.codec_controller import get_all_codecs, get_all_containers, get_all_encoders
from src.api.controllers.log_controller import get_all_logs
from src.services.encode_service import encode_service
router = APIRouter()


async def send_data(websocket: WebSocket, data_type: str, getter: Callable[[], object], delay: float):
    while True:
        try:
            data = await getter()
            await websocket.send_text(json.dumps({data_type: data}))
            await asyncio.sleep(delay)
        except (ConnectionClosedError, ConnectionClosedOK):
            return
        except Exception:
            return


@router.websocket("/ws")
async def websocket(websocket: WebSocket):
    tasks = []
    try:
        await websocket.accept()
        task_dict = {
            'series': get_all_series,
            'profiles': get_all_profiles,
            'settings': get_all_settings,
            'system': get_all_system,
            'history': get_all_historys,
            'containers': get_all_containers,
            'codecs': get_all_codecs,
            'encoders': get_all_encoders,
            'logs': get_all_logs,
            'queue': encode_service.get_encode_queue_data
        }

        for data_type, getter in task_dict.items():
            task = asyncio.create_task(send_data(websocket, data_type, getter, 1))
            tasks.append(task)

        while True:
            try:
                await websocket.receive_text()
            except WebSocketDisconnect:
                break
            if websocket.client_state != WebSocketState.CONNECTED:
                break
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        for task in tasks:
            task.cancel()
    except asyncio.CancelledError:
        for task in tasks:
            task.cancel()
    except Exception:
        await websocket.close(code=1000)
