import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, inspect
from src.seeds.seed_codecs import seed_codecs
from src.seeds.seed_profiles import seed_profiles
from src.seeds.seed_settings import seed_settings
from src.seeds.seed_containers import seed_containers
from src.seeds.seed_encoders import seed_encoders


from src.models.codec import Codec
from src.models.container import Container
from src.models.profile import Profile, profile_codec
from src.models.setting import Setting
from src.models.series import Series
from src.models.season import Season
from src.models.episode import Episode
from src.models.encoder import Encoder, codec_encoder

from src.models.base import Base

def init_db():
    engine = create_engine("sqlite:///config/db/database.db")
    
    profiles = False
    settings = False

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if 'profiles' not in tables:
        profiles = True
    if 'settings' not in tables:
        settings = True

    Base.metadata.create_all(engine)
    conn = engine.connect()
    if profiles:
        seed_profiles(conn)
    if settings:  
        seed_settings(conn)
init_db()