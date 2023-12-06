from sqlalchemy import insert
from src.models.container import Container
from src.models.codec import codec_container

def seed_containers(conn):
    for container in default_containers:
        conn.execute(insert(Container).values(container))
    for cc in default_codec_containers:
        conn.execute(insert(codec_container).values(cc))

default_containers = [
     {
        "id": 0,
        "ffmpeg_format": "mp4",
        "extension": "mp4",
    },
      {
        "id": 1,
        "ffmpeg_format": "matroska",
        "extension": "mkv",
    } ]

default_codec_containers =  [
    {"codec_id": 0, "container_id": 0},
    {"codec_id": 0, "container_id": 1},
    {"codec_id": 1, "container_id": 0},
    {"codec_id": 1, "container_id": 1},
    {"codec_id": 2, "container_id": 0},
    {"codec_id": 2, "container_id": 1},
    {"codec_id": 3, "container_id": 0},
    {"codec_id": 3, "container_id": 1},
    {"codec_id": 4, "container_id": 0},
    {"codec_id": 4, "container_id": 1},
    {"codec_id": 5, "container_id": 0},
    {"codec_id": 5, "container_id": 1},
    {"codec_id": 6, "container_id": 0},
    {"codec_id": 6, "container_id": 1},
    {"codec_id": 7, "container_id": 0},
    {"codec_id": 7, "container_id": 1},
    {"codec_id": 8, "container_id": 0},
    {"codec_id": 8, "container_id": 1},
]