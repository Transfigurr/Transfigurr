from dataclasses import dataclass
from typing import List, Dict

from src.models.Season import Season
@dataclass
class Series:
    id: int = None
    name: str = None
    first_air_date: str = None
    genre: str = None
    status: str = None
    last_air_date: str = None
    networks: List[str] = None
    overview: str = None
    series_path: str = None
    seasons: Dict[int, Season] = None
    profile: int = None