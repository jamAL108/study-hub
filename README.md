![Logo](https://github.com/user-attachments/assets/d667df4f-17b2-42a1-acef-d5f22c725dc7)



# Study-hub

StudyHub is an innovative online education platform designed to enhance learning through interactive features. Users can engage in real-time chats with YouTube educational videos or PDF documents, making the learning process more dynamic and interactive. Leveraging a vector database, StudyHub ensures accurate responses to user queries. The platform also offers advanced features such as PDF summarization, multiple-choice question (MCQ) generation, chat storage, and chat sharing, providing a comprehensive and enriched learning experience.


## Features

- PDF chatting
- Accurated youtube video suggestions
- Youtube vide0 chattings
- chats stored and secured
- chats can be shared through unique links
- chats can also be downloadable in pdf format
- chat with PDF Data
- PDF summarization
- PDF chats are stored and can be accesible
- Quiz MCQ generation based on any PDF topic 
- Image textify to convert image to text


## Tech Stack

**Client:** NextJS, ShadcnUI, TailwindCSS, Typescript, Lucide icons

**Server:** Flask, OpenAI key, Youtube data parser

**Database:** Pinecone (for vector Data storage), Supabase (for normal user data storage)


## Screenshots

![Landing page](https://github.com/user-attachments/assets/57fec6e0-50d8-4448-a6c0-2b986f6e868f)

![Auth](https://github.com/user-attachments/assets/4e3183e3-e4ad-4b87-8d29-dcaac08044b0)

![Dashboard](https://github.com/user-attachments/assets/216b0ec7-4d48-4b4d-ad81-ea22dfad943d)

![image](https://github.com/user-attachments/assets/4a23e194-e93b-4c46-ad07-cb249d85ea3f)

![image](https://github.com/user-attachments/assets/2e355894-0fde-4e05-aeec-65c8b6e816ad)

![image](https://github.com/user-attachments/assets/3ddf3fb4-5847-4d7e-97b8-dcaeb6767ea2)
## Installation

Install study-hub with pnpm

```bash
  cd webnext
  pnpm Install
  pnpm run dev /// dev 
  pnpm run build // build
```

```bash
  cd server
  pip install -r requirement.txt
  flask run
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Frontend :- 

`GEMINI_API`
`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_ANON_KEY``
`GEM_API_KEY` ( second alternative option )


Backend:-

`PINECONE_API_KEY`
`GEMINI_API`


