from sqlalchemy import Column, Integer, String
from src.models.base import Base
from dataclasses import dataclass
from sqlalchemy import ForeignKey

@dataclass
class Encoder(Base):
    __tablename__ = 'encoders'
    id: int = Column(Integer, primary_key=True)
    encoder: str = Column(String)
    

@dataclass
class codec_encoder(Base):
    __tablename__ = 'codec_encoder'
    codec_id: int = Column(Integer, ForeignKey('codecs.id'), primary_key=True)
    encoder_id: int = Column(Integer, ForeignKey('encoders.id'), primary_key=True)
