from collections import deque
from typing import Union

import os
import ffmpeg
from fastapi import FastAPI

app = FastAPI()

# always in file
file_list = []  # Initialize an empty list to store the file names.

# always be in RAM
queue = deque() # Initialize an empty list to store the queued actions

# always in a file
history = [] # Initialize an empty list to store the queued actions


def scan_movies(directory_path):
    result = []
    for root, dirs, files in os.walk(directory_path):
        folder_name = os.path.basename(root)
        if folder_name != os.path.basename(directory_path):
            folder_files = [f for f in files if os.path.isfile(os.path.join(root, f))]
            result.append({"folder_name": folder_name, "files": folder_files})
    return result



@app.get("/movies")
def scan_movies():
    result = []
    directory_path = './movies'
    for root, dirs, files in os.walk(directory_path):
        folder_name = os.path.basename(root)
        if folder_name != os.path.basename(directory_path):
            folder_files = [f for f in files if os.path.isfile(os.path.join(root, f))]
            result.append({"folder_name": folder_name, "files": folder_files})
    return result

@app.get("/series")
def scan_series():
    root_directory = './series'
    series_result = []
    for series_name in os.listdir(root_directory):
        series_path = os.path.join(root_directory, series_name)
        if os.path.isdir(series_path):
            series_info = {"series": series_name, "seasons": []}
            for season_name in os.listdir(series_path):
                season_path = os.path.join(series_path, season_name)
                if os.path.isdir(season_path):
                    files = [f for f in os.listdir(season_path) if os.path.isfile(os.path.join(season_path, f))]
                    series_info["seasons"].append({"season_name": season_name, "files": files})
            series_result.append(series_info)
    return series_result


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}