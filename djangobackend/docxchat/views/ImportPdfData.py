from django.http import JsonResponse
from rest_framework.views import APIView
from docxchat.serializers.ImportPdfData import ImportPdfDataSerializers
from docxchat.docs.docxchat import upload_pdf_schema
import os
from docxchat.utils import process_pdfData

class ImportPdfData(APIView):
    serializer_class = ImportPdfDataSerializers
    @upload_pdf_schema()
    def post(self, request):
        """
        Handle POST requests.
        """
        try:
            # file = request.FILES['file']
            # if not file:
            #     return JsonResponse({"sucess":False,'Error':'Pdf File is required !!'},status=500)
            # serializer = self.serializer_class(data={"file":file})
            # if not serializer.is_valid():
            #     # error_messages = [str(error) for error in serializer.errors['file']]
            #     return JsonResponse({"sucess":False,'Error':  "File error"}, status=404)
            # valid_data = serializer.validated_data
            # file = valid_data.get("file")
            # current_script_dir = os.path.dirname(os.path.abspath(__file__))
            # parent_dir = os.path.dirname(current_script_dir)
            # directory_path = os.path.join(parent_dir, 'data')
            # if not os.path.exists(directory_path):
            #     os.makedirs(directory_path)
            # file_path = os.path.join( directory_path, 'data.pdf')
            # with open(file_path, "wb") as file_object:
            #     file_object.write(file.read())
            # print('PDF file saved successfully')
            # process_pdfData(file_path)
            return JsonResponse({"success": True, "message": "PDF received and saved successfully"},status=200)
        except Exception as e:
            print(str(e))
            return JsonResponse({"sucess":False ,'Error':'Internal Server Error'},status=500)
