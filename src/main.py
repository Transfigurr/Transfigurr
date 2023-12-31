import asyncio
import os
from fastapi import FastAPI, staticfiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from src.api.utils import get_root_folder
from src.api.routes import codec_routes, profile_routes, scan_routes, series_routes, settings_routes, season_routes, system_routes
from src.api.websockets import channel
from src.tasks.periodic import process_episodes_in_queue_periodic, scan_queue_periodic, start_watchdog
from src.tasks.scan import scan_all_series

# Create app
app = FastAPI()

# Add Routes
app.include_router(season_routes.router)
app.include_router(scan_routes.router)
app.include_router(settings_routes.router)
app.include_router(codec_routes.router)
app.include_router(profile_routes.router)
app.include_router(series_routes.router)
app.include_router(system_routes.router)

# Add Websockets
app.include_router(channel.router)
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

# Mount directories
os.makedirs("../config", exist_ok=True)
app.mount("/config", staticfiles.StaticFiles(directory="config"), name="config")
app.mount("/build", StaticFiles(directory="frontend/build"), name="build")

# Start tasks
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(scan_queue_periodic())
    asyncio.create_task(process_episodes_in_queue_periodic())
    #inital scan
    await scan_all_series()
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, start_watchdog, await get_root_folder() + '/series')


# Serve frontend
@app.get("/")
@app.get("/{path:path}")
async def index():
    return FileResponse("frontend/build/index.html")