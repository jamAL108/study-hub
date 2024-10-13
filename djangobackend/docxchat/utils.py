from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone 
# from langchain.embeddings.openai import OpenAIEmbeddings
# from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import PyPDFLoader
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()
import json
from docxchat.services import ExternalConnections
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_community import embeddings
from langchain_community.chat_models import ChatOllama
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain.text_splitter import CharacterTextSplitter


from langchain.schema import (
    SystemMessage,
    HumanMessage,
    AIMessage
)

model_local = ChatOllama(model="mistral")



def process_pdfData(pdf_path):
    pdf_text = get_pdf_text(pdf_path)
    text_chunks = get_text_chunks(pdf_text)
    get_vector_store(text_chunks)


def get_pdf_text(dir_path):
    loader = PyPDFLoader(file_path=dir_path)
    data = loader.load()
    return data


def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    chunks = text_splitter.split_documents(text)
    return chunks


def get_vector_store(texts):
    index_name = ExternalConnections.get_index_name()
    # embedding = embeddings.ollama.OllamaEmbeddings(model='nomic-embed-text'),
    # embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-ada-002")
    Pinecone.from_texts([t.page_content for t in texts], embedding=embeddings.OllamaEmbeddings(model='nomic-embed-text'), index_name=index_name)