from sqlalchemy import insert
from src.models.profile import Profile_Codec


def seed_profile_codecs(conn):
    for profile_codec in default_profile_codecs:
        conn.execute(insert(Profile_Codec).values(profile_codec))


default_profile_codecs = [
    {
        "profile_id": "1",
        "codec_id": "Any"
    },
    {
        "profile_id": "2",
        "codec_id": "Any"
    },
    {
        "profile_id": "3",
        "codec_id": "Any"
    },
    {
        "profile_id": "4",
        "codec_id": "Any"
    },
    {
        "profile_id": "5",
        "codec_id": "Any"
    },
    {
        "profile_id": "6",
        "codec_id": "Any"
    },
    {
        "profile_id": "7",
        "codec_id": "Any"
    },
]
