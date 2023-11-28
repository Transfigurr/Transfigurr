from dataclasses import dataclass

@dataclass
class profile_model:
    id: int = None
    name: str = None
    codec: str = None
    codecs: list = None
    speed: str = None