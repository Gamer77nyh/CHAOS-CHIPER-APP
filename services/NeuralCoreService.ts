
import * as webllm from "@mlc-ai/web-llm";
import { SYSTEM_INSTRUCTION } from "../constants";

export class NeuralCoreService {
  private engine: webllm.MLCEngine | null = null;
  private selectedModel = "Llama-3-8B-Instruct-v0.3-q4f16_1-MLC"; // Efficient and powerful
  
  // Progress tracking
  private onProgressCallback: (progress: number, message: string) => void = () => {};

  public setOnProgress(callback: (progress: number, message: string) => void) {
    this.onProgressCallback = callback;
  }

  public async initialize() {
    if (this.engine) return;

    this.engine = new webllm.MLCEngine();
    this.engine.setInitProgressCallback((report) => {
      console.log("Neural Core Progress:", report.text);
      // Parse progress from report text if possible, or just send the text
      this.onProgressCallback(0, report.text);
    });

    try {
      await this.engine.reload(this.selectedModel);
      console.log("Neural Core Online.");
    } catch (e) {
      console.error("Failed to initialize Neural Core:", e);
      throw e;
    }
  }

  public async streamIntelligence(prompt: string, onChunk: (text: string) => void) {
    if (!this.engine) {
      await this.initialize();
    }

    const messages: webllm.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: prompt }
    ];

    const chunks = await this.engine!.chat.completions.create({
      messages,
      stream: true,
    });

    for await (const chunk of chunks) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
  }

  public isReady() {
    return this.engine !== null;
  }
}

export const neuralCoreService = new NeuralCoreService();
