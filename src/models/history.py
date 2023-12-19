from dataclasses import dataclass
from sqlalchemy import Column, String, Integer, ForeignKey


from src.models.base import Base

@dataclass
class History(Base):
    
    __tablename__ = 'history'

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    episode_id: str = Column(String, ForeignKey('episodes.id'))
    profile_id: str = Column(String, ForeignKey('profiles.id'))
    prev_codec: str = Column(String)
    new_codec: str = Column(String)