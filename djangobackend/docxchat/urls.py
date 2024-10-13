# ytchat/urls.py
from django.urls import path
from docxchat.views import *

urlpatterns = [
    path('ImportPdfData', ImportPdfData.as_view(), name='Import_Pdf_Data'),
    path('resetpinecone', resetpinecone.as_view(), name="Reset_pinecone"),
    path('getDocSummary', getDocSummary.as_view() , name='get_doc_summary'),
    path('getQuiz', getQuiz.as_view() , name='get quiz'),
    path('documentChat' , documentChat.as_view() , name='document_chat')
]
