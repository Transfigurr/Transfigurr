from sqlalchemy import insert
from src.models.settings_model import settings_model

def seed_settings(conn):
    for setting in default_settings:
        conn.execute(insert(settings_model).values(setting))
default_settings = [
    {
        "id": 0,
        "name": "Root Folder",
        "type": "string",
        "value": "/"
    },
    {
        "id": 1,
        "name": "Series Folder",
        "type": "string",
        "value": "/series"
    },
    {
        "id": 2,
        "name": "Movies_ Folder",
        "type": "string",
        "value": "/movies"
    },
    {
        "id": 3,
        "name": "Transcode Folder",
        "type": "string",
        "value": "/transcode"
    }
]