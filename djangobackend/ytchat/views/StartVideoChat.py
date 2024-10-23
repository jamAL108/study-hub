from django.http import JsonResponse
from ytchat.utils  import generate_random_filename,getYoutubeVideo,getAudioFromVideo,AudioTotext
import os
from rest_framework.views import APIView
import time
from ytchat.serializers.StartVideoChat import StartVideoChatSerializers

FolderName = os.path.dirname(os.path.abspath(__file__))

class StartVideoChat(APIView):
    serializer_class = StartVideoChatSerializers
    def get(self,request):
        """
        Handle GET requests.
        """
        video_path=''
        audio_path=''
        try:
            data = {"videoid":request.GET.get('videoid')}
            serializer = self.serializer_class(data=data)
            if not serializer.is_valid():
                error_messages = [str(error) for error in serializer.errors['videoid']]
                return JsonResponse({'Error':  error_messages[0]}, status=404)
            valid_data = serializer.validated_data
            video_url = 'https://www.youtube.com/watch?v=' + valid_data.get('videoid')
            filename = generate_random_filename() + '.mp4'
            video_folder_path = os.path.join(FolderName, 'user_videos')
            audio_folder_path = os.path.join(FolderName,'user_audio')
            if not os.path.exists(video_folder_path):
                os.makedirs(video_folder_path)
            if not os.path.exists(audio_folder_path):
                os.makedirs(audio_folder_path)
                
            yt = getYoutubeVideo(video_url)
            stream = yt.streams.get_highest_resolution() 
            stream.download(output_path=video_folder_path, filename=filename)
            mp3_file = getAudioFromVideo(os.path.join(video_folder_path,filename),audio_folder_path)
            extractedText = AudioTotext(mp3_file,audio_folder_path)
            print("DONE EXTRACTED")
            video_path = os.path.join(video_folder_path,filename)
            audio_path = os.path.join(audio_folder_path,mp3_file)

            # time.sleep(5)
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
            return JsonResponse({'success':True,'text':extractedText},status=200)
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'success':False,'error':str(e)},status=500)
        finally:
            if os.path.exists(video_path):
                os.remove(video_path)
            if os.path.exists(audio_path):
                os.remove(audio_path)


