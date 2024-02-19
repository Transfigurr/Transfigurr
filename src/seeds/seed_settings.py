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
        "value": 1
    },
    {
        "id": "queue_status",
        "value": "active"
    },
    {
        "id": "queue_startup_state",
        "value": "previous"
    },
    {
        "id": "log_level",
        "value": "info"
    },
    {
        "id": "media_view",
        "value": "posters"
    }, {
        "id": "media_sort",
        "value": "title"
    },
    {
        "id": "media_sort_direction",
        "value": "ascending"
    },
    {
        "id": "media_filter",
        "value": "all"
    },
    {
        "id": "TMDB",
        "value": 'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKaGRXUWlPaUprT1RCalpqQmhaREEyT0dJd01XVXpNVFkxTWpjNVltWXpPRE0xWmpRNU9TSXNJbk4xWWlJNklqWTFOR0UxWVRReE5qZGlOakV6TURFeFpqUXdaV0ZpWVNJc0luTmpiM0JsY3lJNld5SmhjR2xmY21WaFpDSmRMQ0oyWlhKemFXOXVJam94ZlEuNU1LVjViaXV0RmZvQkRuMk14aFMxQU1wbV9DTmE4QTh4WE5XTkFKUVNnTQ=='
    },
    {
        "id": "media_poster_posterSize",
        "value": 'medium'
    },
    {
        "id": "media_poster_detailedProgressBar",
        "value": False
    },
    {
        "id": "media_poster_showTitle",
        "value": True
    },
    {
        "id": "media_poster_showMonitored",
        "value": True
    },
    {
        "id": "media_poster_showProfile",
        "value": True
    },
    {
        "id": "media_table_showNetwork",
        "value": False
    },
    {
        "id": "media_table_showProfile",
        "value": True
    },
    {
        "id": "media_table_showSeasons",
        "value": True
    },
    {
        "id": "media_table_showEpisodes",
        "value": True
    },
    {
        "id": "media_table_showEpisodeCount",
        "value": False
    },
    {
        "id": "media_table_showYear",
        "value": True
    },
    {
        "id": "media_table_showSizeOnDisk",
        "value": True
    },
    {
        "id": "media_table_showSizeSaved",
        "value": True
    },
    {
        "id": "media_table_showGenre",
        "value": False
    },
    {
        "id": "media_overview_posterSize",
        "value": 'medium'
    },
    {
        "id": "media_overview_detailedProgressBar",
        "value": False
    },
    {
        "id": "media_overview_showMonitored",
        "value": True
    },
    {
        "id": "media_overview_showNetwork",
        "value": True
    },
    {
        "id": "media_overview_showProfile",
        "value": True
    },
    {
        "id": "media_overview_showSeasonCount",
        "value": True
    },
    {
        "id": "media_overview_showPath",
        "value": False
    },
    {
        "id": "media_overview_showSizeOnDisk",
        "value": True
    },


]
