from dataclasses import dataclass
from typing import List
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String


from src.models.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from dataclasses import dataclass
from typing import List
from sqlalchemy.orm import relationship
from src.models.base import Base

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
    seasons = relationship('Season', back_populates='series', cascade="all, delete-orphan")  
    profile_id: int = Column(Integer, ForeignKey('profiles.id'))
