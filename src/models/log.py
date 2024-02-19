from dataclasses import dataclass
from sqlalchemy import Column, Integer, String
from src.models.base import Base


@dataclass
class Log(Base):
    __tablename__ = 'logs'

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    timestamp: str = Column(String)
    level: str = Column(String)
    service: str = Column(String)
    message: str = Column(String)
