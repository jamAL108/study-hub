from youtube_search import YoutubeSearch
import random
import string
from moviepy.editor import VideoFileClip
import os
import assemblyai as aai
from django.conf import settings
from pytubefix import YouTube
from django.http import JsonResponse

aai.settings.api_key = settings.ASSEMBLY_AI_KEY


def importYoutubeVideoOnQuery(search_terms,max_results):
    try:
        results = YoutubeSearch(search_terms, max_results).to_json()
        return JsonResponse({'data':results},status=200)
    except Exception as e:
        print(str(e))
        return JsonResponse({'Error':"Some Internal Server Issue"},status=500)
    

def generate_random_filename(length=10):
    """Generate a random filename."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def getAudioFromVideo(file_path , audio_folder_path):
    mp3 = generate_random_filename() + ".mp3"
    mp3_file = os.path.join(audio_folder_path,mp3)
    video_clip = VideoFileClip(file_path)
    audio_clip = video_clip.audio
    audio_clip.write_audiofile(mp3_file)
    video_clip.close()
    return mp3

def AudioTotext(audio_file , audio_folder_path):
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(os.path.join(audio_folder_path,audio_file))
    return transcript.text

def getYoutubeVideo(url):
    results = YouTube(url)
    return results

