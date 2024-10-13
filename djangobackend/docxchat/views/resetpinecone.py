from django.http import JsonResponse
from rest_framework.views import APIView
from pinecone import ServerlessSpec
from docxchat.services import ExternalConnections
from django.conf import settings

class resetpinecone(APIView):
    def get(self, request):
        """
        Handle GET requests.
        """
        try:
            pinecone = ExternalConnections.get_pinecone_client()
            index_name = ExternalConnections.get_index_name()
            if pinecone.Index(index_name):
                pinecone.delete_index(index_name)
            pinecone.create_index(
                name=index_name,
                dimension=int(settings.DIMENSIONS),
                metric=settings.METRIC,
                spec=ServerlessSpec(
                    cloud=settings.CLOUD, 
                    region=settings.REGION
                ) 
            ) 
            return JsonResponse({'success':True,},status=200)
        except Exception as e:
            print(str(e))
            return JsonResponse({"success":False},status=500)