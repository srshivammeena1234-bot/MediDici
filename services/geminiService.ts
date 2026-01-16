import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const substituteSchema = {
  type: Type.OBJECT,
  properties: {
    substitutes: {
      type: Type.ARRAY,
      description: 'List of substitute medicines.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Brand name of the medicine.' },
          salt: { type: Type.STRING, description: 'The active chemical salt.' },
          price: { type: Type.NUMBER, description: 'Estimated price in local currency.' },
          reason: { type: Type.STRING, description: 'Brief reason why this is a good substitute.' }
        },
        required: ['name', 'salt', 'price', 'reason']
      }
    }
  }
};


export const getMedicineSubstitutes = async (medicineName: string, salt: string): Promise<string> => {
  try {
    const prompt = `Find cheaper, commonly available substitute medicines for "${medicineName}" which contains the salt "${salt}". Provide the response in JSON format.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: substituteSchema,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching medicine substitutes:", error);
    return JSON.stringify({ error: "Failed to fetch substitutes. Please try again." });
  }
};


export const getSymptomAnalysis = async (history: ChatMessage[]): Promise<string> => {
  const systemInstruction = `You are "Medi-AI", a helpful AI health assistant for MediDici. Your role is to provide preliminary health guidance based on user-reported symptoms.
  - Analyze the symptoms provided.
  - Suggest possible general causes (e.g., "This could be related to digestive issues").
  - Recommend next steps, such as lifestyle changes, home care tips, or when to see a doctor.
  - **Crucially, you must always include this disclaimer at the end of every response, formatted exactly like this:**
  "---
  *Disclaimer: I am an AI assistant and not a medical professional. This information is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*"
  - Keep your responses clear, concise, and easy to understand for a non-medical audience. Avoid jargon.
  - Do not provide definitive diagnoses or prescribe medication.
  `;
  
  // FIX: Removed 'as string' cast as ChatMessage.text is now consistently a string.
  const contents = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // FIX: Pass the full chat history to provide better context to the model.
      contents: contents,
      config: {
        systemInstruction,
      }
    });

    return response.text ?? "I'm sorry, I couldn't process that. Could you try rephrasing?";
  } catch (error) {
    console.error("Error fetching symptom analysis:", error);
    return "I'm sorry, I encountered an error while processing your request. Please check your connection or try again later. \n\n --- \n *Disclaimer: I am an AI assistant...*";
  }
};
