import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post('/api/assistant', async (req, res) => {
    const { prompt, context } = req.body;
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
      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to get assistant response" });
    }
  });

  app.post('/api/process-ticket', async (req, res) => {
    const { image } = req.body; // Base64 image
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: image,
            },
          },
          {
            text: "Extract match details from this ticket image. Return a JSON object with: matchName, venue, date, time, section, gate, seat. If any field is missing, use null. Return ONLY the JSON object.",
          },
        ],
        config: {
          responseMimeType: "application/json",
        }
      });
      let text = response.text;
      // Clean up markdown code blocks and whitespace
      text = text?.trim() || '{}';
      if (text.startsWith('```')) {
        text = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
      }
      res.json(JSON.parse(text));
    } catch (error) {
      console.error("Gemini Error processing ticket:", error);
      res.status(500).json({ error: "Failed to process ticket" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
