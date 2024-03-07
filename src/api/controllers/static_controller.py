from fastapi.responses import FileResponse, HTMLResponse
from pathlib import Path


async def static_controller(full_path: str):
    file_path = Path(f"frontend/dist/{full_path}")
    if not file_path.exists() or file_path.is_dir():
        file_path = Path("frontend/dist/index.html")
    if file_path.suffix in [".png", ".jpg", ".jpeg"]:
        return FileResponse(str(file_path), media_type="image/png")
    elif file_path.suffix == ".ico":
        return FileResponse(str(file_path), media_type="image/x-icon")
    elif file_path.suffix == ".js":
        return FileResponse(str(file_path), media_type="application/javascript")
    elif file_path.suffix == ".css":
        return FileResponse(str(file_path), media_type="text/css")
    else:
        return HTMLResponse(file_path.read_text(), media_type="text/html")
