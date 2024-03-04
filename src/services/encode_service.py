import asyncio
import logging
import datetime
from functools import partial
import os
import re
import shutil
import stat
import subprocess
import time
import ffmpeg
from src.api.controllers.episode_controller import get_episode, set_episode
from src.api.controllers.history_controller import set_history
from src.api.controllers.series_controller import get_series
from src.api.controllers.settings_controller import get_all_settings
from src.api.routes.profile_routes import get_all_profiles
from src.utils.folders import get_transcode_folder
from src.utils.ffmpeg import analyze_media_file

logger = logging.getLogger('logger')


class EncodeService:
    def __init__(self):
        self.encode_queue = asyncio.Queue()
        self.encode_set = set()
        self.active = True
        self.stage = 'idle'
        self.current = None
        self.processing = False
        self.current_progress = 0
        self.current_eta = 0

    async def enqueue(self, episode):
        episode_id = episode['id']
        if episode_id not in self.encode_set:
            self.encode_set.add(episode['id'])
            await self.encode_queue.put(episode)

    async def process(self):
        while True:
            try:
                settings = await get_all_settings()
                if settings['queue_status'] != 'active':
                    await asyncio.sleep(5)
                    continue
                episode = await self.encode_queue.get()
                self.current = episode
                if not episode:
                    continue
                logger.info(f"Encoding {episode['filename']}", extra={'service': 'Encode'})
                await process_episode(episode)
                self.encode_set.remove(episode['id'])
                self.current = None
            except Exception as e:
                logger.error("An error occurred while processing series %s", str(e), extra={'service': 'Encode'})
            await asyncio.sleep(1)

    async def to_list(self):
        return list(self.encode_queue._queue)

    async def get_encode_queue_data(self):
        return {
            'queue': await self.to_list(),
            'stage': self.stage,
            'processing': self.processing,
            'progress': self.current_progress,
            'eta': self.current_eta,
            'current': self.current
        }


encode_service = EncodeService()


