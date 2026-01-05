import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image to count the number of people present.
 * @param base64Data The base64 string of the image (without the data URL prefix)
 * @param mimeType The mime type of the image (e.g., 'image/jpeg')
 */
export const countPeopleInImage = async (
  base64Data: string,
  mimeType: string
): Promise<AnalysisResult> => {
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyse cette image et compte le nombre d'êtres humains visibles. 
                   Ne compte pas les dessins animés, les statues ou les reflets si possible.
                   Sois précis.`,
          },
        ],
      },
      config: {
        systemInstruction: "Tu es un assistant expert en vision par ordinateur. Tu dois répondre en format JSON uniquement.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            count: {
              type: Type.INTEGER,
              description: "Le nombre total de personnes détectées.",
            },
            description: {
              type: Type.STRING,
              description: "Une brève description (en français) de la scène et de où se trouvent les personnes (max 2 phrases).",
            },
            confidenceLevel: {
              type: Type.STRING,
              description: "Niveau de confiance de l'analyse (Élevé, Moyen, Faible).",
            }
          },
          required: ["count", "description"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("Aucune réponse textuelle reçue de l'IA.");

  } catch (error) {
    console.error("Erreur lors de l'analyse Gemini:", error);
    throw new Error("Impossible d'analyser l'image. Veuillez réessayer.");
  }
};