

import os
import signal


async def restart():
    os.kill(os.getpid(), signal.SIGHUP)
    return


async def shutdown():
    os.kill(os.getpid(), signal.SIGHUP)
    return
