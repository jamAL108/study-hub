import random
import string
from moviepy.editor import VideoFileClip
import os
import assemblyai as aai

aai.settings.api_key = "9807cc31f3b446ff96b656fbc55145dd"

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
    print("MEOW")
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(os.path.join(audio_folder_path,audio_file))
    print("MEOW 2")
    return transcript.text

