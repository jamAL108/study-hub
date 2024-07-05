import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEM_API_KEY || '';

const genAI = new GoogleGenerativeAI(apiKey);
const geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

export async function POST(req: NextRequest) {
    // Response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    // Response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Response.setHeader('Access-Control-Allow-Credentials', true);

    const data = await req.json();
    const prompt = `Always follow this format (question : Question generated, answer : correct answer, option1: wrong option , option2 : wrong option, option3: wrong options), ${data.topic}\n Generate ${data.number} MCQ questions from the above context. Don't repeat these questions. Keep in mind that the generated options should not be more than 15 words. The difficulty of questions should be moderate and give response inside []`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const Resp = await response.text();
    const parsedData = JSON.parse(Resp);

    let questions = [];
    for (let i = 0; i < data.number; i++) {
        const questionObj = parsedData[i];
        questions.push({
            question: questionObj.question,
            answer: questionObj.answer,
            options: [questionObj.option1, questionObj.option2, questionObj.option3],
        });
    }
    console.log(questions)
    return Response.json({ mcqs: questions });
}

