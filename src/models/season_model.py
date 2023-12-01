from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


from src.models.base import Base

@dataclass
class season_model(Base):
    
    __tablename__ = 'seasons'

    id: str = Column(String, primary_key=True)
    name: str = Column(String)
    season_number: str = Column(Integer)
    episode_count: str = Column(Integer)

    series_id: str = Column(String, ForeignKey('series.id'))
    series = relationship('series_model', back_populates='seasons')

    episodes = relationship('episode_model', back_populates='season')