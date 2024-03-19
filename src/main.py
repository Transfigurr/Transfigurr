from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.tasks.startup import startup
from src.api.routes import (
    artwork_routes,
    codec_routes,
    history_routes,
    profile_routes,
    series_routes,
    movie_routes,
    episode_routes,
    settings_routes,
    season_routes,
    system_routes,
    websocket_routes,
    auth_routes,
    action_routes,
    user_routes,
    static_routes
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
    settings_routes.router,
    codec_routes.router,
    profile_routes.router,
    series_routes.router,
    movie_routes.router,
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


async def startup_event():
    await startup()
app.add_event_handler("startup", startup_event)
app.include_router(static_routes.router)
