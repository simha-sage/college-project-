// Initialize Gemini
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

import express from "express";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

router.post("/refineTone", async (req, res) => {
    try {
    const { text, tone } = req.body; // tone: 'professional', 'casual', 'funny', 'short'

    const prompt = `
      Rewrite the following chat message to sound more ${tone}.
      Original Message: "${text}"
      
      Rules:
      - Keep the core meaning identical.
      - Maintain a natural chat vibe.
      - Return ONLY the rewritten string, no extra text.
    `;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const refinedText = result.text().trim();

    res.status(200).json({ refinedText });
  } catch (error) {
    console.error("Tone Refine Error:", error);
    res.status(500).json({ error: "Failed to refine tone" });
  }
});
router.post("/generate-replies", async (req, res) => {
  const { message: lastMessage, isOwnMessage } = req.body;
  console.log("Received for AI:", lastMessage, "Is own message?", isOwnMessage);
  try {
    const prompt = `
  You are an expert Chat Assistant specialized in short, high-engagement messaging.
  
  CONTEXT:
  - Last Message: "${lastMessage}"
  - User Role: ${isOwnMessage ? "The user SENT this message." : "The user RECEIVED this message."}
  
  TASK:
  Provide 3 natural, conversational suggestions.
  ${
    isOwnMessage
      ? "Suggest what the user should say NEXT to keep the conversation moving."
      : "Suggest how the user should RESPOND to the sender."
  }

  STRICT STYLE RULES:
  1. LENGTH: 1-4 words maximum per suggestion.
  2. TONE: Casual, friendly, and youthful (Gen-Z/Millennial style).
  3. VARIETY: Ensure the 3 options offer different intents (e.g., One Positive, One Question, One Casual).
  4. NO PUNCTUATION: Avoid periods at the end. Use emojis sparingly.
  5. FORMAT: Return ONLY a JSON array of strings.

  EXAMPLES:
  - If Received: "Wanna grab Biryani?" -> ["Count me in!", "Which place?", "Maybe tomorrow"]
  - If Sent: "I'm heading to college now" -> ["See you there", "Save me a seat", "Traffic is crazy"]

  JSON OUTPUT:`;

    // 3. Generate Content
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleanText = result.text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanText));
  } catch (error) {
    console.error("AI Error:", error);
    res.json(["Okay", "Cool", "Got it"]); // Fallback if API fails
  }
});

export default router;
