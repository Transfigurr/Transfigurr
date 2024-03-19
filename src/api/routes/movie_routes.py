import asyncio
from fastapi import APIRouter, Depends, Request
from src.api.controllers.auth_controller import login_with_token
from src.api.controllers.movie_controller import get_all_movies, get_movie, remove_movie, set_movie
from src.services.scan_service import scan_service
router = APIRouter()


@router.get("/api/movies", tags=["Movies"], name="Get All Movies")
async def get_all_movies_route(user: str = Depends(login_with_token)):
    return await get_all_movies()


@router.get("/api/movies/{movie_id}", tags=["Movies"], name="Get Movie By Id")
async def get_movie_route(movie_id: str, user: str = Depends(login_with_token)):
    return await get_movie(movie_id)


async def after_update(movie_id: str, user: str = Depends(login_with_token)):
    await scan_service.enqueue(movie_id, 'movie')


@router.put('/api/movies/{movie_id}', tags=["Movies"], name="Upsert Movie")
async def set_movie_route(movie_id: str, request: Request, user: str = Depends(login_with_token)):
    movie = await request.json()
    await set_movie(movie)
    asyncio.create_task(after_update(movie['id']))
    return


@router.delete("/api/movies/{movie_id}", tags=["Movies"], name="Delete Movie By Id")
async def delete_movie_route(movie_id: str, user: str = Depends(login_with_token)):
    return await remove_movie(movie_id)
