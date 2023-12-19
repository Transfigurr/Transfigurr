from dataclasses import dataclass
from sqlalchemy import Column, Integer, String

from src.models.base import Base

@dataclass
class Setting(Base):
    __tablename__ = 'settings'

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    name: str = Column(String)
    type: str = Column(String)
    value: str = Column(String)