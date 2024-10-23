from django.http import JsonResponse
from rest_framework.views import APIView
from docxchat.serializers.getQuiz import getQuizSerializers
import os
from docxchat.services import ExternalConnections
import json

class getQuiz(APIView):
    serializer_class = getQuizSerializers
    
    dummy_text = []
    # @upload_pdf_schema()
    def post(self, request):
        """
        Handle POST requests.
        """
        try:
            data = {'topic':request.POST.get('topic'),'question':request.POST.get('question')}
            serializer = self.serializer_class(data=data)
            if not serializer.is_valid():
                error_messages = [str(error) for error in serializer.errors['topic']]
                return JsonResponse({'Error':  error_messages[0]}, status=404)
            valid_data = serializer.validated_data
            vectorStore = ExternalConnections.get_vectorStore()
            docs = vectorStore.similarity_search(valid_data.get('topic'))
            model = ExternalConnections.get_gemini_client()
            questions =[]
            
            # response = model.generate_content(
        #         f"""
        #     You are a helpful assistant designed to output JSON.
        #     Always follow this format for each question -> (question : Question generated, answer : correct answer, option1: wrong option , option2 : wrong option, option3: wrong options) this all should be stored in one single object and return array of object.\n     
        # f"{docs}\n Generate {valid_data.get('question')} mcq questions from the above context for the topic: {valid_data.get('topic')}. Don't repeat these questions  Keep in mind that the generated options should not be more than 15 words. The difficulty of questions hould be moderate. If the provided Topic has no relation with the document provided then provide us wih this message status:false and message:"Topic Not covered in Document"                     
        #     """)
        #     print(response.text)
            # dummy_text = response.text
            
            # json_responses = [json.loads(response) for response in questions]
            # fin2 = json.dumps(json_responses, indent=4)
            # parsed_json = json.loads(fin2)
            # minimized_json_string = json.dumps(parsed_json, separators=(',', ':'))
            # print(minimized_json_string)
            return JsonResponse({"success": True, 'data':response.text},status=200)
        except Exception as e:
            print(str(e))
            return JsonResponse({"sucess":False ,'Error':'Internal Server Error'},status=500)
