import asyncio
from dataclasses import asdict
import json
import os
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.utils import get_series_metadata_folder, open_json
from src.global_state import GlobalState

global_state = GlobalState()
router = APIRouter()

@router.websocket("/ws/series/single/{series_name}")
async def singleSeriesWS(websocket: WebSocket, series_name):
    await websocket.accept()
    try:
        while True:
            # Convert the entire queue to a JSON string
            path = os.path.join(await get_series_metadata_folder(),series_name)
            local_json = await global_state.get_series(series_name)
            config_json = await global_state.get_series_config(series_name)
            data = {}
            for key in local_json: 
                data[key] = local_json[key]
            for key in config_json:
                data[key] = config_json[key]
            try:
                # Send the JSON string to the client
                await websocket.send_text(json.dumps(data))
            except WebSocketDisconnect:
                # The client disconnected, break out of the loop
                break

            # Sleep to introduce a delay (adjust the duration as needed)
            await asyncio.sleep(1)  # Sleep for 1 second (adjust as needed)
    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the WebSocket connection when exiting the function
        await websocket.close()