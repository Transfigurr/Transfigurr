from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey
from src.models.base import Base


@dataclass
class Season(Base):
    __tablename__ = "seasons"

    id: str = Column(String, primary_key=True)
    name: str = Column(String)
    season_number: str = Column(Integer, default=0)
    episode_count: str = Column(Integer, default=0)
    size: int = Column(Integer, default=0)
    series_id: str = Column(String, ForeignKey("series.id"))
    space_saved: int = Column(Integer, default=0)
    missing_episodes: int = Column(Integer, default=0)
