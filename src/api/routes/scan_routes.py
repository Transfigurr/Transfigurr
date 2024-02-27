from fastapi import APIRouter, Depends
from src.api.controllers.auth_controller import login_with_token
from src.services.metadata_service import metadata_service
from src.services.scan_service import scan_service
router = APIRouter()


@router.put("/api/scan/series/metadata", tags=["Scan"])
async def get_all_series_metadata_route(user: str = Depends(login_with_token)):
    await metadata_service.enqueue_all()
    return


@router.put("/api/scan/series/metadata/{series_id}", tags=["Scan"])
async def get_series_metadata_route(series_id, user: str = Depends(login_with_token)):
    await metadata_service.enqueue(series_id)
    return


@router.put('/api/scan/series', tags=["Scan"])
async def scan_all_series_route(user: str = Depends(login_with_token)):
    await scan_service.enqueue_all()
    return


@router.put("/api/scan/series/{series_name}", tags=["Scan"])
async def scan_series_route(series_name, user: str = Depends(login_with_token)):
    await scan_service.enqueue(series_name)
    return
