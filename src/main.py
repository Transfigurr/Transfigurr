import asyncio
import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from src.tasks import periodic, scan
from src.api.utils import get_root_folder
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import (
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

# Add Routes
routers = [
    season_routes.router,
    scan_routes.router,
    settings_routes.router,
    codec_routes.router,
    profile_routes.router,
    series_routes.router,
    system_routes.router,
    websocket_routes.router
]

# CORS
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in routers:
    app.include_router(router)

# Mount directories
os.makedirs("../config", exist_ok=True)
app.mount("/config", StaticFiles(directory="config"), name="config")
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")

# Start tasks
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(periodic.scan_queue_periodic())
    asyncio.create_task(periodic.process_episodes_in_queue_periodic())
    #inital scan
    await scan.scan_all_series()
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, periodic.start_watchdog, await get_root_folder() + '/series')

# Serve frontend
@app.get("/")
@app.get("/{path:path}")
async def index():
    return FileResponse("frontend/build/index.html")