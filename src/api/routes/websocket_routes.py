from fastapi import APIRouter, Depends, WebSocket
from src.api.controllers.auth_controller import login_websocket
from src.api.controllers.websocket_controller import websocket_controller
router = APIRouter()


@router.websocket("/ws")
async def websocket(websocket: WebSocket, user: str = Depends(login_websocket)):
    await websocket_controller(websocket)
