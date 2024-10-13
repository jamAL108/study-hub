from django.http import JsonResponse
from rest_framework.views import APIView
from docxchat.serializers.getDocSummary import getDocSummarySerializers
from docxchat.docs.docxchat import upload_pdf_schema
import os
from docxchat.services import ExternalConnections
import markdown
import json

class getDocSummary(APIView):
    serializer_class = getDocSummarySerializers
    # @upload_pdf_schema()
    def post(self, request):
        """
        Handle POST requests.
        """
        try:
            data = {'topic':request.POST.get('topic')}
            serializer = self.serializer_class(data=data)
            if not serializer.is_valid():
                error_messages = [str(error) for error in serializer.errors['topic']]
                return JsonResponse({'Error':  error_messages[0]}, status=404)
            valid_data = serializer.validated_data
            vectorStore = ExternalConnections.get_vectorStore()
            docs = vectorStore.similarity_search(valid_data.get('topic'))
            model = ExternalConnections.get_gemini_client()
            response = model.generate_content(
                f"""
                You are a helpful educational assistant. Your task is to generate a concise summary based on the provided context. The summary must be divided into sections, with appropriate section headings determined based on the content. The output format should strictly follow this structure:
                    - Section 1: 
                    - Section 2: 
                    - (up to a maximum of four sections)
                    The section names should be dynamically generated and logically aligned with the content and topic. Here's the input for generating the summary:
                    - "content": {docs}
                    - "topic": {valid_data.get('topic')}
                    Please summarize the information while ensuring relevance to the selected topic.                         
            """)
            print(response.text)
            res = json.loads(response.text)
            # html_output = markdown.markdown(response.text)
            # print(html_output)
            return JsonResponse({"success": True, 'text':res},status=200)
        except Exception as e:
            print(str(e))
            return JsonResponse({"sucess":False ,'Error':'Internal Server Error'},status=500)
