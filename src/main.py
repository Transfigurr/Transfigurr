import asyncio
import os
from fastapi import BackgroundTasks, FastAPI, staticfiles
from dotenv import dotenv_values
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import metadata, scan, settings, profiles, codecs, series
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from src.api.utils import verify_folders
from src.api.ws import queue, history, profilesWS, seriesWS, singleSeriesWS, settingsWS
from src.tasks.periodic import process_episodes_in_queue_periodic, scan_queue, scan_queue_periodic
app = FastAPI()
    
# routes
app.include_router(queue.router)
app.include_router(history.router)
app.include_router(profilesWS.router)
app.include_router(series.router)


app.include_router(metadata.router)
app.include_router(scan.router)
app.include_router(settings.router)
app.include_router(codecs.router)

# ws
app.include_router(seriesWS.router)
app.include_router(singleSeriesWS.router)
app.include_router(settingsWS.router)
app.include_router(profiles.router)



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