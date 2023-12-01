import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, inspect
from sqlalchemy.sql import text

from src.seeds.seed_codecs import seed_codecs
from src.seeds.seed_profiles import seed_profiles
from src.seeds.seed_settings import seed_settings


from src.models.codecs_model import codecs_model
from src.models.profile_model import profile_model
from src.models.settings_model import settings_model
from src.models.series_model import series_model
from src.models.season_model import season_model
from src.models.episode_model import episode_model

from src.models.base import Base

def init_db():
    engine = create_engine("sqlite:///config/db/database.db")
    
    profiles = False
    settings = False
    codecs = False

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if 'profiles' not in tables:
        profiles = True
    if 'settings' not in tables:
        settings = True
    if 'codecs' not in tables:
        codecs = True

    Base.metadata.create_all(engine)
    conn = engine.connect()
    if profiles:
        seed_profiles(conn)
    if settings:  
        seed_settings(conn)
    if codecs: 
        seed_codecs(conn)
init_db()