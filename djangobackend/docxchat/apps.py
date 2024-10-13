from django.apps import AppConfig
from .services import ExternalConnections

class DocxchatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'docxchat'
    
    def ready(self):
        # Initialize Pinecone, OpenAI, and Langchain when the app starts
        ExternalConnections.get_pinecone_client()
        ExternalConnections.get_openai_client()
        ExternalConnections.get_langchain_client()
        ExternalConnections.get_vectorStore()
