async def get_all_codecs():
    return codecs 

async def get_all_containers():
    return containers 

async def get_all_encoders():
    return encoders 



containers = {
    "mp4": {"extensions": ["mp4","m4a","m4v","f4v","f4a","m4b","m4r","f4b","mov"]},
    "matroska": {"extensions": ["mkv","mk3d","mka","mks"]},
}

encoders = {
    "h264": {"presets": []},
    "libx264": {"presets": ["ultrafast","superfast","veryfast","faster","fast","medium","slow","slower","veryslow","placebo"]},
    "libx265": {"presets": ["ultrafast","superfast","veryfast","faster","fast","medium","slow","slower","veryslow","placebo"]},
    "mpeg4": {"presets": []},
    "libvpx-vp8": {"presets": ["ultrafast","superfast","veryfast","faster","fast","medium","slow","slower","veryslow","placebo"]},
    "libvpx-vp9": {"presets": ["ultrafast","superfast","veryfast","faster","fast","medium","slow","slower","veryslow","placebo"]},
    "libaom-av1": {"presets": ["ultrafast","superfast","veryfast","faster","fast","medium","slow","slower","veryslow","placebo"]}
}


codecs = {
    "Any": {"containers":[], "encoders":[]},
    "h264": {"containers":["mp4","matroska"], "encoders":["libx264", "h264"],},
    "hevc": {"containers":["mp4","matroska"], "encoders":["libx265"]},
    "mpeg4": {"containers":["mp4","matroska"], "encoders":["mpeg4"]},
    "vp8": {"containers":["mp4","matroska"], "encoders":["libvpx-vp8"]},
    "vp9" : {"containers":["mp4","matroska"], "encoders":["libvpx-vp9"]},
    "av1": {"containers":["mp4","matroska"], "encoders":["libaom-av1"]},
}