import asyncio
from collections import deque
from dataclasses import asdict
from typing import Union
import time
import os
import ffmpeg
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect, staticfiles
from dotenv import load_dotenv
from dotenv import dotenv_values
import json
import requests
import re
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from src.models.Episode import Episode
from src.models.Profile import Profile
from src.models.Season import Season
from src.models.Series import Series
from src.models.Settings import Settings
from src.controllers.series_controller import create_series, read_series, read_all_series, update_series, delete_series

from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse


app = FastAPI()



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


config = dotenv_values(".env")  # config = {"USER": "foo", "EMAIL": "foo@example.org"}
API_KEY = config['API_KEY']



# always be in RAM
queue = [] # Initialize an empty list to store the queued actions
work = False


# Mount a directory containing your frontend
#app.mount("/", staticfiles.StaticFiles(directory="frontend/build", html=True), name="frontend")

# Mount a directory containing your images to serve them statically
app.mount("/config", staticfiles.StaticFiles(directory="config"), name="config")
app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")



@app.websocket("/ws/queue")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Convert the entire queue to a JSON string
            queue_json = json.dumps(queue)
            
            try:
                # Send the JSON string to the client
                await websocket.send_text(queue_json)
            except WebSocketDisconnect:
                # The client disconnected, break out of the loop
                break

            # Sleep to introduce a delay (adjust the duration as needed)
            await asyncio.sleep(5)  # Sleep for 5 seconds (adjust as needed)
    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the WebSocket connection when exiting the function
        await websocket.close()


@app.websocket("/ws/history")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Convert the entire queue to a JSON string
            history_json = json.dumps(history)
            
            try:
                # Send the JSON string to the client
                await websocket.send_text(history_json)
            except WebSocketDisconnect:
                # The client disconnected, break out of the loop
                break
            # Sleep to introduce a delay (adjust the duration as needed)
            await asyncio.sleep(5)  # Sleep for 5 seconds (adjust as needed)
    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the WebSocket connection when exiting the function
        await websocket.close()

# always in a file
history = [] # Initialize an empty list to store the queued actions

# paths

seriesMetadataPath = 'config/metadata/series'
movieMetadataPath = 'config/metadata/series'


@app.get("/api/scan/movies")
def scan_movies():
    movies_result = []
    directory_path = '../movies'
    for root, dirs, files in os.walk(directory_path):
        folder_name = os.path.basename(root)
        if folder_name != os.path.basename(directory_path):
            folder_files = [f for f in files if os.path.isfile(os.path.join(root, f))]
            movies_result.append({"folder_name": folder_name, "files": folder_files})
    
    json_file_path = '../metadata/filesystem//movies/movies.json'
    with open(json_file_path, "w") as json_file:
        json.dump(movies_result, json_file, indent=4)
    return movies_result

@app.get("/api/movies")
def get_movies_metadata():
   # List of series you want to fetch metadata for
    movies_list = scan_movies()
    # Folder to save metadata
    metadata_folder = "../metadata/TVDB/movies"

    os.makedirs(metadata_folder, exist_ok=True)
    os.makedirs(artwork_folder, exist_ok=True)

    for movie in movies_list:
        time.sleep(1)
        # Construct the URL for fetching metadata
        tmdb_url = f"https://api.themoviedb.org/3/search/movie"
        params = {"api_key": API_KEY, "query": movie['folder_name']}

        # Send a GET request to TMDb
        response = requests.get(tmdb_url, params=params)

        if response.status_code == 200:
            data = response.json()
            if data.get("results"):
                # Choose the first result, or apply your own logic for selecting the correct series
                movie_data = data["results"][0]

                # Create a metadata file (e.g., JSON or text) in the metadata folder
                metadata_folder_path = os.path.join(metadata_folder, movie['folder_name'])

                metadata_file_path = os.path.join(metadata_folder, movie['folder_name'], f"{movie['folder_name']}.json")

                os.makedirs(metadata_folder_path, exist_ok=True)

                with open(metadata_file_path, "w") as metadata_file:
                    # Write the metadata to the file
                    metadata_file.write(json.dumps(movie_data, indent=4))

                # Download artwork (e.g., poster) and save it to the artwork folder
                poster_path = movie_data.get("poster_path")
                if poster_path:
                    poster_url = f"https://image.tmdb.org/t/p/original{poster_path}"
                    poster_file_path = os.path.join(metadata_folder_path, f"{movie['folder_name']}_poster.jpg")

                    response = requests.get(poster_url)
                    if response.status_code == 200:
                        with open(poster_file_path, "wb") as poster_file:
                            poster_file.write(response.content)

                # Download artwork (e.g., poster) and save it to the artwork folder
                backdrop_path = movie_data.get("backdrop_path")
                if backdrop_path:
                    backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}"
                    backdrop_file_path = os.path.join(metadata_folder_path, f"{movie['folder_name']}_backdrop.jpg")

                    response = requests.get(backdrop_url)
                    if response.status_code == 200:
                        with open(backdrop_file_path, "wb") as backdrop_file:
                            backdrop_file.write(response.content)


