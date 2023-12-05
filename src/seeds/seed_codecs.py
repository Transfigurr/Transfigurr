from sqlalchemy import insert
from src.models.codec import Codec

def seed_codecs(conn):
    for codec in default_codecs:
        query = insert(Codec).values(codec)
        conn.execute(query)

default_codecs = [
    {"id": 0, "name": "Any"},
    {"id": 1, "name": "libx264"},
    {"id": 2, "name": "h264"},
    {"id": 3, "name": "libx265"},
    {"id": 4, "name": "hevc"},
    {"id": 5, "name": "mpeg4"},
    {"id": 6, "name": "wmv2"},
    {"id": 7, "name": "vp9"},
    {"id": 8, "name": "vp8"},
    {"id": 9, "name": "av1"},
    {"id": 10, "name": "flv"},
]