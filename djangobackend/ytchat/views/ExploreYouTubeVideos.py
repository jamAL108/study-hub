from django.http import JsonResponse
from ytchat.utils import importYoutubeVideoOnQuery
from rest_framework.views import APIView
from ytchat.serializers.ExploreYouTubeVideos import ExploreYouTubeVideosSerializers
import requests
import json

class ExploreYouTubeVideos(APIView):
    serializer_class = ExploreYouTubeVideosSerializers
    def get(self, request):
        """
        Handle GET requests.
        """
        try:
            data = {"q":request.GET.get('q')}
            serializer = self.serializer_class(data=data)
            if not serializer.is_valid():
                error_messages = [str(error) for error in serializer.errors['q']]
                return JsonResponse({'Error':  error_messages[0]}, status=404)
            valid_data = serializer.validated_data
            max_results = int(request.GET.get('max_results', 10))
            print(valid_data.get("q"))
            if valid_data.get("q"):
                results = importYoutubeVideoOnQuery(valid_data.get("q"),7)
                res = json.loads(results.content)
                resul = json.loads(res['data'])
                print(resul)
                return JsonResponse({'videos':resul},status=200)
            else:
                return JsonResponse({'error': 'Missing search terms'},status=400)
        except Exception as e:
            print(str(e))
            return JsonResponse({'Error':'Internal Server Error'},status=500)
