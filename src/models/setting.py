from dataclasses import dataclass
from sqlalchemy import Column, String
from src.models.base import Base


@dataclass
class Setting(Base):
    __tablename__ = 'settings'

    id: int = Column(String, primary_key=True)
    value: str = Column(String)
