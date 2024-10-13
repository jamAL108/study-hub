from rest_framework import serializers


class getDocSummarySerializers(serializers.Serializer):
    topic = serializers.CharField(max_length=50)