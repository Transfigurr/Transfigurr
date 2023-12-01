from sqlalchemy import insert
from src.models.codecs_model import codecs_model

def seed_codecs(conn):
    for codec in default_codecs:
        query = insert(codecs_model).values(codec)
        conn.execute(query)

default_codecs = [
    {"id": 0, "name": "Any"},
    {"id": 1, "name": "264"},
    {"id": 2, "name": "265"},
    {"id": 3, "name": "266"}
]