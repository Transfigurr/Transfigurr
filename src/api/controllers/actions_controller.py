

import os
import signal

from src.services.metadata_service import metadata_service
from src.services.scan_service import scan_service


async def restart():
    os.kill(os.getpid(), signal.SIGHUP)
    return


async def shutdown():
    os.kill(os.getpid(), signal.SIGHUP)
    return


async def refresh_all_metadata():
    await metadata_service.enqueue_all()
    return


async def refresh_series_metadata(series_id):
    await metadata_service.enqueue(series_id)
    return


async def scan_all_series():
    await scan_service.enqueue_all()
    return


async def scan_series(series_id):
    await scan_service.enqueue(series_id)
    return
