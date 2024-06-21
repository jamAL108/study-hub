import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API || '';

const ModelConfig = () => {
    const genAI = new GoogleGenerativeAI("AIzaSyAsi474NfYaPT1nBU24huFKWQtghZ0R74c");
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    return model;
}

export default ModelConfig