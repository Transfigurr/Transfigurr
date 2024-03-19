from sqlalchemy import Column, Integer, String, ForeignKey
from src.models.base import Base
from dataclasses import dataclass


@dataclass
class Movie(Base):
    __tablename__ = 'movies'

    id: str = Column(String, primary_key=True)
    name: str = Column(String)
    release_date: str = Column(String)
    genre: str = Column(String)
    status: str = Column(String)
    filename: str = Column(String)
    video_codec: str = Column(String)
    overview: str = Column(String)
    size: int = Column(Integer)
    space_saved: int = Column(Integer)
    profile_id: int = Column(Integer, ForeignKey('profiles.id'))
    monitored: bool = Column(Integer)
    missing: bool = Column(Integer)
    studio: str = Column(String)
    original_size: int = Column(Integer)
    path: str = Column(String)
    runtime: int = Column(Integer)
