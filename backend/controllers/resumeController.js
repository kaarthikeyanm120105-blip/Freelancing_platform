import OpenAI from "openai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import fs from "fs";
import path from "path";
import freelancerModel from "../models/freelancerSchema.js";

export const analyzeResume = async (req, res) => {
    let filePath = "";

    // 8. Debug log: req.file
    console.log("Incoming file request:", req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
    } : "No file received");

    try {
        // 5. AI API Configuration
        const apiKey = process.env.XAI_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === "your_gemini_api_key_here") {
            console.error("AI API Key is undefined or using placeholder.");
            return res.status(500).json({
                success: false,
                message: "Server Configuration Error: AI API Key is missing. Please check your .env file."
            });
        }

        // Initialize OpenAI Client for Groq (The user's key gsk_ is a Groq key)
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        filePath = path.resolve(req.file.path);

        // 2. Extract resume text properly using pdf-parse
        let resumeText = "";
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const result = await pdf(dataBuffer);
            resumeText = result.text;

            // 8. Debug log: extracted text length
            console.log("Extracted text length:", resumeText ? resumeText.length : 0);
        } catch (parseErr) {
            console.error("PDF extraction error:", parseErr);
            return res.status(422).json({ success: false, message: "Failed to extract resume text" });
        }

        // 3. Validate extracted text
        if (!resumeText || resumeText.trim().length < 50) {
            console.warn("Invalid resume content detected (too short or empty)");
            return res.status(422).json({ success: false, message: "Invalid resume content" });
        }

        // 4. Prepare AI prompt
        const prompt = `
Analyze the following resume text and return ONLY a valid JSON object.
RESUME TEXT:
"""
${resumeText}
"""
TASKS:
1. Extract technical skills
2. Determine experience level (Beginner, Intermediate, Expert)
3. Identify job role
4. Suggest 5 missing skills
5. Recommend 5 REAL-WORLD FREE course titles from platforms like Great Learning, FreeCodeCamp, Coursera (Audit), or Udemy (Free).
6. Short career summary (max 2 lines)

OUTPUT JSON FORMAT (STRICT):
{
  "skills": [],
  "experienceLevel": "",
  "suggestedRole": "",
  "recommendedSkills": [],
  "recommendedCourses": [
    { "title": "", "platform": "" }
  ],
  "careerSummary": ""
}
`;

        console.log("Sending request to Groq LPU...");
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a professional career assistant for TVK platform. Return valid JSON only." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const rawText = completion.choices[0].message.content;
        console.log("AI Response received successfully.");

        let analysis;
        try {
            analysis = JSON.parse(rawText);
        } catch (jsonErr) {
            console.error("Failed to parse AI JSON response:", rawText);
            return res.status(500).json({ success: false, message: "AI returned an invalid response structure." });
        }

        // --- Database Persistence Logic ---
        const userId = req.userId; // Provided by auth middleware
        if (userId) {
            try {
                const user = await freelancerModel.findById(userId);
                if (user) {
                    // 1. Smart Skill Merge (Case-insensitive unique merge)
                    const existingSkills = user.skills || [];
                    const newSkills = analysis.skills || [];
                    
                    // Create a normalized set of existing skills
                    const skillSet = new Set(existingSkills.map(s => s.toLowerCase()));
                    
                    // Add new skills if they don't already exist
                    newSkills.forEach(skill => {
                        if (skill && !skillSet.has(skill.toLowerCase())) {
                            existingSkills.push(skill);
                            skillSet.add(skill.toLowerCase());
                        }
                    });

                    user.skills = existingSkills;

                    // 2. Update Role/Title and Experience if they are empty or new
                    if (analysis.suggestedRole) {
                        user.title = analysis.suggestedRole;
                    }
                    
                    if (analysis.experienceLevel && ["Beginner", "Intermediate", "Expert"].includes(analysis.experienceLevel)) {
                        user.experienceLevel = analysis.experienceLevel;
                    }

                    // 3. Update summary if provided
                    if (analysis.careerSummary) {
                        user.bio = analysis.careerSummary;
                    }

                    await user.save();
                    console.log(`Database updated for user ${userId} with resume analysis.`);
                }
            } catch (dbError) {
                console.error("Failed to update user profile with analysis results:", dbError);
                // We don't return error here because analysis was successful, just saving to profile failed.
            }
        }

        // Final Success Response
        return res.status(200).json({ success: true, analysis });

    } catch (error) {
        console.error("Global Resume analysis error (Groq):", error);
        return res.status(500).json({
            success: false,
            message: "Resume analysis failed: " + (error.message || "Unknown error")
        });
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log("Cleaned up temp file:", filePath);
            } catch (unlinkErr) {
                console.error("Cleanup error:", unlinkErr);
            }
        }
    }
};
