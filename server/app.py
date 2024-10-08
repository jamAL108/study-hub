from flask import Flask, request, jsonify 
from flask_cors import CORS
import os
import numpy as np
from pytubefix import YouTube
from io import BytesIO
from youtube_search import YoutubeSearch
from utils import generate_random_filename , getAudioFromVideo , AudioTotext
import time 
import marko
import google.generativeai as genai
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API = os.getenv('OPENAI_API_KEY')
PINECONE_API = os.getenv('PINECONE_API_KEY')

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
config = {
  'temperature': 0,
  'top_k': 20,
  'top_p': 0.9,
  'max_output_tokens': 500
}
# FolderName = os.getcwd()
FolderName = os.getcwd()
@app.route('/')
def hello_world():
	return 'Hello World'

@app.route('/searchdirecturl', methods=['GET'])
def search_direct_youtube():
    search_terms = request.args.get('q')
    if search_terms:
        try:
            results = YoutubeSearch(search_terms, max_results=2).to_json()
            return jsonify(results)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Missing search terms'}), 400

@app.route('/searchvideo', methods=['GET'])
def search_youtube():
    search_terms = request.args.get('q')
    max_results = int(request.args.get('max_results', 10))
    
    if search_terms:
        try:
            results = YoutubeSearch(search_terms, max_results=7).to_json()
            return jsonify(results)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Missing search terms'}), 400



@app.post("/getmcq/")
def mcq():
    topic = request.form.get('topic')
    number = request.form.get('number')
    print(number)
    if topic is None or number is None:
        return jsonify({'error': 'Missing topic or number'}), 400
    try:
        result = get_mcq(topic,int(number))
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
        return jsonify(mcqs=formatted,status_code=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify(content={"success": False, "message": "Can't generate these many MCQs"}, status_code=500)
        
        

def get_mcq(topic, number):
    # docs = vectorstore.similarity_search(topic)
    client = OpenAI(api_key=OPENAI_API)
    questions = []
    for i in range(0, number, 1):
        response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
            {"role": "system", "content": "Always follow this format (questions : Question generated, answer : correct answer, option1: wrong option , option2 : wrong option, option3: wrong options).\n"},
            {"role": "user", "content": f"{topic}\n Generate one mcq questions from the above context. Don't repeat these questions: \n{questions}\n Keep in mind that the generated options should not be more than 15 words. The difficulty of questions hould be moderate."}
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

    

@app.route('/startchatwithvideo', methods=['GET'])
def youtube_proxy():
    video_path=''
    audio_path=''
    try:
        video_url = 'https://www.youtube.com/watch?v=' + request.args.get('videoid')
        print(video_url)
        if not video_url:
            return jsonify({'error': 'Video URL is required'}), 400
        filename = generate_random_filename() + '.mp4'
        video_folder_path = os.path.join(FolderName, 'user_videos')
        audio_folder_path = os.path.join(FolderName,'user_audio')
        if not os.path.exists(video_folder_path):
            os.makedirs(video_folder_path)
        if not os.path.exists(audio_folder_path):
            os.makedirs(audio_folder_path)
            
        yt = YouTube(video_url)
        stream = yt.streams.get_highest_resolution() 
        stream.download(output_path=video_folder_path, filename=filename)
        mp3_file = getAudioFromVideo(os.path.join(video_folder_path,filename),audio_folder_path)
        extractedText = AudioTotext(mp3_file,audio_folder_path)
        print("DONE EXTRACTED")
        video_path = os.path.join(video_folder_path,filename)
        audio_path = os.path.join(audio_folder_path,mp3_file)
        # time.sleep(15)
        # extractedText = """
        #     React, a JavaScript library for building user interfaces. Developed at 
        #     Facebook and released in 2013, it's safe to say React has been the most influential UI library of recent memory. We use it to build components that represent logical, reusable parts of the UI. The beauty of React 
        #     is that the simplicity of building a component has been brought down to its theoretical minimum. It's just a JavaScript function. It's so easy a caveman could do it. The return value from this function is your HTML or UI, which is written in a special syntax called JSX, allowing you 
        #     to easily combine JavaScript with HTML markup. If you want to pass data into a component, you simply pass it a props argument, which you can then reference inside the function body or in the UI using braces. If the value changes, react will react to update the UI. If we want to give 
        #     our component its own internal state, we can use the state hook. The hook is just a function that returns a value as well as a function to change the value. In this case, count is our reactive state and setcount will change the state. When used in the template, the count will always 
        #     show the most recent value. Then we combine setcount to a button click 
        #     event so the user can change the state. React provides a variety of other built in hooks to handle common use cases, but the main reason you might want to use react is not the library itself, but the massive ecosystem that surrounds it. React itself doesnt care about routing, state management, animation or anything like that. Instead it lets those concerns evolve naturally within the open source community. No matter what youre trying to do, theres very likely a good supporting library to help you get it done. Need a static site? You have Gatsby. Need server side rendering? You have next for animation you have spring for forms, you 
        #     have formic state management, youve got Redux, MobX, Flux, recoil, xstate and more. You have an endless supply of choices to get things done the way you like it. As an added bonus, once you have react down you can easily jump into react native and start building mobile apps. And its 
        #     no surprise that knowing this little UI library is one of the most in demand skills for front end developers today. This has been react in 100 seconds. If you want to see more short videos like this, make sure to 
        #     like and subscribe and check out more advanced react content on Fireship IO. And if you're curious how I make these videos, make sure to check out my new personal channel and video on that topic. Thanks for watching and I will see you in the next one.
        #     """
        return jsonify({'text':extractedText}),200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(video_path):
            print("VID")
            os.remove(video_path)
        if os.path.exists(audio_path):
            print("AUD")
            os.remove(audio_path)
        


if __name__ == '__main__':
	app.run()

