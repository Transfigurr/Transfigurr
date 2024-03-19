from fastapi import APIRouter, Depends
from src.api.controllers.actions_controller import refresh_all_metadata, refresh_movie_metadata, refresh_series_metadata, restart, scan_all_media, scan_movie, scan_series, shutdown
from src.api.controllers.auth_controller import login_with_token
router = APIRouter()


@router.post("/api/actions/restart", tags=["Actions"], name="Restart Application")
async def restart_route(user: str = Depends(login_with_token)):
    return await restart()


@router.post('/api/actions/shutdown', tags=["Actions"], name="Shutdown Application")
async def shutdown_route(user: str = Depends(login_with_token)):
    return await shutdown()


@router.post("/api/actions/refresh/metadata", tags=["Actions"], name="Refresh All Media Metadata")
async def refresh_all_media_metadata_route(user: str = Depends(login_with_token)):
    return await refresh_all_metadata()


@router.post('/api/actions/scan', tags=["Actions"], name="Scan All Media")
async def scan_all_media_route(user: str = Depends(login_with_token)):
    return await scan_all_media()


@router.post("/api/actions/refresh/metadata/series/{series_id}", tags=["Actions"], name="Refresh Series Metadata By Id")
async def refresh_series_metadata_route(series_id, user: str = Depends(login_with_token)):
    return await refresh_series_metadata(series_id)


@router.post("/api/actions/scan/series/{series_id}", tags=["Actions"], name="Scan Series By Id")
async def scan_series_route(series_id, user: str = Depends(login_with_token)):
    return await scan_series(series_id)


@router.post("/api/actions/scan/movies/{movie_id}", tags=["Actions"], name="Scan Movie By Id")
async def scan_movie_route(movie_id, user: str = Depends(login_with_token)):
    return await scan_movie(movie_id)


@router.post("/api/actions/refresh/metadata/movies/{movie_id}", tags=["Actions"], name="Refresh Movie Metadata By Id")
async def refresh_movie_metadata_route(movie_id, user: str = Depends(login_with_token)):
    return await refresh_movie_metadata(movie_id)