@app.get("/api/series") 
def get_series_metadata():

    s: Series = Series()

    # List of series you want to fetch metadata for
    series_list = scan_series()
    # Folder to save metadata

    os.makedirs(seriesMetadataPath, exist_ok=True)
    for series in series_list:
        # Construct the URL for fetching metadata
        tmdb_url = f"https://api.themoviedb.org/3/search/tv"
        params = {"api_key": API_KEY, "query": series['series']}
        
        # Send a GET request to TMDb
        response = requests.get(tmdb_url, params=params)

        if response.status_code == 200:
            data = response.json()
            if data.get("results"):
                # Choose the first result, or apply your own logic for selecting the correct series
                series_data = data["results"][0]
                # Create a metadata file (e.g., JSON or text) in the metadata folder
                metadata_folder_path = os.path.join(seriesMetadataPath, series_data.get('name'))
                metadata_file_path = os.path.join(metadata_folder_path, "series.json")
                os.makedirs(metadata_folder_path, exist_ok=True)
                s.id = series_data.get("id")
                if s.id:
                    season_url = f"https://api.themoviedb.org/3/tv/{s.id}"
                    params = {"api_key": API_KEY}
                    response = requests.get(season_url, params=params)

                    if response.status_code == 200:
                        data = response.json()
                        s.name = data.get("name")
                        s.overview = data.get("overview")
                        s.series_path = series.get('series_path')
                        s.first_air_date = data.get("first_air_date")
                        s.last_air_date = data.get("last_air_date")
                        s.genre = data.get("genres")[0]['name']
                        s.networks = data.get("networks")[0]['name']
                        s.status = data.get('status')
                        s.seasons = {}
                        s.profile = 0
                # Download poster
                poster_path = series_data.get("poster_path")
                if poster_path:
                    poster_url = f"https://image.tmdb.org/t/p/original{poster_path}"
                    poster_path = os.path.join(metadata_folder_path, "poster.jpg")
                    response = requests.get(poster_url)
                    if response.status_code == 200:
                        with open(poster_path, "wb") as poster_file:
                            poster_file.write(response.content)

                # Download backdrop
                backdrop_path = series_data.get("backdrop_path")
                if backdrop_path:
                    backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}"
                    backdrop_file_path = os.path.join(metadata_folder_path, "backdrop.jpg")
                    response = requests.get(backdrop_url)
                    if response.status_code == 200:
                        with open(backdrop_file_path, "wb") as backdrop_file:
                            backdrop_file.write(response.content)


                # Fetch season and episode information
                
                if s.id:
                    season_url = f"https://api.themoviedb.org/3/tv/{s.id}"
                    params = {"api_key": API_KEY}
                    season_response = requests.get(season_url, params=params)

                    if season_response.status_code == 200:
                        # TODO SEASON DATA RAW
                        season_data = season_response.json()
                        for season in season_data.get('seasons'):
                            newSeason: Season = Season()
                            newSeason.name = season['name']
                            newSeason.season_number = season['season_number']
                            newSeason.episode_count = season['episode_count']
                            newSeason.overview = season['overview']
                            newSeason.season_path = s.series_path + '/' + newSeason.name
                            newSeason.episodes = {}
                            s.seasons[season['season_number']] = newSeason
                            newSeason.profile = 0

                            
                            for episode_number in range(1, newSeason.episode_count + 1):
                                episode_url = f"https://api.themoviedb.org/3/tv/{s.id}/season/{newSeason.season_number}/episode/{episode_number}"
                                episode_response = requests.get(episode_url, params=params)
                                if episode_response.status_code == 200:
                                    episode= Episode()
                                    episode_data = episode_response.json()
                                    episode.series_name = s.name
                                    episode.season_name = newSeason.name
                                    episode.season_number = newSeason.season_number
                                    episode.episode_name = episode_data.get('name')
                                    episode.episode_number = episode_data.get('episode_number')
                                    episode.profile = 0
                                    try:
                                        episode.file_path = series.get('seasons')[episode.season_number]['episodes'][episode_number]['path']
                                        episode.filename = series.get('seasons')[episode.season_number]['episodes'][episode_number]['filename']
                                        episode.video_codec = series.get('seasons')[episode.season_number]['episodes'][episode_number]['codec']
                                    except:
                                        print('file not found')

                                    newSeason.episodes[episode_number] = episode
                                else:
                                    print(f"Failed to fetch episode {episode_number} information. Status code: {response.status_code}")

                            # Now `episodes` contains detailed information about each episode


                        json_str = json.dumps(asdict(s))
                        os.makedirs(metadata_folder_path, exist_ok=True)
                        with open(metadata_file_path, "w") as file:
                        # Write the metadata to the file
                            file.write(json.dumps(json_str, indent=4))
    return

