from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey
from src.models.base import Base


@dataclass
class Profile_Codec(Base):
    __tablename__ = 'profile_codec'

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id: int = Column(Integer, ForeignKey('profiles.id'))
    codec_id: str = Column(String)


@dataclass
class Profile(Base):
    __tablename__ = 'profiles'

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    name: str = Column(String)
    codec: str = Column(Integer)
    encoder: str = Column(String)
    speed: str = Column(String)
    container: str = Column(String)
    extension: str = Column(String)
