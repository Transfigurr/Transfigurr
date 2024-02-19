from dataclasses import dataclass
from typing import List
from src.models.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey


@dataclass
class Series(Base):
    __tablename__ = 'series'

    id: str = Column(String, primary_key=True)
    name: str = Column(String)
    first_air_date: str = Column(String)
    genre: str = Column(String)
    status: str = Column(String)
    last_air_date: str = Column(String)
    networks: List[str] = Column(String)
    overview: str = Column(String)
    profile_id: int = Column(Integer, ForeignKey('profiles.id'))
    monitored: bool = Column(Integer)
    episode_count: int = Column(Integer)
    size: int = Column(Integer)
    seasons_count: int = Column(Integer)
    space_saved: int = Column(Integer)
    missing_episodes: int = Column(Integer)
    runtime: int = Column(Integer)
