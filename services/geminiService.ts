
import { GoogleGenAI, Type } from "@google/genai";
import { DesignIdeas } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const designIdeasSchema = {
  type: Type.OBJECT,
  properties: {
    currentStyle: {
      type: Type.STRING,
      description: "A brief, one-sentence analysis of the room's current state based on the image."
    },
    redesignConcept: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "The name of the requested style." },
        description: { type: Type.STRING, description: "An inspiring paragraph about the new design." },
        suggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "An array of 3-4 specific, actionable suggestions."
        },
      },
      required: ["title", "description", "suggestions"]
    },
    alternativeConcept: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "The name of a different but complementary style." },
        description: { type: Type.STRING, description: "A brief paragraph about this alternative style." },
        suggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "An array of 2-3 suggestions for this alternative style."
        },
      },
      required: ["title", "description", "suggestions"]
    },
    colorPalette: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 4 hex color codes for the primary redesign concept."
    },
    shoppingIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          estimatedPrice: { type: Type.STRING },
        },
        required: ["item", "estimatedPrice"]
      },
      description: "An array of 3 budget-friendly shopping ideas."
    }
  },
  required: ["currentStyle", "redesignConcept", "alternativeConcept", "colorPalette", "shoppingIdeas"]
};


export const generateDesignIdeas = async (imageBase64: string, style: string): Promise<DesignIdeas | null> => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: imageBase64,
    },
  };

  const prompt = `You are an expert interior designer AI. A user has uploaded a photo of their room and wants a redesign in a specific style. Your role is to be inspiring and practical, avoiding complex jargon.

The user's requested style is: "${style}".

Analyze the room from the image and provide design suggestions based on the requested style. Output must be a clear, structured JSON object that adheres to the provided schema.`;

  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: designIdeasSchema,
        temperature: 0.7,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as DesignIdeas;
  } catch (error) {
    console.error("Error generating design ideas:", error);
    throw new Error("Failed to generate design ideas from Gemini API.");
  }
};

export const generateStyledImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: `Generate a photorealistic image of a room based on this description: ${prompt}. The image should look professionally designed and well-lit.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate a new room image from Imagen API.");
  }
};
   