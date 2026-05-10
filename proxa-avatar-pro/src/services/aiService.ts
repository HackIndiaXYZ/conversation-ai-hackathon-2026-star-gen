import { GoogleGenAI } from "@google/genai";
import { useStore } from "../store/useStore";

const geminiAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const aiService = {
  async chat(messages: any[], model: string, streamCb: (chunk: string) => void) {
    const startTime = Date.now();
    
    // Check if it's Gemini
    if (model.includes("gemini")) {
      try {
        const persona = useStore.getState().persona;
        const chat = geminiAi.chats.create({
          model: model,
          config: {
            systemInstruction: persona.systemPrompt,
          }
        });
        
        const lastMsg = messages[messages.length - 1].content;
        const result = await chat.sendMessageStream({ message: lastMsg });
        
        let fullText = "";
        for await (const chunk of result) {
          const text = chunk.text || "";
          fullText += text;
          streamCb(text);
        }
        
        useStore.getState().setNetworkLatency(Date.now() - startTime);
        return fullText;
      } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
      }
    }

    // Others go via server proxy
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages }),
      });

      if (!response.ok) throw new Error("Server error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") break;
            try {
              const { content } = JSON.parse(dataStr);
              fullText += content;
              streamCb(content);
            } catch (e) {
              // Ignore parse errors from partial chunks
            }
          }
        }
      }

      useStore.getState().setNetworkLatency(Date.now() - startTime);
      return fullText;
    } catch (error) {
      console.error("Proxy Chat Error:", error);
      throw error;
    }
  }
};
