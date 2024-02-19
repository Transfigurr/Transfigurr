import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine("sqlite+aiosqlite:///config/db/database.db")


def instance_to_dict(instance):
    if not instance:
        return {}
    return {c.key: getattr(instance, c.key)
            for c in sqlalchemy.inspect(instance).mapper.column_attrs}
