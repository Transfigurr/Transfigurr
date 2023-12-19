from sqlalchemy import insert
from src.models.setting import Setting

def seed_settings(conn):
    for setting in default_settings:
        conn.execute(insert(Setting).values(setting))
default_settings = [
    {
        "name": "Root Folder",
        "type": "string",
        "value": "/"
    },
    {
        "name": "Series Folder",
        "type": "string",
        "value": "/series"
    },
    {
        "name": "Movies Folder",
        "type": "string",
        "value": "/movies"
    },
    {
        "name": "Transcode Folder",
        "type": "string",
        "value": "/transcode"
    },
    {
        "name": "Theme",
        "type": "string",
        "value": "auto"
    }
]