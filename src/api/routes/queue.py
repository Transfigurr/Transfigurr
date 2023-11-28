from fastapi import APIRouter
router = APIRouter()
@router.post("/api/queue/start")
async def queue_start():
    work = True
    return

@router.post("/api/queue/stop")
async def queue_stop():
    work = False
    return