def scan_series():
    root_directory = '/series'
    series_result: [Series] = []

    for series_name in os.listdir(root_directory):

        if series_name == ".DS_Store":
            continue
        series_path = os.path.join(root_directory, series_name)
        if os.path.isdir(series_path) and series_name != '.DS_Store':
            series_info = {"series": series_name, "series_path": series_path, "seasons": {}}
            for season_name in os.listdir(series_path):
                if season_name == ".DS_Store":
                    continue
                season_number = int("".join(re.findall(r'\d+', season_name)))
                season_path = os.path.join(series_path, season_name)
                if os.path.isdir(season_path) and season_name != '.DS_Store':
                    files = [f for f in os.listdir(season_path) if os.path.isfile(os.path.join(season_path, f))]

                    episodes = {}
                    for file in files:
                        # Regular expression pattern to match season and episode numbers (with or without season)
                        pattern = r"(?:S(\d{2})E(\d{2})|E(\d{2}))"

                        # Iterate through the filenames and extract season and episode numbers
                        match = re.search(pattern, file)
                        if match:
                            if match.group(1):
                                episode_number = int(match.group(2))
                            else:
                                episode_number = int(match.group(3))
                            episode_path = os.path.join(season_path, file)
                            analysis_data = analyze_media_file(episode_path)

                            episodes[episode_number] = {'series': series_name, 'season': season_number, 'episode_number': episode_number,'filename': file, 'path': season_path + '/', 'codec': analysis_data}
                        
                        else:
                            print('missing')
                    series_info["seasons"][season_number] = {"season": season_number, "episodes": episodes}
            series_result.append(series_info)
    return series_result

@app.get("/api/data/series")
def get_series_data():
    series_metadata_path = 'config/metadata/series'
    series = []

    for series_name in os.listdir(series_metadata_path):
        if series_name == ".DS_Store":
            continue
        json_file_path = os.path.join(series_metadata_path, series_name, 'series.json')

        try:
            with open(json_file_path, "r") as json_file:
                series_data_str = json.load(json_file)
                series_data = json.loads(series_data_str)
                series.append(series_data)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail=f"Series metadata not found for series: {series_name}")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Error decoding JSON for series {series_name}: {str(e)}")

    return series


@app.get("/api/data/series/meta")
def get_series_meta(series_name):

    series_metadata_path = 'config/metadata/series'
    series = []
    
    json_file_path = os.path.join(series_metadata_path,series_name,'tvdb.json')
    with open(json_file_path, "r") as json_file:
        json_data = json.load(json_file)
        series.append(json_data)
    return series[0]


@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}





def analyze_media_file(file_path):
    try:
        # Open the media file and retrieve its information
        probe = ffmpeg.probe(file_path, v='error')
                
        return probe['streams'][0]['codec_name']
    except Exception as e:
        print(f"Error analyzing the media file: {e}")
        return None
    


# Profiles
@app.get("/api/profiles")
def getProfile():
    profiles_path = 'config/profiles.json'
    with open(profiles_path, "r") as json_file:
        profiles = json.load(json_file)
    
    return profiles


