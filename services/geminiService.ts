
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getCipherIntelligence(prompt: string) {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.9,
          topK: 40,
        },
      });

      const result = await chat.sendMessage({ message: prompt });
      return result.text || "Transmission interrupted by security entropy.";
    } catch (error) {
      console.error("ChaosCipher Protocol Error:", error);
      return "The connection to the mainframe has been throttled. We must reset the proxy.";
    }
  }

  async streamCipherIntelligence(prompt: string, onChunk: (text: string) => void) {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.9,
        },
      });

      const result = await chat.sendMessageStream({ message: prompt });
      for await (const chunk of result) {
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }
    } catch (error) {
      console.error("ChaosCipher Stream Error:", error);
      onChunk("Stream corrupted. My malicious intent was too much for the pipe.");
    }
  }
}

export const geminiService = new GeminiService();
