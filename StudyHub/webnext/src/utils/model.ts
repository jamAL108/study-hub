import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API || '';

const ModelConfig = () => {
    const genAI = new GoogleGenerativeAI('AIzaSyBX16wrIG9mPvTXSc9iDA35v70phX7qgqg');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    return model;
}

export default ModelConfig