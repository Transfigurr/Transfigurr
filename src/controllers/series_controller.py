# series_controller.py

from dataclasses import asdict
import json
import os
from fastapi import HTTPException
from typing import List, Dict, Optional
from src.models.Episode import Episode
from src.models.Profile import Profile
from src.models.Season import Season
from src.models.Series import Series
from src.models.Settings import Settings
# Dummy data to simulate database
db = []
series_metadata_path = '../config/metadata/series'



def create_series(series_data):
    series = Series(**series_data.dict(), id=len(db) + 1)
    db.append(series)
    return series

def read_series(series_name):
    series = None
    json_file_path = os.path.join(series_metadata_path,series_name,'series.json')
    with open(json_file_path, "r") as json_file:
        series = json.load(json_file)
    return series

def read_all_series():
    return db

def update_series(series_name, series_data: Series):
    if not series_data:
        return
    try:
        os.makedirs(series_metadata_path, exist_ok=True)
        series_path = os.path.join(series_metadata_path,series_name)
        os.makedirs(series_path, exist_ok=True)
        json_file_path = os.path.join(series_path,'series.json')

        json_str = json.dumps(series_data)
        with open(json_file_path, "w") as file:
        # Write the metadata to the file
            file.write(json.dumps(json_str))
    except:
        return 'fail'
    return

def delete_series(series_name):
    series = next((s for s in db if s.id == series_name), None)
    if series is None:
        raise HTTPException(status_code=404, detail="Series not found")

    db.remove(series)
    return series
