from dataclasses import dataclass
from sqlalchemy import Column, Integer, String

from src.models.base import Base

@dataclass
class codecs_model(Base):
    __tablename__ = 'codecs'

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String)