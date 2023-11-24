from dataclasses import dataclass
from typing import List
from src.models.Episode import Episode


@dataclass
class Season:
    name: str = None
    season_number: int = None
    episode_count: int = None
    overview: str = None
    season_path: str = None
    episodes: List[Episode] = None
    profile: int = 0