import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // List models is not available on the GenAI class directly.
  // We have to try common names.
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.5-pro-latest", "gemini-pro"];
  
  for (const m of models) {
    try {
      console.log(`Testing model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hi");
      const text = await result.response.text();
      console.log(`  SUCCESS with ${m}: ${text.substring(0, 20)}...`);
      break; 
    } catch (err) {
      console.error(`  FAILED ${m}: ${err.message}`);
    }
  }
}

listModels();
