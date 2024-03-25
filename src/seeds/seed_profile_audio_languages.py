from src.models.profile_audio_language import Profile_Audio_Language


def seed_profile_audio_languages(session):
    for profile_audio_language in default_audio_languages:
        session.add(Profile_Audio_Language(**profile_audio_language))
    session.commit()


default_audio_languages = [
    {
        "profile_id": "1",
        "language": "all"
    },
    {
        "profile_id": "2",
        "language": "all"
    },
    {
        "profile_id": "3",
        "language": "all"
    },
    {
        "profile_id": "4",
        "language": "all"
    },
    {
        "profile_id": "5",
        "language": "all"
    },
    {
        "profile_id": "6",
        "language": "all"
    },
    {
        "profile_id": "7",
        "language": "all"
    },
]
