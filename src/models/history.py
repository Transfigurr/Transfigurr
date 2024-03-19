from dataclasses import dataclass
from sqlalchemy import Column, String, ForeignKey, Integer
from datetime import datetime
from src.models.base import Base


@dataclass
class History(Base):

    __tablename__ = 'history'

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    media_id: str = Column(String)
    name: str = Column(String)
    type: str = Column(String)
    season_number: str = Column(String)
    episode_number: str = Column(String)
    profile_id: str = Column(String, ForeignKey('profiles.id'))
    prev_codec: str = Column(String)
    new_codec: str = Column(String)
    prev_size: str = Column(String)
    new_size: str = Column(String)
    date: str = Column(String, default=datetime.now().isoformat())
