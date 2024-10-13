from django.http import JsonResponse
from rest_framework.views import APIView
from docxchat.serializers.documentChat import getDocumentChatSerializers
from docxchat.docs.docxchat import upload_pdf_schema
import os
from docxchat.services import ExternalConnections
import json
from rest_framework.exceptions import ValidationError
import markdown

class documentChat(APIView):
    serializer_class = getDocumentChatSerializers
    # @upload_pdf_schema()
    def post(self, request):
        """
        Handle POST requests.
        """
        try:
            message = request.POST.get('message')
            language = request.POST.get('language')

            # Get 'recentChats' and parse it as JSON
            recent_chats = json.loads(request.POST.get('recentChats'))

            # Now 'recent_chats' will be a list of Python dictionaries
            data = {
                'message': message,
                'language': language,
                'recentChats': recent_chats,
            }
            serializer = self.serializer_class(data=data)
            serializer
            if not serializer.is_valid():
                raise ValidationError(serializer.errors)
            valid_data = serializer.validated_data
            vectorStore = ExternalConnections.get_vectorStore()
            docs = vectorStore.similarity_search(valid_data.get('message'))
            model = ExternalConnections.get_gemini_client()
            response = model.generate_content(
                f"""
                You are a highly advanced AI assistant helping users in a conversation. Your task is to answer the user's question based on the provided information. Please take the context from the given documents, understand the recent chat messages for more background, and then generate a relevant and accurate response.
                
                The output format should strictly follow this structure:
                - text: a string answer from the question.
                - a text 5-100 words , maximum 100 words . But you answer according to the context and question been asked.
                
                Use the following input data for generating the response:
                - "content": {docs}  
                - "question": {valid_data.get('message')} 
                - "recentChats": ${json.dumps(valid_data.get('recentChats'))}
                
                The sections should be logical, relevant, and aligned with the question and the context. Ensure the response is concise and well-structured for easy understanding.
            """)
            jsonParsedData = json.loads(response.text)
            print(jsonParsedData['text'])
            return JsonResponse({"success": True, 'text':jsonParsedData['text']},status=200)
        except Exception as e:
            print(str(e))
            return JsonResponse({"sucess":False ,'Error':'Internal Server Error'},status=500)