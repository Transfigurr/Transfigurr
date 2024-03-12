import logging
from src.services.metadata_service import metadata_service
from src.services.scan_service import scan_service

logger = logging.getLogger('logger')


async def restart():
    try:
        with open('/config/restart.txt', 'a') as f:
            f.write('\n')
        return
    except Exception as e:
        logger.error(f'An error occurred while restarting: {e}', extra={'service': 'System'})
        return False


async def shutdown():
    try:
        with open('/config/shutdown.txt', 'a') as f:
            f.write('\n')
        return
    except Exception as e:
        logger.error(f'An error occurred while shutting down: {e}', extra={'service': 'System'})
        return False


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
