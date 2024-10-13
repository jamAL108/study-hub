from rest_framework import serializers


class getQuizSerializers(serializers.Serializer):
    topic = serializers.CharField(max_length=50)
    question = serializers.ChoiceField(choices=[(3, '3'), (5, '5'), (10, '10')])