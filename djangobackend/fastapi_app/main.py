# fastapi_app/main.py
from fastapi import FastAPI, Request, Query
import httpx
import requests

app = FastAPI()

# Configure the Django app URL
DJANGO_API_BASE_URL = "http://127.0.0.1:8000"  # Update with your Django server URL


@app.get("/ytchat/search/")
async def query_search_youtube(q: str = Query(...)):
    """
    Forward GET request to the Django API for searching YouTube videos.
    """
    response = requests.get(f"{DJANGO_API_BASE_URL}search?q={q}")
    return response.json()

@app.get("/ytchat/explore/")
async def explore_youtube_videos(q: str = Query(...), max_results: int = Query(10)):
    """
    Forward GET request to the Django API for exploring YouTube videos.
    """
    response = requests.get(f"{DJANGO_API_BASE_URL}explore?q={q}&max_results={max_results}")
    return response.json()

@app.get("/ytchat/start-chat/")
async def start_video_chat(videoid: str = Query(...)):
    """
    Forward GET request to the Django API to start a video chat.
    """
    response = requests.get(f"{DJANGO_API_BASE_URL}start-chat?videoid={videoid}")
    return response.json()
