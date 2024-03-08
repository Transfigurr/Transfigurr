from src.models.system import System


def seed_system(session):
    for system in default_system:
        session.add(System(**system))
    session.commit()


default_system = [
    {
        'id': 'series_count',
        'value': 0
    },
    {
        'id': 'movies_count',
        'value': 0
    },
    {
        'id': 'monitored_count',
        'value': 0
    },
    {
        'id': 'unmonitored_count',
        'value': 0
    },
    {
        'id': 'ended_count',
        'value': 0
    },
    {
        'id': 'continuing_count',
        'value': 0
    },
    {
        'id': 'episode_count',
        'value': 0
    },
    {
        'id': 'files_count',
        'value': 0
    },
    {
        'id': 'size_on_disk',
        'value': 0
    },
    {
        'id': 'space_saved',
        'value': 0
    },
    {
        'id': 'series_total_space',
        'value': 0
    },
    {
        'id': 'movies_total_space',
        'value': 0
    },
    {
        'id': 'series_free_space',
        'value': 0
    },
    {
        'id': 'movies_free_space',
        'value': 0
    },
    {
        'id': 'config_free_space',
        'value': 0
    },
    {
        'id': 'config_total_space',
        'value': 0
    },
    {
        'id': 'transcode_free_space',
        'value': 0
    },
    {
        'id': 'transcode_total_space',
        'value': 0
    },
    {
        'id': 'scan_running',
        'value': 0
    },
    {
        'id': 'scan_target',
        'value': ''
    },
    {
        'id': 'metadata_running',
        'value': 0
    },
    {
        'id': 'metadata_target',
        'value': ''
    },
    {
        'id': 'start_time',
        'value': ""
    },
]
