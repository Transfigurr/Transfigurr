from sqlalchemy import insert
from src.models.profile import Profile


def seed_profiles(conn):
    for profile in default_profiles:
        conn.execute(insert(Profile).values(profile))


default_profiles = [
    {
        "name": "Any",
        "codec": "Any",
        "encoder": "",
        "speed": "",
        "container": "",
        "extension": ""
    },
    {
        "name": "h264",
        "codec": "h264",
        "encoder": "libx264",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"

    },
    {
        "name": "hevc",
        "codec": "hevc",
        "encoder": "libx265",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
    {
        "name": "mpeg4",
        "codec": "mpeg4",
        "encoder": "mpeg4",
        "speed": "",
        "container": "matroska",
        "extension": "mkv"
    },
    {
        "name": "vp8",
        "codec": "vp8",
        "encoder": "libvpx-vp8",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
    {
        "name": "vp9",
        "codec": "vp9",
        "encoder": "libvpx-vp9",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
    {
        "name": "av1",
        "codec": "av1",
        "encoder": "libaom-av1",
        "speed": "medium",
        "container": "matroska",
        "extension": "mkv"
    },
]
