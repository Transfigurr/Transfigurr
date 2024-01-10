from dataclasses import asdict
import os
import aiofiles
from dotenv import dotenv_values
from fastapi import APIRouter
import httpx
from src.api.controllers.episode_controller import set_episode
from src.api.controllers.season_controller import get_seasons_by_id

from src.api.controllers.series_controller import get_all_series, get_full_series, set_series
from src.api.utils import get_series_artwork_folder
from src.models.episode import Episode
from src.models.season import Season
from src.models.series import Series


router = APIRouter()
config = dotenv_values("src/.env")
if 'API_KEY' in config:
    API_KEY = config['API_KEY']
else:
    API_KEY = ""

async def get_all_series_metadata():
    series_list = await get_all_series()
    print('getting metadata for all series')
    for series in series_list:
        await get_series_metadata(series['id'])
    return


async def get_series_metadata(series_id):
    async with httpx.AsyncClient() as client:
        series = {}
        series['id'] = series_id
        full_series = await get_full_series(series_id)
        series_folder = os.path.join(await get_series_artwork_folder(), series_id)
        os.makedirs(series_folder, exist_ok=True)
        tmdb_url = f"https://api.themoviedb.org/3/search/tv"
        params = {"api_key": API_KEY, "query": series_id}
        series_response = await client.get(tmdb_url, params=params)
        if series_response.status_code == 200:
            series_data = series_response.json()
            if series_data.get("results"):
                series_data = series_data["results"][0]
                series_url = f"https://api.themoviedb.org/3/tv/{series_data.get('id')}"
                params = {"api_key": API_KEY}
                series_response = await client.get(series_url, params=params)
                if series_response.status_code == 200:
                    series_data = series_response.json()
                    series['name'] = series_data.get("name")
                    series['overview'] = series_data.get("overview")
                    series['first_air_date'] = series_data.get("first_air_date")
                    series['last_air_date'] = series_data.get("last_air_date")
                    series['genre'] = series_data.get("genres")[0]['name']
                    series['networks'] = series_data.get("networks")[0]['name']
                    series['status'] = series_data.get('status')

                    for season_number in full_series['seasons']:
                        season = full_series['seasons'][season_number]
                        for episode_number in season['episodes']:
                            episode_url = f"https://api.themoviedb.org/3/tv/{series_data.get('id')}/season/{season_number}/episode/{episode_number}"
                            episode_response = await client.get(episode_url, params=params)
                            if episode_response.status_code == 200:
                                episode_data = episode_response.json()
                                episode = {}
                                episode['id'] = series['id']+str(season_number)+str(episode_number)
                                episode['series_name'] = series['name']
                                episode['season_name'] = season['name']
                                episode['season_number'] = season['season_number']
                                episode['episode_name'] = episode_data.get('name')
                                episode['episode_number'] = episode_data.get('episode_number')
                                episode['air_date'] = episode_data.get('air_date')
                                await set_episode(episode)
                            else:
                                print(f"Failed to fetch episode {episode_number} information. Status code: {episode_response.status_code}")

                await set_series(series)

                poster_path = series_data.get("poster_path")
                if poster_path:
                    poster_url = f"https://image.tmdb.org/t/p/original{poster_path}"
                    poster_path = os.path.join(series_folder, "poster.jpg")
                    if not os.path.exists(poster_path):
                        response = await client.get(poster_url)
                        if response.status_code == 200:
                            async with aiofiles.open(poster_path, "wb") as poster_file:
                                await poster_file.write(response.content)          

                backdrop_path = series_data.get("backdrop_path")
                if backdrop_path:
                    backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}"
                    backdrop_file_path = os.path.join(series_folder, "backdrop.jpg")
                    if not os.path.exists(backdrop_file_path):
                        response = await client.get(backdrop_url)
                        if response.status_code == 200:
                            async with aiofiles.open(backdrop_file_path, "wb") as backdrop_file:
                                await backdrop_file.write(response.content)
    return