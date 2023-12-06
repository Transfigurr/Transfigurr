
from fastapi import APIRouter
from src.global_state import GlobalState
from src.models.encoder import Encoder

router = APIRouter()
global_state = GlobalState()

@router.get("/api/encoders")
async def get_all_encoders():
    encoders_list = await global_state.get_all_from_table(Encoder) 
    encoders_dict = {encoder['id']: encoder for encoder in encoders_list}
    return encoders_dict