# ytchat/urls.py
from django.urls import path
from ytchat.views import *

urlpatterns = [
    path('search', QuerySearchYouTube.as_view(), name='query_search_youtube'),
    path('explore', ExploreYouTubeVideos.as_view(), name='explore_youtube_videos'),
    path('start-chat', StartVideoChat.as_view(), name='start_video_chat'),
    path('video-chat' , VideoChatResponse.as_view(), name='video_chat_response')
]