@app.put("/api/profiles/{profile_id}")
async def updateProfile(profile_id, request: Request):
    req = await request.json()
    newProfile = req['profile']
    profiles_path = '/profiles.json'
    with open(profiles_path, "r") as json_file:
        profiles = json.load(json_file)
    profiles[profile_id] = newProfile
    with open(profiles_path, "w") as file:
        # Write the metadata to the file
            file.write(json.dumps(profiles))

    return profiles



@app.get("/api/codecs")
def getCodecs():
    codecs_path = 'config/codecs.json'
    with open(codecs_path, "r") as json_file:
        codecs = json.load(json_file)
    return codecs    

@app.get("/api/queue")
async def get_queue():
    return queue

@app.get("/api/scan")
async def scan_queue():
    global queue
    while True:
        await asyncio.sleep(1)  # Sleep for 5 seconds (adjust as needed)

        series_data = get_series_data()
        newq = []
        
        for series in series_data:
            for season in series['seasons']:
                for episode in series['seasons'][season]['episodes']:
                    e = series['seasons'][season]['episodes'][episode]
                    profile = e['profile']
                    codec = e['video_codec']
                    if codec and codec != profile:
                            newq.append(e)
        queue = newq[:]

async def process_episode(episode):
    try:
        file_path = episode['file_path']
        file_name = episode['filename']

        input_file = file_path + file_name
        output_file = file_path + 'temp' + file_name

        print('starting')
        ffmpeg.input(input_file).output(output_file, vcodec='libx265', preset='ultrafast').run()
        print('done')
        os.rename(output_file, input_file)
    except:
        print('fail')
    
    return



@app.post("/api/queue/start")
async def queue_start():
    global work
    work = True
    return

@app.post("/api/queue/stop")
async def queue_stop():
    global work
    work = False
    return

async def process_episodes_in_queue():
    global queue
    global work
    while True:
        await asyncio.sleep(5)
        while queue and work:
            await process_episode(queue[-1])
            queue.pop()


def start_background_task():
    asyncio.create_task(process_episodes_in_queue())
    asyncio.create_task(scan_queue())

def on_startup():
    start_background_task()

app.add_event_handler("startup", on_startup)





# CRUD operations for Series
#@app.post("/api/seriesFAKE/")
#async def create_series_handler(series_data):
    #return create_series(series_data)

#@app.get("/api/series/{series_name}")
#async def read_series_handler(series_name):
    #return read_series(series_name)

#@app.get("/api/series/test")
#async def read_all_series_handler():
    #return read_all_series()

@app.put("/api/series/{series_name}")
async def update_series_handler(series_name, request: Request):
    series_data = await request.json()
    return update_series(series_name, series_data['series_data'])

@app.delete("/api/series/{series_name}")
async def delete_series_handler(series_id: int):
    return delete_series(series_id)



@app.get("/api/codecs")
async def getCodecs():
    return ['Any', 'mpeg4',"264",'264','266']

@app.get("/api/speeds")
async def getSpeeds():
    return ['ultrafast',"superfast",'veryfast','faster', 'fast', 'medium', 'slow', 'slower', 'veryslow', 'placebo']



@app.get("/api/settings")
async def getSettings():
    settings_path = 'config'
    settings = []
    
    json_file_path = os.path.join(settings_path,'settings.json')
    with open(json_file_path, "r") as json_file:
        settings = json.load(json_file)
    return settings


@app.put("/api/settings")
async def updateSettings(request: Request):
    main_folder = 'config/'
    req = await request.json()
    newSettings = req['settings']
    settings_path = os.path.join(main_folder,'settings.json')
    with open(settings_path, "w") as file:
        # Write the metadata to the file
        file.write(json.dumps(newSettings))
    print(newSettings)
    return


@app.get("/api/image/{image_name}")
def read_image(image_name: str):
    image_path = Path(f"config/metadata/series/{image_name}")
    return FileResponse(image_path)


@app.get("/api/image_collection")
def read_image_collection():
    # You can list all the image files in your images directory
    image_directory = Path("config/metadata/series/King of the Hill/")
    print(image_directory)
    image_files = [str(file) for file in image_directory.glob("*.jpg")]

    # Return a list of image names
    return {"image_files": image_files}












# catch all routes for static html
@app.get("/")
@app.get("/{path:path}")
async def index(path):
    return FileResponse("frontend/build/index.html")