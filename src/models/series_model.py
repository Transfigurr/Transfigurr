from dataclasses import dataclass
from typing import List, Dict

from src.models.season_model import season_model
@dataclass
class series_model:
    id: int = None
    name: str = None
    first_air_date: str = None
    genre: str = None
    status: str = None
    last_air_date: str = None
    networks: List[str] = None
    overview: str = None
    series_path: str = None
    seasons: Dict[int, season_model] = None
    profile: int = None