async def run_ffmpeg(input_file, output_file, container, pass_thru_common_metadata, flipping, rotation, cropping, limit, anamorphic, fill, color, detelecine, interlace_detection, deinterlace, deinterlace_preset, deblock, deblock_tune, denoise, denoise_preset, denoise_tune, chroma_smooth, chroma_smooth_tune, sharpen, sharpen_preset, colorspace, grayscale, codec, encoder, framerate, framerate_type, quality_type, constant_quality, average_bitrate, multipass_encoding, preset, tune, profile, level, fast_decode):
    try:
        loop = asyncio.get_event_loop()
        encode_service.processing = True
        probe = ffmpeg.probe(input_file)
        total_duration = float(probe["format"]["duration"])

        command = ["ffmpeg", "-y", "-i", input_file]
        filters = []

        if encoder:
            command += ["-vcodec", encoder]

        if preset:
            if codec == 'av1':
                command += ["-cpu-used", int(preset)]
            else:
                command += ["-preset", preset]

        if pass_thru_common_metadata:
            command += ["-map_metadata", "0"]

        if flipping == 'horizontal':
            filters.append("hflip")
        elif flipping == 'vertical':
            filters.append("vflip")

        if rotation == 90:
            filters.append("transpose=1")
        elif rotation == -90:
            filters.append("transpose=2")

        if cropping == 'conservative':
            filters.append("cropdetect=24:16:0")
        elif cropping == 'automatic':
            filters.append("cropdetect")

        if anamorphic == 'automatic':
            filters.append("setsar=1")

        if fill != 'none':
            if fill == 'height':
                filters.append(f"pad=iw:ih+10:0:5:{color}")
            elif fill == 'width':
                filters.append(f"pad=iw+10:ih:5:0:{color}")
            elif fill == 'width & height':
                filters.append(f"pad=iw+10:ih+10:5:5:{color}")

        if detelecine == 'default':
            filters.append("detelecine")

        if interlace_detection == 'default':
            filters.append("idet")
        elif interlace_detection == 'less sensitive':
            filters.append("idet=half_life=1:mult=2")

        if deinterlace == 'yadif':
            if deinterlace_preset == 'skip spatial check':
                filters.append("yadif=mode=2")
            elif deinterlace_preset == 'bob':
                filters.append("yadif=mode=1")
            else:
                filters.append("yadif")
        elif deinterlace == 'decomb':
            if deinterlace_preset == 'bob':
                filters.append("w3fdif=complexity=2")
            elif deinterlace_preset == 'eedi2':
                filters.append("w3fdif=complexity=1")
            elif deinterlace_preset == 'eedi2bob':
                filters.append("w3fdif=complexity=0")
            else:
                filters.append("w3fdif")
        elif deinterlace == 'bwdif':
            if deinterlace_preset == 'bob':
                filters.append("bwdif=mode=1")
            else:
                filters.append("bwdif")

        if deblock and deblock != 'off':
            if deblock_tune == 'strong':
                filters.append("deblock=3:3")
            elif deblock_tune == 'weak':
                filters.append("deblock=1:1")
            else:
                filters.append("deblock")

        if denoise == 'nlmeans':
            if denoise_preset == 'ultralight':
                filters.append("nlmeans=s=1:d=1")
            elif denoise_preset == 'light':
                filters.append("nlmeans=s=3:d=3")
            elif denoise_preset == 'medium':
                filters.append("nlmeans=s=5:d=5")
            elif denoise_preset == 'strong':
                filters.append("nlmeans=s=7:d=7")
            else:
                filters.append("nlmeans")

            if denoise_tune == 'film':
                filters[-1] += ":p=film"
            elif denoise_tune == 'grain':
                filters[-1] += ":p=grain"
            elif denoise_tune == 'high motion':
                filters[-1] += ":p=highmotion"
            elif denoise_tune == 'animation':
                filters[-1] += ":p=animation"
            elif denoise_tune == 'tape':
                filters[-1] += ":p=tape"
            elif denoise_tune == 'sprite':
                filters[-1] += ":p=sprite"
        elif denoise == 'hqdn3d':
            if denoise_preset == 'ultralight':
                filters.append("hqdn3d=1:1:1:1")
            elif denoise_preset == 'light':
                filters.append("hqdn3d=3:3:3:3")
            elif denoise_preset == 'medium':
                filters.append("hqdn3d=5:5:5:5")
            elif denoise_preset == 'strong':
                filters.append("hqdn3d=7:7:7:7")
            else:
                filters.append("hqdn3d")

        if chroma_smooth == 'ultralight':
            filters.append("chroma_smooth=radius=1:strength=1")
        elif chroma_smooth == 'light':
            filters.append("chroma_smooth=radius=2:strength=2")
        elif chroma_smooth == 'medium':
            filters.append("chroma_smooth=radius=3:strength=3")
        elif chroma_smooth == 'strong':
            filters.append("chroma_smooth=radius=4:strength=4")
        elif chroma_smooth == 'stronger':
            filters.append("chroma_smooth=radius=5:strength=5")
        elif chroma_smooth == 'very strong':
            filters.append("chroma_smooth=radius=6:strength=6")

        if chroma_smooth_tune == 'tiny':
            filters[-1] += ":size=1"
        elif chroma_smooth_tune == 'small':
            filters[-1] += ":size=2"
        elif chroma_smooth_tune == 'medium':
            filters[-1] += ":size=3"
        elif chroma_smooth_tune == 'wide':
            filters[-1] += ":size=4"
        elif chroma_smooth_tune == 'very wide':
            filters[-1] += ":size=5"

        if sharpen == 'unsharp':
            if sharpen_preset == 'ultralight':
                filters.append("unsharp=3:3:0.3:3:3:0.3")
            elif sharpen_preset == 'light':
                filters.append("unsharp=5:5:0.5:5:5:0.5")
            elif sharpen_preset == 'medium':
                filters.append("unsharp=7:7:0.7:7:7:0.7")
            elif sharpen_preset == 'strong':
                filters.append("unsharp=9:9:0.9:9:9:0.9")
            elif sharpen_preset == 'stronger':
                filters.append("unsharp=11:11:1.1:11:11:1.1")
            elif sharpen_preset == 'very strong':
                filters.append("unsharp=13:13:1.3:13:13:1.3")
            else:
                filters.append("unsharp")
        elif sharpen == 'lapsharp':
            if sharpen_preset == 'ultralight':
                filters.append("lapsharp=c=0.3")
            elif sharpen_preset == 'light':
                filters.append("lapsharp=c=0.5")
            elif sharpen_preset == 'medium':
                filters.append("lapsharp=c=0.7")
            elif sharpen_preset == 'strong':
                filters.append("lapsharp=c=0.9")
            elif sharpen_preset == 'stronger':
                filters.append("lapsharp=c=1.1")
            elif sharpen_preset == 'very strong':
                filters.append("lapsharp=c=1.3")
            else:
                filters.append("lapsharp")

        if colorspace == 'bt.2020':
            filters.append("colorspace=bt2020")
        elif colorspace == 'bt.709':
            filters.append("colorspace=bt709")
        elif colorspace == 'bt.601':
            filters.append("colorspace=bt601-6-525")
        elif colorspace == 'bt.601 smpte-c':
            filters.append("colorspace=smpte170m")
        elif colorspace == 'bt.601 ebu':
            filters.append("colorspace=bt601-6-625")

        if grayscale:
            filters.append("format=gray")

        if limit != 'none':
            filters.append(f"scale={limit}:{-1}")

        if filters:
            command += ["-vf", ",".join(filters)]

        if framerate and framerate != 'same as source':
            command += ["-r", str(framerate)]

        if framerate_type == 'peak framerate':
            command += ["-vsync", "2"]
        else:
            command += ["-vsync", "1"]

        if quality_type:
            if quality_type == 'constant quality':
                if codec == 'mpeg4':
                    command += ["-q:v", str(constant_quality)]
                else:
                    command += ["-crf", str(constant_quality)]
            elif quality_type == 'average bitrate':
                command += ["-b:v", str(average_bitrate)]

        if tune and tune != 'none':
            command += ["-tune", tune]

        if profile and profile != 'auto':
            command += ["-profile:v", profile]

        if level and level != 'auto':
            command += ["-level:v", level]

        if fast_decode and (codec == 'h264' or 'av1'):
            command += ["-fastdecode"]

        command += ["-f", container, output_file]
        process = await loop.run_in_executor(
            None,
            partial(
                subprocess.Popen,
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
            ),
        )

        start_time = time.time()
        encode_service.stage = "encoding"
        while True:
            output = await loop.run_in_executor(None, process.stdout.readline)
            if process.poll() is not None:
                if process.poll() != 0:
                    logger.error(f"An error occurred while running ffmpeg on {input_file}: {output}", extra={'service': 'Encode'})
                    return False
                break
            if output:
                match = re.search(r"time=(\d+:\d+:\d+.\d+)", output)
                if match:
                    current_time = match.group(1)
                    FMT = "%H:%M:%S.%f"
                    tdelta = datetime.datetime.strptime(
                        current_time, FMT
                    ) - datetime.datetime.strptime("00:00:00.00", FMT)
                    current_seconds = tdelta.total_seconds()
                    encode_service.current_progress = (
                        current_seconds / total_duration
                    ) * 100

                    elapsed_time = time.time() - start_time
                    estimated_total_time = elapsed_time / (
                        encode_service.current_progress / 100
                    )
                    encode_service.current_eta = estimated_total_time - elapsed_time
    except Exception as e:
        logger.error(f"An error occurred while running ffmpeg on {input_file}: {e}", extra={'service': 'Encode'})
        return False
    return True


