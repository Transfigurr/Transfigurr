from fastapi import APIRouter
from src.api.controllers.static_controller import static_controller
router = APIRouter()


# Route
@router.get("/{full_path:path}", tags=["StaticResource"], name="Get Static Resource")
async def static_route(full_path: str):
    return await static_controller(full_path)
