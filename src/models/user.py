from dataclasses import dataclass
from sqlalchemy import Column, String
from src.models.base import Base


@dataclass
class User(Base):
    __tablename__ = 'user'

    username: str = Column(String, primary_key=True)
    password: str = Column(String)
    secret: str = Column(String)
