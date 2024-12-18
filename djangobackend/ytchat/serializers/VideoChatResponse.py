from rest_framework import serializers

class ChatSerializer(serializers.Serializer):
    user = serializers.CharField(max_length=50, required=False)  # Optional field
    server = serializers.CharField(max_length=50, required=False)

class VideoChatResponseSerializers(serializers.Serializer):
    message = serializers.CharField(max_length=300)
    recentChats = serializers.ListSerializer(
        child=ChatSerializer(),  # Each item in the list is validated by ChatSerializer
        allow_empty=True  # Allow the recentChats array to be empty
    )
    