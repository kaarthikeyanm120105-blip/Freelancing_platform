import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const configurations = [
    { model: "gemini-1.5-flash", version: "v1beta" },
    { model: "gemini-1.5-flash", version: "v1" },
    { model: "gemini-pro", version: "v1beta" },
    { model: "gemini-1.0-pro", version: "v1" }
  ];
  
  for (const config of configurations) {
    try {
      console.log(`Testing model: ${config.model} with API: ${config.version}...`);
      const model = genAI.getGenerativeModel(
        { model: config.model },
        { apiVersion: config.version }
      );
      const result = await model.generateContent("Hi");
      const text = await result.response.text();
      console.log(`  SUCCESS: ${text.substring(0, 20)}...`);
      break; 
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }
}

listModels();
