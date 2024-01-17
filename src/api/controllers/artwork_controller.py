from fastapi.responses import FileResponse
from pathlib import Path


async def get_series_backdrop(series_id: str):
    file_path = Path(f"config/artwork/series/{series_id}/backdrop.jpg")
    if not file_path.exists() or file_path.is_dir():
        file_path = Path("src/images/backdrop.jpg")
    return FileResponse(str(file_path), media_type="image/png")


async def get_series_poster(series_id: str):
    file_path = Path(f"config/artwork/series/{series_id}/poster.jpg")
    if not file_path.exists() or file_path.is_dir():
        file_path = Path("src/images/poster.png")
    return FileResponse(str(file_path), media_type="image/png")
