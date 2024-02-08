from fastapi import HTTPException
from fastapi.responses import FileResponse
from pathlib import Path


async def get_series_backdrop(series_id: str):
    file_path = Path(f"config/artwork/series/{series_id}/backdrop.webp")
    if not file_path.exists() or file_path.is_dir():
        raise HTTPException(status_code=404, detail="Backdrop not found")
    return FileResponse(str(file_path), media_type="image/webp")


async def get_series_poster(series_id: str):
    file_path = Path(f"config/artwork/series/{series_id}/poster.webp")
    if not file_path.exists() or file_path.is_dir():
        raise HTTPException(status_code=404, detail="Poster not found")
    return FileResponse(str(file_path), media_type="image/webp")
