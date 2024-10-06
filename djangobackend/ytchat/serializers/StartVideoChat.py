from rest_framework import serializers


class StartVideoChatSerializers(serializers.Serializer):
    videoid = serializers.CharField()
    
    def validate_videoid(self, value):
        # Check if the length of videoid is exactly 11
        if len(value) != 11:
            raise serializers.ValidationError("The video ID is Invalid")
        return value