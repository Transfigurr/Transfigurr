from sqlalchemy import insert
from src.models.codec import Codec

def seed_codecs(conn):
    for codec in default_codecs:
        query = insert(Codec).values(codec)
        conn.execute(query)

default_codecs = [
    {"id": 0, "name": "h264"},
    {"id": 1, "name": "hevc"},
    {"id": 2, "name": "mpeg4"},
    {"id": 3, "name": "vp9"},
    {"id": 4, "name": "vp8"},
    {"id": 5, "name": "av1"},
]