from fastapi import APIRouter
from src.services.metadata_service import metadata_service
from src.services.scan_service import scan_service
router = APIRouter()


@router.put("/api/scan/series/metadata")
async def get_all_series_metadata_route():
    await metadata_service.enqueue_all()
    return


@router.get("/api/scan/series/metadata/{series_id}")
async def get_series_metadata_route(series_id):
    await metadata_service.enqueue(series_id)
    return


@router.put('/api/scan/series')
async def scan_all_series_route():
    await scan_service.enqueue_all()
    return


@router.put("/api/scan/series/{series_name}")
async def scan_series_route(series_name):
    await scan_service.enqueue(series_name)
    return
