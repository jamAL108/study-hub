# services.py
# import pinecone
# import openai
# from langchain import LangChain
import google.generativeai as genai
import os
from django.conf import settings
from pinecone.grpc import PineconeGRPC as Pinecone_GRPC
from langchain_pinecone import PineconeVectorStore
from pinecone import ServerlessSpec
from langchain_community import embeddings

class ExternalConnections:
    _pinecone_client = None
    _openai_client = None
    _langchain_client = None
    _gemini_client = None
    index_name = "studyhub"
    vectorStore = None
    pineconeIndex = None

    @classmethod
    def get_pinecone_client(cls):
        if cls._pinecone_client is None:
            pc = Pinecone_GRPC(api_key=settings.PINECONE_API_KEY)
            cls._pinecone_client = pc
        return cls._pinecone_client
    
    @classmethod
    def create_pinecone_index(cls):
        if cls._pinecone_client != None and not cls._pinecone_client.Index(cls.index_name):
            cls._pinecone_client.create_index(
                name=cls.index_name,
                dimension=int(settings.DIMENSIONS),
                metric=settings.METRIC,
                spec=ServerlessSpec(
                    cloud=settings.CLOUD, 
                    region=settings.REGION
                ) 
            )
        cls.pineconeIndex = cls._pinecone_client.Index(cls.index_name) 
        print(cls.pineconeIndex)
    
    @classmethod
    def get_vectorStore(cls):
        if cls.vectorStore is None:
            cls.create_pinecone_index()
            embedding = embeddings.OllamaEmbeddings(model='nomic-embed-text')
            pc = PineconeVectorStore(cls.pineconeIndex,embedding,'text')
            cls.vectorStore = pc
        return cls.vectorStore
    
    @classmethod
    def get_index_name(cls):
        return cls.index_name
    
    @classmethod
    def get_gemini_client(cls):
        if cls._gemini_client is None:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            geminiConfig = {
                'temperature': 0.2,
                'topP': 1,
                'topK': 32,
                'maxOutputTokens': 4096,
            }
            cls._gemini_client = genai.GenerativeModel('gemini-1.5-flash',generation_config={"response_mime_type": "application/json"},)
        return cls._gemini_client

    @classmethod
    def get_openai_client(cls):
        # if cls._openai_client is None:
        #     openai.api_key = 'your_openai_api_key'
        #     cls._openai_client = openai
        return cls._openai_client

    @classmethod
    def get_langchain_client(cls):
        # if cls._langchain_client is None:
        #     cls._langchain_client = LangChain(api_url='your_langchain_url')
        return cls._langchain_client
