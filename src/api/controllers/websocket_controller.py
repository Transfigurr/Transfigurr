import asyncio
from src.api.controllers.history_controller import get_all_historys
from src.api.controllers.profile_controller import get_all_profiles
from src.api.controllers.series_controller import get_all_series
from src.api.controllers.settings_controller import get_all_settings
from src.api.controllers.system_controller import get_all_system
from src.api.controllers.codec_controller import get_all_codecs, get_all_containers, get_all_encoders
from src.api.controllers.log_controller import get_all_logs
from src.models.queue import queue_instance


async def get_all_websocket_data():
    while True:
        series, profiles, history, settings, system, containers, codecs, encoders, logs = await asyncio.gather(
            get_all_series(),
            get_all_profiles(),
            get_all_historys(),
            get_all_settings(),
            get_all_system(),
            get_all_containers(),
            get_all_codecs(),
            get_all_encoders(),
            get_all_logs()
        )

        yield {'series': series}
        yield {'profiles': profiles}
        yield {
            'queue': {
                'queue': queue_instance.to_list(),
                'progress': queue_instance.current_progress,
                'eta': int(queue_instance.current_eta),
                'processing': queue_instance.processing, 'active': queue_instance.active,
                'stage': queue_instance.stage
            }
        }
        yield {'history': history}
        yield {'system': system}
        yield {'settings': settings}
        yield {'containers': containers}
        yield {'codecs': codecs}
        yield {'encoders': encoders}
        yield {'logs': logs}
        await asyncio.sleep(1)
