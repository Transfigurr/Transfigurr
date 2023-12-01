from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from src.models.base import Base
from dataclasses import dataclass
@dataclass
class episode_model(Base):
    __tablename__ = 'episodes'

    id: str = Column(String, primary_key=True)
    series_name: str = Column(String, ForeignKey('series.name'))
    season = relationship('season_model', back_populates='episodes')
    season_number: int = Column(Integer, ForeignKey('seasons.season_number'))

    episode_number: int = Column(Integer)
    season_name: str = Column(String)
    file_path: str = Column(String)
    filename: str = Column(String)
    episode_name: str = Column(String)
    video_codec: str = Column(String)
    #profile: str = Column(Integer, default=0)
