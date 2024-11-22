from rest_framework import serializers

class getRecommendationSerializer(serializers.Serializer):
    q = serializers.CharField(max_length=50, required=True)

    