from django.http import JsonResponse
from ytchat.utils  import importYoutubeVideoOnQuery
from rest_framework.views import APIView
from ytchat.serializers.QuerySearchYouTube import QuerySearchYouTubeSerializers


class QuerySearchYouTube(APIView):
    serializer_class = QuerySearchYouTubeSerializers
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
            if valid_data.get("q"):
                results = importYoutubeVideoOnQuery(valid_data.get("q"),1)
                print(results)
                return results
            else:
                return JsonResponse({'Error':"Search Terms required"},status=404)
        except Exception as e:
            print(str(e))
            return JsonResponse({'Error':"Internal Server Error"},status=500)