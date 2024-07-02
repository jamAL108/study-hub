import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { marked } from "marked";
import { sleep } from "openai/core.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiConfig = {
  temperature: 0.2,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  geminiConfig,
  generationConfig: { responseMimeType: "application/json" },
});

const upload = multer({ storage: multer.memoryStorage() });

function stripMarkdown(markdown) {
  const html = marked(markdown);
  const text = html.replace(/<\/?[^>]+(>|$)/g, "");
  return text;
}

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    const promptConfig = [
      {
        // text: 'You are an expert in text extraction from images. Analyze the provided image and return answer containing headers, paragraphs, code blocks, and any other text within images or diagrams.',
        text: "You are an expert in text extraction from images. Analyze the provided image and extract the text content. Identify headers, paragraphs, code blocks, and any other text within images or diagrams. Provide a summary of what the image conveys, include any code blocks if present, and conclude with an overview. The output format should be a JSON object containing: description (string) don't provide code here and give a context of the image, code (string) if exists ,codelanguage: (language of code if code exists in small letters) brief (string),topic: (string) topic to which this image context belongs to in 1-3 word , and conclusion (string).",
      },
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageBase64,
        },
      },
    ];

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });

    const response = await result.response;
    const responseText = await response.text();

    sleep(1000)
    console.log(responseText);
    return res.json({
      jsonData: responseText,
    });
  } catch (error) {
    console.error("Response error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port${port}`);
});