async def process_episode(e):
    try:
        if not e:
            return
        encode_service.stage = "analyzing"
        episode = await get_episode(e["id"])
        series = await get_series(episode["series_id"])
        profiles = await get_all_profiles()
        codec_profile = profiles[series["profile_id"]]

        # Extract variables from profile
        container = codec_profile["container"]
        extension = codec_profile["extension"]
        pass_thru_common_metadata = codec_profile["pass_thru_common_metadata"]
        flipping = codec_profile["flipping"]
        rotation = codec_profile["rotation"]
        cropping = codec_profile["cropping"]
        limit = codec_profile["limit"]
        anamorphic = codec_profile["anamorphic"]
        fill = codec_profile["fill"]
        color = codec_profile["color"]
        detelecine = codec_profile["detelecine"]
        interlace_detection = codec_profile["interlace_detection"]
        deinterlace = codec_profile["deinterlace"]
        deinterlace_preset = codec_profile["deinterlace_preset"]
        deblock = codec_profile["deblock"]
        deblock_tune = codec_profile["deblock_tune"]
        denoise = codec_profile["denoise"]
        denoise_preset = codec_profile["denoise_preset"]
        denoise_tune = codec_profile["denoise_tune"]
        chroma_smooth = codec_profile["chroma_smooth"]
        chroma_smooth_tune = codec_profile["chroma_smooth_tune"]
        sharpen = codec_profile["sharpen"]
        sharpen_preset = codec_profile["sharpen_preset"]
        colorspace = codec_profile["colorspace"]
        grayscale = codec_profile["grayscale"]
        codec = codec_profile["codec"]
        encoder = codec_profile["encoder"]
        framerate = codec_profile["framerate"]
        framerate_type = codec_profile["framerate_type"]
        quality_type = codec_profile["quality_type"]
        constant_quality = codec_profile["constant_quality"]
        average_bitrate = codec_profile["average_bitrate"]
        multipass_encoding = codec_profile["multipass_encoding"]
        preset = codec_profile["preset"]
        tune = codec_profile["tune"]
        profile = codec_profile["profile"]
        level = codec_profile["level"]
        fast_decode = codec_profile["fast_decode"]

        file_name = os.path.splitext(episode["filename"])[0]
        input_file = episode['path']
        output_file = os.path.join(
            await get_transcode_folder(), f"{file_name}.{extension}"
        )

        if not os.path.exists(input_file):
            logger.error(f"{input_file} does not exist", extra={'service': 'Encode'})
            return
        if not os.access(input_file, os.R_OK):
            logger.debug(f"Changing permissions of {input_file} to make it readable", extra={'service': 'Encode'})
            os.chmod(input_file, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)
        if not os.access(input_file, os.W_OK):
            logger.debug(f"Changing permissions of {input_file} to make it writable", extra={'service': 'Encode'})
            os.chmod(input_file, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)

        if os.path.exists(output_file) and not os.access(output_file, os.W_OK):
            logger.debug(f"Changing permissions of {output_file} to make it writable", extra={'service': 'Encode'})
            os.chmod(output_file, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)

        video_stream = await analyze_media_file(input_file)

        if video_stream == codec_profile["codec"]:
            return

        loop = asyncio.get_event_loop()

        encoding_succesful = await run_ffmpeg(input_file, output_file, container, pass_thru_common_metadata, flipping, rotation, cropping, limit, anamorphic, fill, color, detelecine, interlace_detection, deinterlace, deinterlace_preset, deblock, deblock_tune, denoise, denoise_preset, denoise_tune, chroma_smooth, chroma_smooth_tune, sharpen, sharpen_preset, colorspace, grayscale, codec, encoder, framerate, framerate_type, quality_type, constant_quality, average_bitrate, multipass_encoding, preset, tune, profile, level, fast_decode)

        if not encoding_succesful:
            encode_service.stage = "idle"
            logger.error(f"An error occurred while encoding {input_file}", extra={'service': 'Encode'})
            return

        encode_service.stage = "Copying"

        await loop.run_in_executor(None, partial(shutil.move, output_file, input_file))

        await asyncio.sleep(5)

        new_size = os.path.getsize(input_file)
        episode["space_saved"] = episode["original_size"] - new_size
        episode["size"] = new_size
        await set_episode(episode)

        await set_history(episode, codec_profile)

        encode_service.stage = "idle"
        encode_service.current_progress = 0
        encode_service.current_eta = 0
    except Exception as e:
        logger.error(f"An error occurred processing {input_file}: {e}", extra={'service': 'Encode'})
    return
