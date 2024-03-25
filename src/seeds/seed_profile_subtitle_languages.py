from src.models.profile_subtitle_language import Profile_Subtitle_Language


def seed_profile_subtitle_languages(session):
    for profile_subtitle_language in default_subtitle_languages:
        session.add(Profile_Subtitle_Language(**profile_subtitle_language))
    session.commit()


default_subtitle_languages = [
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
