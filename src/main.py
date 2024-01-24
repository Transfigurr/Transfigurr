import asyncio
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from src.api.utils import get_root_folder, verify_folders
from src.services.logging_service import start_logger
from src.services.watchdog_service import start_watchdog
from src.services.metadata_service import metadata_service
from src.services.encode_service import encode_service
from src.services.scan_service import scan_service
from src.api.routes import (
    artwork_routes,
    codec_routes,
    profile_routes,
    scan_routes,
    series_routes,
    settings_routes,
    season_routes,
    system_routes,
    websocket_routes
)

# Create app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Routes
routers = [
    season_routes.router,
    scan_routes.router,
    settings_routes.router,
    codec_routes.router,
    profile_routes.router,
    series_routes.router,
    system_routes.router,
    artwork_routes.router,
    websocket_routes.router
]

for router in routers:
    app.include_router(router)

# Mount directories
os.makedirs("../config", exist_ok=True)
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")
app.mount("/images", StaticFiles(directory="src/images"), name="images")
# Start tasks


async def startup_event():
    await verify_folders()
    asyncio.create_task(scan_service.enqueue_all())
    asyncio.create_task(scan_service.process())
    asyncio.create_task(metadata_service.process())
    asyncio.create_task(encode_service.process())
    start_watchdog(await get_root_folder() + '/series')
app.add_event_handler("startup", startup_event)


# Setup Logger


start_logger()

# Catch all static routes


@app.get("/{full_path:path}")
async def read_item(full_path: str):
    file_path = Path(f"frontend/build/{full_path}")
    if not file_path.exists() or file_path.is_dir():
        file_path = Path("frontend/build/index.html")
    if file_path.suffix in [".png", ".jpg", ".jpeg"]:
        return FileResponse(str(file_path), media_type="image/png")
    elif file_path.suffix == ".ico":
        return FileResponse(str(file_path), media_type="image/x-icon")
    else:
        return HTMLResponse(file_path.read_text(), media_type="text/html")
