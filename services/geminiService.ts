
import { GoogleGenAI, Type } from "@google/genai";
import { Commitment, AnalysisResult } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async transcribeAudio(base64Audio: string, mimeType: string = 'audio/webm'): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Audio
              }
            },
            {
              text: "Transcribe the following audio recording exactly as spoken. Do not add any commentary."
            }
          ]
        }
      });
      return response.text?.trim() || "";
    } catch (error) {
      console.error("Gemini transcription failed:", error);
      return "";
    }
  }

  async analyzeCommitments(commitments: Commitment[]): Promise<AnalysisResult> {
    const prompt = `
      Analyze the following list of accountability commitments and provide a brutal, useful summary of the follow-through patterns.
      Look for consistency, areas of failure, and general reliability.
      
      Commitments Data:
      ${JSON.stringify(commitments, null, 2)}
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reliabilityScore: {
                type: Type.NUMBER,
                description: "A score from 0-100 representing overall follow-through."
              },
              summary: {
                type: Type.STRING,
                description: "A concise, 'no-drama' summary of the current state."
              },
              patterns: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key behavioral patterns identified (e.g., 'Consistently misses deadlines on co-parenting tasks')."
              },
              recommendation: {
                type: Type.STRING,
                description: "Specific advice to improve accountability based on the data."
              }
            },
            required: ["reliabilityScore", "summary", "patterns", "recommendation"]
          }
        }
      });

      const text = response.text || "{}";
      return JSON.parse(text) as AnalysisResult;
    } catch (error) {
      console.error("Gemini analysis failed:", error);
      return {
        reliabilityScore: 0,
        summary: "Analysis unavailable. Please ensure your ledger has active data.",
        patterns: ["Error retrieving patterns."],
        recommendation: "Review the ledger manually or check API connectivity."
      };
    }
  }
}
