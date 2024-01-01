from sqlalchemy import insert
from src.models.setting import Setting

def seed_settings(conn):
    for setting in default_settings:
        conn.execute(insert(Setting).values(setting))
default_settings = [
    {
        "id": "theme",
        "value": "auto"
    },
    {   
        "id": "default_profile",
        "value": "1"
    },
    {   
        "id": "queue_startup_state",
        "value": "previous"
    },
]