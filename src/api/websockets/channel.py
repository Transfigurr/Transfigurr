import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.controllers.history_controller import get_all_historys
from src.api.controllers.profile_controller import get_all_profiles
from src.api.controllers.series_controller import get_all_series
from src.api.controllers.settings_controller import get_all_settings
from src.api.controllers.system_controller import get_all_system
from src.api.controllers.codec_controller import get_all_codecs, get_all_containers, get_all_encoders
from src.models.queue import queue_instance

router = APIRouter()

@router.websocket("/ws")
async def series_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        while True:
            series, profiles, history, settings, system, containers, codecs, encoders = await asyncio.gather(
            get_all_series(),
            get_all_profiles(),
            get_all_historys(),
            get_all_settings(),
            get_all_system(),
            get_all_containers(),
            get_all_codecs(),
            get_all_encoders()
            )
            data = {'series': series, 
                    'profiles': profiles, 
                    'queue': {
                        'queue': queue_instance.to_list(), 
                        'progress': queue_instance.current_progress, 
                        'eta': int(queue_instance.current_eta), 
                        'processing': queue_instance.processing, 'active': queue_instance.active, 
                        'stage': queue_instance.stage
                        }, 
                    'history': history, 
                    'system': system, 
                    'settings': settings,
                    'containers': containers,   
                    'codecs': codecs,
                    'encoders': encoders
            }
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)

    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    except asyncio.CancelledError:
        logging.info("WebSocket connection cancelled")
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        await websocket.close(code=1000)

