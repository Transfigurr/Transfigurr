from sqlalchemy import insert
from src.models.encoder import Encoder
from src.models.encoder import codec_encoder

def seed_encoders(conn):
    for encoder in default_encoders:
        conn.execute(insert(Encoder).values(encoder))
    for cc in default_codec_encoders:
        conn.execute(insert(codec_encoder).values(cc))

default_encoders = [
     {
        "id": 0,
        "encoder": "libx264",
    },
    {
        "id": 1,
        "encoder": "h264",
    },
      {
        "id": 2,
        "encoder": "libx265",
    } ]

default_codec_encoders =  [
    {"codec_id": 0, "encoder_id": 0},
    {"codec_id": 0, "encoder_id": 1},
    {"codec_id": 1, "encoder_id": 2},
]