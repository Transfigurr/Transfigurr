
import asyncio
from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.series_controller import get_all_series, get_series, remove_series, set_series
from src.services.scan_service import scan_service
router = APIRouter()


@router.get("/api/series", tags=["Series"], name="Get All Series")
async def get_all_series_route(user: str = Depends(login_with_token)):
    return await get_all_series()


@router.get("/api/series/{series_id}", tags=["Series"], name="Get Series By Id")
async def get_series_route(series_id: str, user: str = Depends(login_with_token)):
    return await get_series(series_id)


async def after_update(series_id: str, user: str = Depends(login_with_token)):
    await scan_service.enqueue(series_id)


@router.put('/api/series/{series_id}', tags=["Series"], name="Upsert Series")
async def set_series_route(series_id: str, request: Request, user: str = Depends(login_with_token)):
    series = await request.json()
    await set_series(series)
    asyncio.create_task(after_update(series['id']))
    return


@router.delete("/api/series/{series_id}", tags=["Series"], name="Delete Series By Id")
async def delete_series_route(series_id: str, user: str = Depends(login_with_token)):
    return await remove_series(series_id)
