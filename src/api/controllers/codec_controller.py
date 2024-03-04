async def get_all_codecs():
    return {
        "Any": {"containers": [], "encoders": []},
        "h264": {"containers": ["mp4", "matroska"], "encoders": ["libx264", "h264"], },
        "hevc": {"containers": ["mp4", "matroska"], "encoders": ["libx265"]},
        "mpeg4": {"containers": ["mp4", "matroska"], "encoders": ["mpeg4"]},
        "vp8": {"containers": ["mp4", "matroska"], "encoders": ["libvpx-vp8"]},
        "vp9": {"containers": ["mp4", "matroska"], "encoders": ["libvpx-vp9"]},
        "av1": {"containers": ["mp4", "matroska"], "encoders": ["libaom-av1"]},
    }


async def get_all_containers():
    return {
        "mp4": {"extensions": ["mp4", "m4a", "m4v", "f4v", "f4a", "m4b", "m4r", "f4b", "mov"]},
        "matroska": {"extensions": ["mkv", "mk3d", "mka", "mks"]},
    }


async def get_all_encoders():
    return {
        "h264": {"presets": ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow", "placebo"], "tune": ["none", "film", "animation", "grain", "stillimage", "psnr", "ssim", "zerolatency"], "profile": ["auto", "baseline", "main", "high", "high422", "high444"], "level": ["auto", "1.0", "1b", "1.1", "1.2", "1.3", "2.0", "2.1", "2.2", "3.0", "3.1", "3.2", "4.0", "4.1", "4.2", "5.0", "5.1", "5.2", "6.0", "6.1", "6.2"]},
        "libx264": {"presets": ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow", "placebo"], "tune": ["none", "film", "animation", "grain", "stillimage", "psnr", "ssim", "zerolatency"], "profile": ["auto", "baseline", "main", "high", "high422", "high444"], "level": ["auto", "1.0", "1b", "1.1", "1.2", "1.3", "2.0", "2.1", "2.2", "3.0", "3.1", "3.2", "4.0", "4.1", "4.2", "5.0", "5.1", "5.2", "6.0", "6.1", "6.2"]},
        "libx265": {"presets": ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow", "placebo"], "tune": ["none", "psnr", "ssim", "grain", "zerolatency", "fastdecode", "animation"], "profile": ["auto", "main", "main10", "mainstillpicture", "main444-8", "main444-intra"], "level": ["auto", "1.0", "2.0", "2.1", "3.0", "3.1", "4.0", "4.1", "5.0", "5.1", "5.2", "6.0", "6.1", "6.2"]},
        "mpeg4": {"presets": [], "tune": [], "profile": [], "level": []},
        "libvpx-vp8": {"presets": ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow", "placebo"], "tune": ["none"], "profile": ["auto"], "level": ["auto"]},
        "libvpx-vp9": {"presets": ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow", "placebo"], "tune": ["none"], "profile": ["auto"], "level": ["auto"]},
        "libaom-av1": {"presets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "tune": ["none", "psnr", "ssim"], "profile": ["auto", "main"], "level": ["auto", "2.0", "2.1", "2.2", "3.0", "3.1", "4.0", "4.1", "5.0", "5.1", "5.2", "6.0", "6.1", "6.2"]},
    }
