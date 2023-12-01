import asyncio
import os
from fastapi import BackgroundTasks, FastAPI, staticfiles
from dotenv import dotenv_values
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import codec_routes, profile_routes, scan_routes, series_routes, settings_routes
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from src.api.utils import verify_folders
from src.api.ws import history_websocket, profiles_websocket, queue_websocket, series_websocket, settings_websocket
from src.tasks.periodic import process_episodes_in_queue_periodic, scan_queue, scan_queue_periodic
app = FastAPI()
    
# routes
#app.include_router(queue.router)
#app.include_router(history.router)
app.include_router(profiles_websocket.router)
app.include_router(series_routes.router)


app.include_router(scan_routes.router)
app.include_router(settings_routes.router)
app.include_router(codec_routes.router)

# ws
app.include_router(series_websocket.router)
app.include_router(settings_websocket.router)
app.include_router(profile_routes.router)



origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",

]

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
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")



async def test():
    while True:
        # Your scanning logic here
        await asyncio.sleep(10)  # sleep for 10 seconds

async def test2():
    while True:
        print("Processing episodes...")
        # Your processing logic here
        await asyncio.sleep(10)  # sleep for 1




@app.on_event("startup")
async def startup_event():
    task1 = asyncio.create_task(scan_queue_periodic())
    task2 = asyncio.create_task(process_episodes_in_queue_periodic())



# catch all routes for static html
@app.get("/")
@app.get("/{path:path}")
async def index():
    return FileResponse("frontend/build/index.html")