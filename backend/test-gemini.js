import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // There isn't a direct listModels on the genAI object in the current SDK version easily exposed
    // but we can try a dummy call or check the documentation for listing.
    // In @google/generative-ai, listModels is actually not a standard exported function on the GenAI class
    // it's usually part of the admin API or requires a different approach.
    
    // Let's try a different model name that is often more compatible
    console.log("Testing gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("gemini-1.5-flash works!");
  } catch (err) {
    console.error("gemini-1.5-flash failed:", err.message);
    
    try {
        console.log("Testing gemini-1.5-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-pro works!");
    } catch (err2) {
        console.error("gemini-1.5-pro failed:", err2.message);
    }
  }
}

listModels();
