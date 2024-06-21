from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from deep_translator import GoogleTranslator
import os
from gtts import gTTS
from openai import OpenAI
from rag import *
from tempfile import NamedTemporaryFile
from dotenv import load_dotenv
import json

load_dotenv()

OPENAI_API = os.getenv('OPENAI_API_KEY')
PINECONE_API = os.getenv('PINECONE_API_KEY')

app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/getpdf/")
async def get_pdf(pdf_file: UploadFile = File(...)):
    try:
        if pdf_file:
            current_script_dir = os.path.dirname(os.path.abspath(__file__))
            directory_path = os.path.join(current_script_dir, 'data')
            if not os.path.exists(directory_path):
                os.makedirs(directory_path)
            file_path = os.path.join( directory_path, 'data.pdf')
            with open(file_path, "wb") as file_object:
                file_object.write(await pdf_file.read())
            print('PDF file saved successfully')
            process_pinecone()
            return JSONResponse(content={"success": True, "message": "PDF received and saved successfully"}, status_code=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JSONResponse(content={"success": False, "message": f"Error processing PDF: {str(e)}"}, status_code=500)


@app.get("/resetpinecone/")
async def reset_pinecone():
    reset_the_pinecone()



def mp3_to_text_hindi(data):
    client = OpenAI(api_key=OPENAI_API)
    transcript = client.audio.transcriptions.create(
        model="whisper-1", 
        file=data,
        language="hi",
        response_format="text"
    )
    print(f"This is MP3 Hindi:\n\n{transcript}")
    return transcript

def english_to_hindi(english_text):
    translated = GoogleTranslator(source='en',target='hi').translate(english_text)
    print(f"This is english to hindi:\n\n{translated}")
    return translated


def hindi_text_to_mp3(text):
    print("generating audio")
    language = 'hi'
    speed = False
    tts = gTTS(text=text, lang=language, slow=speed)
    with NamedTemporaryFile(delete=False) as tmp:
        tts.save(tmp.name)
        tmp_path = tmp.name
    return tmp_path

def mp3_to_text_english(data):
    client = OpenAI(api_key=OPENAI_API)
    transcript = client.audio.transcriptions.create(
        model="whisper-1", 
        file=data,
        language="en",
        response_format="text"
    )
    print(f"This is MP3 English:\n\n{transcript}")
    return transcript



def english_text_to_mp3(text):
    print("generating audio")
    language = 'en'
    speed = False
    tts = gTTS(text=text, lang=language, slow=speed)
    with NamedTemporaryFile(delete=False) as tmp:
        tts.save(tmp.name)
        tmp_path = tmp.name
    return tmp_path


def mp3_to_text_marathi(data):
    client = OpenAI(api_key=OPENAI_API)
    transcript = client.audio.transcriptions.create(
        model="whisper-1", 
        file=data,
        language="mr",
        response_format="text"
    )
    print(f"This is MP3 Marathi:\n\n{transcript}")
    return transcript


def english_to_marathi(english_text):
    translated = GoogleTranslator(source='en',target='mr').translate(english_text)
    print(f"This is English text to Marathi:\n\n{translated}")
    return translated


def marathi_text_to_mp3(text):
    print("generating audio")
    language = 'mr'
    speed = False
    tts = gTTS(text=text, lang=language, slow=speed)
    with NamedTemporaryFile(delete=False) as tmp:
        tts.save(tmp.name)
        tmp_path = tmp.name
    return tmp_path

def mp3_to_text_tamil(data):
    client = OpenAI(api_key=OPENAI_API)
    transcript = client.audio.transcriptions.create(
        model="whisper-1", 
        file=data,
        language="ta",
        response_format="text"
    )
    print(f"This is MP3 Tamil:\n\n{transcript}")
    return transcript

def english_to_tamil(english_text):
    translated = GoogleTranslator(source='en',target='ta').translate(english_text)
    print(f"This is english to tamil:\n\n{translated}")
    return translated


def tamil_text_to_mp3(text):
    print("generating audio")
    language = 'ta'
    speed = False
    tts = gTTS(text=text, lang=language, slow=speed)
    with NamedTemporaryFile(delete=False) as tmp:
        tts.save(tmp.name)
        tmp_path = tmp.name
    return tmp_path


def hindi_to_english(english_text):
    translated = GoogleTranslator(source='hi',target='en').translate(english_text)
    print(f"This is hindi to english:\n\n{translated}")
    return translated


def marathi_to_english(english_text):
    translated = GoogleTranslator(source='mr',target='en').translate(english_text)
    print(f"This is Marathi to english:\n\n{translated}")
    return translated  


def tamil_to_english(english_text):
    translated = GoogleTranslator(source='ta',target='en').translate(english_text)
    print(f"This is tamil to english:\n\n{translated}")
    return translated  


@app.post("/getaudio/")
async def get_audio(language: str = Form(...), audio: UploadFile = File(...)):
    try:
        # Save the uploaded audio file
        with open(audio.filename, "wb") as buffer:
            buffer.write(audio.file.read())
        audio_input = open(audio.filename,"rb")
        if language == 'hindi':
            stt_hin = mp3_to_text_hindi(audio_input)
            tt_hin_eng = hindi_to_english(stt_hin)
            text_query_pdf = starting_point(tt_hin_eng)
            tt_eng_hin = english_to_hindi(text_query_pdf)
            tts_hin = hindi_text_to_mp3(tt_eng_hin)
            def iterfile():
                with open(tts_hin, "rb") as audio_file:
                    yield from audio_file
                os.remove(tts_hin)
            return StreamingResponse(iterfile(),media_type="application/octet-stream")
        elif language == 'marathi':
            stt_mar = mp3_to_text_marathi(audio_input)
            tt_mar_eng = marathi_to_english(stt_mar)
            text_query_pdf = starting_point(tt_mar_eng)
            tt_eng_mar = english_to_marathi(text_query_pdf)
            tts_mar = marathi_text_to_mp3(tt_eng_mar)
            def iterfile():
                with open(tts_mar, "rb") as audio_file:
                    yield from audio_file
                os.remove(tts_mar)
            return StreamingResponse(iterfile(),media_type="application/octet-stream")
        elif language == 'tamil':
            stt_tam = mp3_to_text_tamil(audio_input)
            tt_tam_eng = tamil_to_english(stt_tam)
            text_query_pdf = starting_point(tt_tam_eng)
            tt_eng_tam = english_to_tamil(text_query_pdf)
            tts_tam = tamil_text_to_mp3(tt_eng_tam)
            def iterfile():
                with open(tts_tam, "rb") as audio_file:
                    yield from audio_file
                os.remove(tts_tam)
            return StreamingResponse(iterfile(),media_type="application/octet-stream")
        else:
            stt_eng = mp3_to_text_english(audio_input)
            text_query_pdf = starting_point(stt_eng)
            tts_eng = english_text_to_mp3(text_query_pdf)
            def iterfile():
                with open(tts_eng, "rb") as audio_file:
                    yield from audio_file
                os.remove(tts_eng)
            return StreamingResponse(iterfile(),media_type="application/octet-stream")

    except Exception as e:
        print(f"Error: {str(e)}")
        return JSONResponse(content={"success": False, "message": "Error processing audio"}, status_code=500)
    

@app.post("/gettext/")
async def get_text(text: str = Form(...), language: str = Form(...)):
    try:
        if language == 'hindi':
            tt_hin_eng = hindi_to_english(text)
            text_query_pdf = starting_point(tt_hin_eng)
            tt_eng_hin = english_to_hindi(text_query_pdf)
            response_text = tt_eng_hin
        elif language == 'marathi':
            tt_mar_eng = marathi_to_english(text)
            text_query_pdf = starting_point(tt_mar_eng)
            tt_eng_mar = english_to_marathi(text_query_pdf)
            response_text = tt_eng_mar
        elif language == 'tamil':
            tt_tam_eng = tamil_to_english(text)
            text_query_pdf = starting_point(tt_tam_eng)
            tt_eng_tam = english_to_tamil(text_query_pdf)
            response_text = tt_eng_tam
        else:
            text_query_pdf = starting_point(text)
            response_text = text_query_pdf
        return JSONResponse(content={"text": response_text, "success": True}, status_code=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JSONResponse(content={"success": False, "message": "Error processing text"}, status_code=500)


@app.post("/getmcq/")
async def mcq(topic: str = Form(...), number: int  = Form(...)):
    if(number<=0):
        return JSONResponse(content={"message":"Invalid number of questions, please enter number greater than 0"}, status_code=500)
    else:
        try:
            result = get_mcq(topic,number)
            data = json.loads(result)
            formatted=[]
            for question_ob in data:
                question = question_ob["question"]
                answer = question_ob["answer"]
                options = [question_ob["option1"],question_ob["option2"],question_ob["option3"]]
                formatted_question={
                    "question":question,
                    "answer":answer,
                    "options":options
                }
                formatted.append(formatted_question)
            return JSONResponse(formatted,status_code=200)
        except Exception as e:
            print(f"Error: {str(e)}")
            return JSONResponse(content={"success": False, "message": "Can't generate these many MCQs"}, status_code=500)

@app.post("/getviva/")
async def viva(topic: str = Form(...)):
    try:
        result = get_viva(topic)
        return JSONResponse(result,status_code=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JSONResponse(content={"success": False, "message": "Can't generate viva questions"}, status_code=500)

@app.post("/geturl/")
async def url(url: str = Form(...)):
    try:
        result = process_pinecone_url(url)
        return JSONResponse(result,status_code=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JSONResponse(content={"success": False, "message": "Can't store in pinecone"}, status_code=500)


@app.post("/getsummary/")
async def summary(topic: str = Form(...)):
    try:
        result = get_summary(topic)
        return JSONResponse(result,status_code=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JSONResponse(content={"success": False, "message": "Can't generate Summary"}, status_code=500)