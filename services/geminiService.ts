
import { GoogleGenAI } from "@google/genai";

export const generateTypingText = async (topic: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a challenging but fair typing test paragraph (approx 50-70 words) about ${topic}. Ensure it has standard punctuation and casing. No Markdown, just plain text.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Failed to generate text. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the typing engine. Using fallback text instead.";
  }
};
