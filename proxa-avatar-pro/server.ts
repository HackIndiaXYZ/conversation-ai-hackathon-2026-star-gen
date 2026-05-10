import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Anthropic } from "@anthropic-ai/sdk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Clients (Lazy initialized)
  let openai: OpenAI | null = null;
  let anthropic: Anthropic | null = null;

  const getOpenAI = () => {
    if (!openai) {
      if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
  };

  const getAnthropic = () => {
    if (!anthropic) {
      if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is missing");
      anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    return anthropic;
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    const { model, messages, stream = true } = req.body;
    
    try {
      if (model.startsWith("gpt")) {
        const client = getOpenAI();
        if (stream) {
          const response = await client.chat.completions.create({
            model,
            messages,
            stream: true,
          });
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
          res.write("data: [DONE]\n\n");
          res.end();
        } else {
          const response = await client.chat.completions.create({ model, messages });
          res.json(response);
        }
      } else if (model.startsWith("claude")) {
        const client = getAnthropic();
        if (stream) {
          const streamResponse = await client.messages.create({
            model,
            messages,
            max_tokens: 1024,
            stream: true,
          });
          res.setHeader("Content-Type", "text/event-stream");
          for await (const event of streamResponse) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
            }
          }
          res.write("data: [DONE]\n\n");
          res.end();
        } else {
          const response = await client.messages.create({ model, messages, max_tokens: 1024 });
          res.json(response);
        }
      } else {
        res.status(400).json({ error: "Unsupported model" });
      }
    } catch (error: any) {
      console.error("AI API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
