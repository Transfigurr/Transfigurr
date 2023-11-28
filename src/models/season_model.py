from dataclasses import dataclass
from typing import List
from src.models.episode_model import episode_model


@dataclass
class season_model:
    name: str = None
    season_number: int = None
    episode_count: int = None
    overview: str = None
    season_path: str = None
    episodes: List[episode_model] = None
    profile: int = 0