import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prioritize the environment variable, only use a fallback if absolutely necessary for local dev
let API_KEY = process.env.GEMINI_API_KEY;

// Clean the API key (remove quotes and whitespace)
if (API_KEY) {
  API_KEY = API_KEY.trim().replace(/^["']|["']$/g, '');
}

if (!API_KEY) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is undefined in process.env");
} else if (API_KEY === "MY_GEMINI_API_KEY" || API_KEY.includes("YOUR_API_KEY")) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is set to a placeholder value.");
} else {
  console.log("✅ GEMINI_API_KEY detected (Length:", API_KEY.length, ")");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

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
    const { image, mimeType } = req.body; 
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: image,
            },
          },
          {
            text: `SCANNER TASK: 
            1. First, find and DECODE any QR codes or barcodes in this image. 
            2. Extract the ticket holder's data from the decoded visual code OR the printed text on the ticket.
            3. Information required: Match Name, Venue, Date, Time, Section, Gate, Seat.
            
            Return the information in the specified JSON schema. Use null for any missing details.`,
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              matchName: { type: "string" },
              venue: { type: "string" },
              date: { type: "string" },
              time: { type: "string" },
              section: { type: "string" },
              gate: { type: "string" },
              seat: { type: "string" },
            },
            required: ["matchName", "venue", "section", "gate", "seat"]
          }
        }
      });
      
      const rawText = response.text;
      console.log("Gemini Raw Response:", rawText);
      
      let text = rawText?.trim() || '{}';
      // In case the model still returns markdown (rare with responseMimeType but possible)
      if (text.startsWith('```')) {
        text = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
      }
      
      const data = JSON.parse(text);
      res.json(data);
    } catch (error) {
      console.error("Gemini Scan Error:", error);
      res.status(500).json({ 
        error: "Failed to process ticket",
        details: error instanceof Error ? error.message : String(error)
      });
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
    
    // Diagnostic log to help debug Cloud Run deployments
    if (fs.existsSync(distPath)) {
      console.log(`✅ Production: Serving static files from ${distPath}`);
      const assetsPath = path.join(distPath, 'assets');
      if (fs.existsSync(assetsPath)) {
        console.log(`✅ Assets folder found`);
      } else {
        console.warn(`⚠️ Assets folder not found at ${assetsPath}`);
      }
    } else {
      console.error(`❌ CRITICAL: 'dist' folder not found at ${distPath}`);
    }

    app.use(express.static(distPath));
    
    // SPA fallback: handle all other requests by serving index.html
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application not initialized. Please ensure the build completed successfully.");
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
