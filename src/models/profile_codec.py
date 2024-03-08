from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey
from src.models.base import Base


@dataclass
class Profile_Codec(Base):
    __tablename__ = 'profile_codec'

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id: int = Column(Integer, ForeignKey('profiles.id'))
    codec_id: str = Column(String)
