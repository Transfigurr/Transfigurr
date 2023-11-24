from dataclasses import dataclass

@dataclass
class Episode:
    series_name: str = None
    season_name: str = None
    file_path: str = None
    filename: str = None
    season_number: int = None
    episode_name: str = None
    episode_number: int = None
    video_codec: str = None
    profile: int = 0