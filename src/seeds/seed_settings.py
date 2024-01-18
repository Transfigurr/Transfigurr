from sqlalchemy import insert
from src.models.setting import Setting


def seed_settings(conn):
    for setting in default_settings:
        conn.execute(insert(Setting).values(setting))


default_settings = [
    {
        "id": "theme",
        "value": "auto"
    },
    {
        "id": "default_profile",
        "value": "1"
    },
    {
        "id": "queue_startup_state",
        "value": "previous"
    },
    {
        "id": "TMDB",
        "value": 'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKaGRXUWlPaUprT1RCalpqQmhaREEyT0dJd01XVXpNVFkxTWpjNVltWXpPRE0xWmpRNU9TSXNJbk4xWWlJNklqWTFOR0UxWVRReE5qZGlOakV6TURFeFpqUXdaV0ZpWVNJc0luTmpiM0JsY3lJNld5SmhjR2xmY21WaFpDSmRMQ0oyWlhKemFXOXVJam94ZlEuNU1LVjViaXV0RmZvQkRuMk14aFMxQU1wbV9DTmE4QTh4WE5XTkFKUVNnTQ=='
    }

]
