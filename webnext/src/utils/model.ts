import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey:any = process.env.NEXT_PUBLIC_GEMINI_API ;

const ModelConfig = () => {
    // console.log("ECXVFDS")
    // console.log(apiKey)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    return model;
}

export default ModelConfig