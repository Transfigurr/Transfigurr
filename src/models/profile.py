from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
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

    # Summary
    name: str = Column(String)
    container: str = Column(String)
    extension: str = Column(String)
    pass_thru_common_metadata: bool = Column(Boolean)

    # Dimensions
    flipping: bool = Column(Boolean)
    rotation: int = Column(Integer)
    cropping: str = Column(String)
    limit: str = Column(String)
    anamorphic: str = Column(String)
    fill: str = Column(String)
    color: str = Column(String)

    # Filters
    detelecine: str = Column(String)
    interlace_detection: str = Column(String)
    deinterlace: str = Column(String)
    deinterlace_preset: str = Column(String)
    deblock: str = Column(String)
    deblock_tune: str = Column(String)
    denoise: str = Column(String)
    denoise_preset: str = Column(String)
    denoise_tune: str = Column(String)
    chroma_smooth: str = Column(String)
    chroma_smooth_tune: str = Column(String)
    sharpen: str = Column(String)
    sharpen_preset: str = Column(String)
    sharpen_tune: str = Column(String)
    colorspace: str = Column(String)
    grayscale: bool = Column(Boolean)

    # Video
    codec: str = Column(String)
    encoder: str = Column(String)
    framerate: int = Column(Integer)
    framerate_type: str = Column(String)
    quality_type: str = Column(String)
    constant_quality: int = Column(Integer)
    average_bitrate: int = Column(Integer)
    multipass_encoding: bool = Column(Boolean)
    preset: str = Column(String)
    tune: str = Column(String)
    profile: str = Column(String)
    level: str = Column(String)
    fast_decode: bool = Column(Boolean)
