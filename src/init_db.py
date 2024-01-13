from src.models.base import Base
from src.models.system import System  # noqa
from src.models.history import History  # noqa
from src.models.episode import Episode  # noqa
from src.models.season import Season  # noqa
from src.models.series import Series  # noqa
from src.models.setting import Setting  # noqa
from src.models.profile import Profile, profile_codec  # noqa
from src.seeds.seed_system import seed_system
from src.seeds.seed_settings import seed_settings
from src.seeds.seed_profiles import seed_profiles
from sqlalchemy import create_engine, inspect
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def init_db():
    engine = create_engine("sqlite:///config/db/database.db")

    profiles = False
    settings = False
    system = False

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if 'profiles' not in tables:
        profiles = True
    if 'settings' not in tables:
        settings = True
    if 'system' not in tables:
        system = True

    Base.metadata.create_all(engine)
    conn = engine.connect()
    if profiles:
        seed_profiles(conn)
    if settings:
        seed_settings(conn)
    if system:
        seed_system(conn)


init_db()
