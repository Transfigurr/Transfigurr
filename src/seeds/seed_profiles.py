from sqlalchemy import insert
from src.models.profile import Profile


def seed_profiles(conn):
    for profile in default_profiles:
        conn.execute(insert(Profile).values(profile))

default_profiles = [
     {
        "id": 0,
        "name": "Any",
        "codec": "Any",
        "encoder": "",
        "speed": "",
        "container": "",
        "extension": ""
    },
    {
        "id": 1,
        "name": "h264",
        "codec": "h264",
        "encoder": "libx264",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"

    },
    {
        "id": 2,
        "name": "hevc",
        "codec": "hevc",
        "encoder": "libx265",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
 {
        "id": 3,
        "name": "mpeg4",
        "codec": "mpeg4",
        "encoder": "mpeg4",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
    {
        "id": 4,
        "name": "vp8",
        "codec": "vp8",
        "encoder": "libvpx-vp8",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
        {
        "id": 5,
        "name": "vp9",
        "codec": "vp9",
        "encoder": "libvpx-vp9",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
    {
        "id": 6,
        "name": "av1",
        "codec": "av1",
        "encoder": "libaom-av1",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
]
