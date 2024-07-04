import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API || '';

const ModelConfig = () => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    return model;
}

export default ModelConfig