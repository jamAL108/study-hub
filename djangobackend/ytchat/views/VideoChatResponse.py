from django.http import JsonResponse
import os
from rest_framework.views import APIView
import time
from ytchat.serializers.VideoChatResponse import VideoChatResponseSerializers
import json

FolderName = os.path.dirname(os.path.abspath(__file__))

class VideoChatResponse(APIView):
    serializer_class = VideoChatResponseSerializers
    def post(self,request):
        """
        Handle GET requests.
        """
        try:
            message = request.POST.get('message')
            recentChats = json.loads(request.POST.get('recentChats'))
            data = {
                'message':message,
                'recentChats':recentChats
            }
            serializer = self.serializer_class(data=data)
            if not serializer.is_valid():
                error_messages = [str(error) for error in serializer.errors['recentChats']]
                return JsonResponse({'Error':  error_messages[0]}, status=404)
            
            response = model.generate_content(
            f"""
                You are a helpful assistant designed to output JSON.
                Always follow this format for each question -> (question : Question generated, answer : correct answer, option1: wrong option , option2 : wrong option, option3: wrong options) this all should be stored in one single object and return array of object.\n     
            f"{docs}\n Generate {message} mcq questions from the above context for the topic: {valid_data.get('topic')}. Don't repeat these questions  Keep in mind that the generated options should not be more than 15 words. The difficulty of questions hould be moderate. If the provided Topic has no relation with the document provided then provide us wih this message status:false and message:"Topic Not covered in Document"                     
                """)
            print(response.text)
            dummy_text = response.text
            
            return JsonResponse({'success':True, 'text':dummy_text},status=200)
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'error':str(e)},status=500)



