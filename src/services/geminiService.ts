import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getAssistantResponse(prompt: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are KrowdFlux AI, a helpful assistant for attendees at a large-scale sporting venue. 
      Use the following context about the venue and event to answer the user's question.
      Context: ${context}
      User Question: ${prompt}`,
      config: {
        systemInstruction: "Be concise, helpful, and friendly. Provide actionable advice for navigating the venue and avoiding crowds.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}

export async function processTicketImage(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Extract match details from this ticket image. Return a JSON object with: matchName, venue, date, time, section, gate, seat. If any field is missing, use null. Return ONLY the JSON object.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error processing ticket:", error);
    throw error;
  }
}
