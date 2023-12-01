import os
from fastapi import APIRouter
from src.global_state import GlobalState

global_state = GlobalState()

from src.api.utils import get_series_metadata_folder, open_json

router = APIRouter()
@router.get('/api/metadata/{name}')
async def get_metadata(name: str):

    path = os.path.join(await get_series_metadata_folder(),name)
    return await global_state.get_tvdb(name)