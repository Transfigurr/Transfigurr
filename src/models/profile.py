from dataclasses import dataclass
from sqlalchemy import Column, Integer, String

from src.models.base import Base

@dataclass
class Profile(Base):
    __tablename__ = 'profiles'

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String)
    codec: str = Column(String)
    speed: str = Column(String)