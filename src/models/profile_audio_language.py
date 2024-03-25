from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey
from src.models.base import Base


@dataclass
class Profile_Audio_Language(Base):
    __tablename__ = 'profile_audio_language'

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id: int = Column(Integer, ForeignKey('profiles.id'))
    language: str = Column(String)
