import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: "AIzaSyC_Slcv8saSu5zG_O46g8dZezQG4H_933c" });
export function askGemini(userMessage) {
  return ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
  }).then(response => response.text);
}