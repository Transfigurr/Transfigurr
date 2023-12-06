from sqlalchemy import Column, Integer, String
from src.models.base import Base
from dataclasses import dataclass

@dataclass
class Container(Base):
    __tablename__ = 'containers'
    id: int = Column(Integer, primary_key=True)
    ffmpeg_format: str = Column(String)
    extension: str = Column(String)
    