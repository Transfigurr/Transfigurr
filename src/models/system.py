from dataclasses import dataclass
from sqlalchemy import Column, String
from src.models.base import Base


@dataclass
class System(Base):
    __tablename__ = 'system'

    id: str = Column(String, primary_key=True)
    value: str = Column(String)
