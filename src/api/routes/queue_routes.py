
from fastapi import APIRouter
from src.global_state import GlobalState

router = APIRouter()
global_state = GlobalState()

queue_model = {}

@router.get("/api/queue")
async def get_all_queue():
    return await global_state.get_all_from_table(queue_model) 

@router.get("/api/queue/{queue_id}")
async def get_queue(queue_id):
    return await global_state.get_object_from_table(queue_model, queue_id) 

@router.put('/api/queue/{queue}')
async def set_queue(queue):
    return await global_state.set_object_to_table(queue_model, queue) 
