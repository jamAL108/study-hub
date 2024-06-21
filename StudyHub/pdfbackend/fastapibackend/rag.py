from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone 
import pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import PyPDFLoader
from openai import OpenAI
from dotenv import load_dotenv
import os
from langchain_community.document_loaders import WebBaseLoader
load_dotenv()
import json

from langchain.schema import (
    SystemMessage,
    HumanMessage,
    AIMessage
)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')

pinecone.init(api_key=PINECONE_API_KEY, environment='gcp-starter')

index_name = "chatbook"
index = pinecone.Index(index_name)


chat = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    model='gpt-3.5-turbo',
)


message = [
    SystemMessage(content="""You are an educational chatbot. You have to answer the responses based on the contexts that will be provided to you. 
                  If the context doesn't have the answer reply 'The context provided doesn't have answer to this.' Do not make up your own answer."""),
    HumanMessage(content="Hi AI, how are you today?"),
    AIMessage(content="I'm great thank you. How can I help you?")
]

embed_model = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-ada-002")
text_field = "text"
vectorstore = Pinecone(index, embed_model.embed_query,text_field)


current_script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the 'data' folder relative to the current script
data_directory_path = os.path.join(current_script_dir, 'data')

# Construct the path to 'data.pdf' within the 'data' folder
dir_path = os.path.join(data_directory_path, 'data.pdf')


def get_pdf_text(dir_path):
    loader = PyPDFLoader(file_path=dir_path)
    data = loader.load()
    return data


def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    chunks = text_splitter.split_documents(text)
    return chunks


def get_vector_store(texts):
    index_name = "chatbook"
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-ada-002")
    docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)


def process_pinecone():
    pdf_text = get_pdf_text(dir_path)
    text_chunks = get_text_chunks(pdf_text)
    get_vector_store(text_chunks)



def augment_prompt(query):
    if len(message)>2:
        results = vectorstore.similarity_search(str(message[-1])+'\n'+query,k=3)
    else:
        results = vectorstore.similarity_search(query,k=3)
    source_knowledge = "\n".join([x.page_content for x in results])

    augemented_prompt = f"""Using the contexts below, answer the query. Also you are provided with previous conversations of the 
    system with the user. Refer to this conversation and understand what the user is asking for making you a conversational bot.

    Context:
    {source_knowledge}

    Query:
    {query}"""
    return augemented_prompt



def starting_point(question):
    prompt = HumanMessage(
        content = augment_prompt(question)
        )
    message.append(prompt)
    res = chat(message[-4:])
    message.append(res)
    return res.content

def reset_the_pinecone():
    pinecone.delete_index("chatbook")
    pinecone.create_index(name="chatbook", dimension=1536, metric='cosine')


def get_summary(question):
    docs = vectorstore.similarity_search(question)
    client = OpenAI(api_key=OPENAI_API_KEY)
    sumary = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role":"system","content":"""You are a helpful educational assistant.
            You would need to generate a concise summary on the context provided to you. Include the following in the summary and generate response in this format only:
            1. Introduction\n, 2. Key Concepts and Theoires\n, 3. Methodology\n, 4. Findings or Main Points\n, 5. Implications or Application\n, 6. Conclusion\n """},
            {"role":"user","content":f"{docs}\n Generate the summary of the above"}
        ]
    )
    return (sumary.choices[0].message.content)

def get_viva(question):
    docs = vectorstore.similarity_search(question)
    client = OpenAI(api_key=OPENAI_API_KEY)
    viva = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role":"system","content":"""You are a helpful educational assistant.
            You would need to generate viva questions and their answers on the context provided to you. Cover all the important points and generate as many questions as possible. The format of the query should be:\n 
            Question:\n Answer:\n For Example of format:\nQuestion:What is cloud computing?\nAnswer:Cloud computing is the on-demand availability of computer system resources, especially data storage (cloud storage) and computing power, without direct active management by the user. Large clouds often have functions distributed over multiple locations, each of which is a data center. Cloud computing relies on sharing of resources to achieve coherence and typically uses a pay-as-you-go model, which can help in reducing capital expenses but may also lead to unexpected operating expenses for users"""},
            {"role":"user","content":f"{docs}\n Generate the viva questions from the above"}
        ]
    )
    return (viva.choices[0].message.content)

def get_mcq(topic, number):
    docs = vectorstore.similarity_search(topic)
    client = OpenAI(api_key=OPENAI_API_KEY)
    questions = []
    for i in range(0, number, 1):
        response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
            {"role": "system", "content": "Always follow this format (questions : Question generated, answer : correct answer, option1: wrong option , option2 : wrong option, option3: wrong options).\n"},
            {"role": "user", "content": f"{docs}\n Generate one mcq questions from the above context. Don't repeat these questions: \n{questions}\n Keep in mind that the generated options should not be more than 15 words. The difficulty of questions hould be moderate."}
        ]
        )
        questions.append(response.choices[0].message.content)  
    print(questions)
    json_responses = [json.loads(response) for response in questions]
    fin2 = json.dumps(json_responses, indent=4)
    parsed_json = json.loads(fin2)
    minimized_json_string = json.dumps(parsed_json, separators=(',', ':'))
    print(minimized_json_string)
    return minimized_json_string                 

def process_pinecone_url(url):
    loader = WebBaseLoader(url)
    data = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(data)
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY, model="text-embedding-ada-002")
    docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)
