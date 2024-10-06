from rest_framework import serializers
import re

class QuerySearchYouTubeSerializers(serializers.Serializer):
    q = serializers.CharField(max_length=50)
    
    def validate_q(self, value):
        # Regular expression to match YouTube video URL format
        youtube_regex = r'^https://www\.youtube\.com/watch\?v=[a-zA-Z0-9_-]{11}$'

        if not re.match(youtube_regex, value):
            raise serializers.ValidationError("The URL must be a valid YouTube video URL.")
        
        return value