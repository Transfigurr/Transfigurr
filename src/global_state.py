import os
from src.api.utils import get_config_folder, get_series_metadata_folder, open_json, write_json
from src.defaults.default_profiles import default_profiles
from src.defaults.default_config import default_config
from src.defaults.default_settings import default_settings
from src.defaults.default_codecs import default_codecs

class GlobalState:

# HISTORY
    async def get_history(self):
        return await open_json(await get_config_folder(), 'history.json', [])

    async def set_history(self, h):
        await write_json(await get_config_folder(), 'history.json', h)

# PROFILES
    async def get_profiles(self):
        return await open_json(await get_config_folder(), 'profiles.json', default_profiles)

    async def set_profiles(self, p):
        await write_json(await get_config_folder(), 'profiles.json', p)


# SERIES_LIST
    async def get_series_list(self):
        return await open_json(await get_config_folder(), 'series.json', [])
    
    async def set_series_list(self, s):
        return await write_json(await get_config_folder(), 'series.json', s)
    
# SERIES CONFIG
    async def get_series_config(self, series_name):
        folder_path = os.path.join(await get_series_metadata_folder(), series_name)
        return await open_json(folder_path, 'config.json', default_config)
    
    async def set_series_config(self, series_name, c):
        folder_path = os.path.join(await get_series_metadata_folder(), series_name)
        return await write_json(folder_path, 'config.json', c)
    
# Series
    async def get_series(self, series_name):
        folder_path = os.path.join(await get_series_metadata_folder(), series_name)
        return await open_json(folder_path, 'local.json', [])
    
    async def set_series(self, series_name, s):
        folder_path = os.path.join(await get_series_metadata_folder(), series_name)
        return await write_json(folder_path, 'local.json', s)
    

# TVDB
    async def get_tvdb(self, series_name):
        folder_path = os.path.join(await get_series_metadata_folder(), series_name)
        return await open_json(folder_path, 'tvdb.json', {})
    
    async def set_tvdb(self, series_name, t):
        folder_path = os.path.join(await get_series_metadata_folder(), series_name)
        return await write_json(folder_path, 'tvdb.json', t)
    
# QUEUE
    async def get_queue(self):
        return await open_json(await get_config_folder(), 'queue.json', [])
    async def set_queue(self, q):    
        return await write_json(await get_config_folder(), 'queue.json', q)
    
# SETTINGS
    async def get_settings(self):
        return await open_json(await get_config_folder(), 'settings.json', default_settings)
    
    async def set_settings(self, s):
        return await write_json(await get_config_folder(), 'settings.json', s)
    
# CODECS
    async def get_codecs(self):
        return await open_json(await get_config_folder(), 'codecs.json', default_codecs)
    
    async def set_codecs(self, c):
        return await write_json(await get_config_folder(), 'codecs.json', c)