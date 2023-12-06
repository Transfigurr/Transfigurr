from dataclasses import dataclass
from sqlalchemy import Column, Integer, String
from sqlalchemy import ForeignKey

from src.models.base import Base



@dataclass
class Codec(Base):
    __tablename__ = 'codecs'

    id: int = Column(Integer, primary_key=True)
    name: str = Column(String)


@dataclass
class codec_container(Base):
    __tablename__ = 'codec_container'
    codec_id: int = Column(Integer, ForeignKey('codecs.id'), primary_key=True)
    container_id: int = Column(Integer, ForeignKey('containers.id'), primary_key=True)


default_codecs = {
    0: {"name": "h264", "containers":[0,1], "encoders":["libx264", "h264"]},
    1: {"name": "hevc", "containers":[0,1], "encoders":["libx265"]},
    2: {"name": "mpeg4", "containers":[0,1], "encoders":["mpeg4"]},
    3: {"name": "vp9", "containers":[0,1], "encoders":["libvpx-vp9"]},
    4: {"name": "vp8", "containers":[0,1], "encoders":["libvpx-vp8"]},
    5: {"name": "av1", "containers":[0,1], "encoders":["libaom-av1"]},
}