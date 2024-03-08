from src.models.profile_codec import Profile_Codec


def seed_profile_codecs(session):
    for profile_codec in default_profile_codecs:
        session.add(Profile_Codec(**profile_codec))
    session.commit()


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
