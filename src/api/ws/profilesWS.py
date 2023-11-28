import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.api.routes.profiles import getProfiles
from src.global_state import GlobalState

global_state = GlobalState()
router = APIRouter()

@router.websocket("/ws/profiles")
async def profilesWS(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Convert the entire queue to a JSON string
            data = json.dumps(await getProfiles())
            try:
                # Send the JSON string to the client
                await websocket.send_text(data)
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