from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from src.models.base import Base
from dataclasses import dataclass
@dataclass
class Episode(Base):
    __tablename__ = 'episodes'

    id: str = Column(String, primary_key=True)
    series_id: str = Column(String, ForeignKey('series.id'))
    season_id: str = Column(String, ForeignKey('seasons.id'))
    episode_number: int = Column(Integer)
    season_name: str = Column(String)
    filename: str = Column(String)
    episode_name: str = Column(String)
    video_codec: str = Column(String)
