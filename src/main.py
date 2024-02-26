import asyncio
import json
import os
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from src.api.controllers.settings_controller import get_all_settings
from src.utils.folders import get_root_folder, verify_folders
from src.services.logging_service import start_logger
from src.services.watchdog_service import start_watchdog
from src.services.metadata_service import metadata_service
from src.services.encode_service import encode_service
from src.services.scan_service import scan_service
from src.api.routes import (
    artwork_routes,
    codec_routes,
    history_routes,
    profile_routes,
    scan_routes,
    series_routes,
    episode_routes,
    settings_routes,
    season_routes,
    system_routes,
    websocket_routes,
    auth_routes,
    action_routes,
    user_routes
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


routers = [
    season_routes.router,
    scan_routes.router,
    settings_routes.router,
    codec_routes.router,
    profile_routes.router,
    series_routes.router,
    system_routes.router,
    artwork_routes.router,
    websocket_routes.router,
    history_routes.router,
    episode_routes.router,
    auth_routes.router,
    action_routes.router,
    user_routes.router
]

for router in routers:
    app.include_router(router)

os.makedirs("../config", exist_ok=True)
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Transfigurr API",
        version="V1",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


async def write_api():
    openapi_schema = custom_openapi()
    openapi_path = 'src/Transfigurr.API.V1'
    if not os.path.exists(openapi_path):
        os.makedirs(openapi_path)
    with open(openapi_path + '/openapi.json', 'w') as file:
        json.dump(openapi_schema, file)


async def startup_event():
    await verify_folders()
    log_level = (await get_all_settings()).get('log_level', '')
    start_logger(log_level)
    asyncio.create_task(write_api())
    asyncio.create_task(scan_service.enqueue_all())
    asyncio.create_task(scan_service.process())
    asyncio.create_task(metadata_service.process())
    asyncio.create_task(encode_service.process())
    start_watchdog(await get_root_folder() + '/series')
app.add_event_handler("startup", startup_event)


@app.get("/{full_path:path}", include_in_schema=False)
async def read_item(full_path: str, request: Request):
    file_path = Path(f"frontend/build/{full_path}")
    if not file_path.exists() or file_path.is_dir():
        file_path = Path("frontend/build/index.html")
    if file_path.suffix in [".png", ".jpg", ".jpeg"]:
        return FileResponse(str(file_path), media_type="image/png")
    elif file_path.suffix == ".ico":
        return FileResponse(str(file_path), media_type="image/x-icon")
    else:
        return HTMLResponse(file_path.read_text(), media_type="text/html")
