from rest_framework import serializers


class ExploreYouTubeVideosSerializers(serializers.Serializer):
    q = serializers.CharField(max_length=50)