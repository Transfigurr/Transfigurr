
import json
from fastapi import APIRouter
router = APIRouter()


default_codecs = [
    "Any",
    "264",
    "265",
    "266"
]

default_speeds = [
    "Any",
    "ultrafast",
    "superfast",
    "veryfast",
    "faster",
    "fast",
    "medium",
    "slow",
    "slower",
    "veryslow",
    "placebo"
]


@router.get("/api/codecs")
async def getCodecs():
    return default_codecs    



@router.get("/api/codecs/speeds")
async def get_codec_speeds():
    return ['ultrafast',"superfast",'veryfast','faster', 'fast', 'medium', 'slow', 'slower', 'veryslow', 'placebo']
