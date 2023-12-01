from sqlalchemy import insert
from src.models.profile_model import profile_model


def seed_profiles(conn):
    for profile in default_profiles:
        conn.execute(insert(profile_model).values(profile))

default_profiles = [
     {
        "id": 0,
        "name": "Any",
        "codec": "Any",
        "speed": "ultrafast"
    },
     {
        "id": 1,
        "name": "264",
        "codec": "264",
        "speed": "slow"
    },
 {
        "id": 2,
        "name": "265",
        "codec": "265",
        "speed": "ultrafast"
    },
 {
        "id": 3,
        "name": "mpeg4",
        "codec": "mpeg4",
        "speed": "ultrafast"
    }
]
