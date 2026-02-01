
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeListing(imageBuffer: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: imageBuffer.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Analyze this clothing item for a marketplace listing. Return brand, style, material, color, and 3 specific 'vibe' tags (e.g., Y2K, Grunge, Coquette). Format as JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brand: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            vibe: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedPrice: { type: Type.NUMBER }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  async findProductLink(description: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find a direct shopping link for this item: "${description}". If it's a specific brand like Edikted, White Fox, or Princess Polly, prioritize those.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return chunks?.[0]?.web?.uri || null;
  }

  async getPersonalizedRecs(userClosetDNA: string[], campusInventory: string[]) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User loves: ${userClosetDNA.join(', ')}. Campus has: ${campusInventory.join(', ')}. Which items match the user's vibe best? Return item IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  }
}

export const gemini = new GeminiService();
