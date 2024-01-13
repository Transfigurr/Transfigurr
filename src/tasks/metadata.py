from dataclasses import asdict
import os
import aiofiles
from dotenv import dotenv_values
from fastapi import APIRouter
import httpx
from unidecode import unidecode
from src.api.controllers.episode_controller import set_episode
from src.api.controllers.series_controller import (
    get_all_series,
    get_full_series,
    get_series,
    set_series,
)
from src.api.utils import get_series_artwork_folder
from src.models.episode import Episode
from src.models.series import Series

router = APIRouter()
config = dotenv_values(".env")
API_KEY = config.get("API_KEY", "")

SERIES_URL = "https://api.themoviedb.org/3/search/tv"
ARTWORK_URL = "https://image.tmdb.org/t/p/original"


async def parse_series(series_id):
    try:
        async with httpx.AsyncClient() as client:
            search_params = {"api_key": API_KEY, "query": unidecode(series_id)}
            series_search_response = await client.get(SERIES_URL, params=search_params)
            if series_search_response.status_code != 200:
                return
            series_search_array = series_search_response.json()
            series: Series = Series(**await get_series(series_id))
            if not series_search_array.get("results"):
                return
            series_best_match = series_search_array["results"][0]
            series_url = (
                f"https://api.themoviedb.org/3/tv/{series_best_match.get('id')}"
            )
            series_best_match_params = {"api_key": API_KEY}
            series_response = await client.get(
                series_url, params=series_best_match_params
            )
            if series_response.status_code != 200:
                return series
            series_data = series_response.json()
            series.name = series_data.get("name")
            series.overview = series_data.get("overview")
            series.first_air_date = series_data.get("first_air_date")
            series.last_air_date = series_data.get("last_air_date")
            series.genre = series_data.get("genres")[0]["name"]
            series.networks = series_data.get("networks")[0]["name"]
            series.status = series_data.get("status")
            await set_series(asdict(series))
    except Exception as e:
        print(f"An error occurred while parsing the series: {e}")
    return series_data


async def get_all_series_metadata():
    try:
        series_list = await get_all_series()
        for series in series_list:
            try:
                await get_series_metadata(series["id"])
            except Exception as e:
                print(
                    f"An error occurred while getting metadata for series {series['id']}: {e}"
                )
    except Exception as e:
        print(f"An error occurred while getting all series metadata: {e}")
    return


async def download_series_artwork(series_data, series_id):
    series_folder = os.path.join(await get_series_artwork_folder(), series_id)
    os.makedirs(series_folder, exist_ok=True)
    async with httpx.AsyncClient() as client:
        # Download poster
        try:
            poster_path = series_data.get("poster_path")
            if not poster_path:
                print("No poster path provided.")
            else:
                poster_url = f"https://image.tmdb.org/t/p/original{poster_path}"
                poster_path = os.path.join(series_folder, "poster.jpg")
                if not os.path.exists(poster_path):
                    response = await client.get(poster_url)
                    if response.status_code != 200:
                        print("Failed to download poster.")
                    else:
                        async with aiofiles.open(poster_path, "wb") as poster_file:
                            await poster_file.write(response.content)
        except Exception as e:
            print(f"An error occurred while downloading the poster: {e}")

        # Download backdrop
        try:
            backdrop_path = series_data.get("backdrop_path")
            if not backdrop_path:
                print("No backdrop path provided.")
            else:
                backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}"
                backdrop_file_path = os.path.join(
                    series_folder, "backdrop.jpg")
                if not os.path.exists(backdrop_file_path):
                    response = await client.get(backdrop_url)
                    if response.status_code != 200:
                        print("Failed to download backdrop.")
                    else:
                        async with aiofiles.open(
                            backdrop_file_path, "wb"
                        ) as backdrop_file:
                            await backdrop_file.write(response.content)
        except Exception as e:
            print(f"An error occurred while downloading the backdrop: {e}")

    return


async def parse_episode(series, season, series_data, season_number, episode_number):
    try:
        series_params = {"api_key": API_KEY, "query": unidecode(series["id"])}
        async with httpx.AsyncClient() as client:
            episode_url = f"https://api.themoviedb.org/3/tv/{series_data.get('id')}/season/{season_number}/episode/{episode_number}"
            episode_response = await client.get(episode_url, params=series_params)
            if episode_response.status_code != 200:
                return
            episode_data = episode_response.json()
            episode = Episode()
            episode.id = series["id"] + \
                str(season_number) + str(episode_number)
            episode.series_id = series["id"]
            episode.season_name = season["name"]
            episode.season_number = season["season_number"]
            episode.episode_name = episode_data.get("name")
            episode.episode_number = episode_data.get("episode_number")
            episode.air_date = episode_data.get("air_date")
            await set_episode(asdict(episode))
    except Exception as e:
        print(f"An error occurred while parsing the episode: {e}")


async def get_series_metadata(series_id):
    try:
        series_data = await parse_series(series_id)
        if not series_data:
            return
        await download_series_artwork(series_data, series_id)
        series = await get_full_series(series_id)
        if not series:
            return
        for season_number in series["seasons"]:
            season = series["seasons"][season_number]
            if not season or "episodes" not in season:
                continue
            for episode_number in season["episodes"]:
                await parse_episode(
                    series, season, series_data, season_number, episode_number
                )
    except Exception as e:
        print(f"An error occurred: {e}")
