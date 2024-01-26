from fastapi import APIRouter, WebSocket
from src.api.controllers.websocket_controller import websocket_controller
router = APIRouter()


@router.websocket("/ws")
async def websocket(websocket: WebSocket):
    await websocket_controller(websocket)
