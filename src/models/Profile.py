from dataclasses import dataclass

@dataclass
class Profile:
    id: int = None
    name: str = None
    codec: str = None
    codecs: list = None
    speed: str = None