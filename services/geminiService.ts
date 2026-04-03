
import { ChatMessage } from '../types';

/**
 * A helper function to communicate with our secure Netlify serverless function.
 * @param type The type of API call to make ('substitutes' or 'analysis').
 * @param payload The data required for the API call.
 * @returns The text response from the Gemini API.
 */
const callGeminiApi = async (type: 'substitutes' | 'analysis', payload: any): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
      console.error(`Error calling Netlify function for ${type}:`, error);
      throw error;
  }
};

export const getMedicineSubstitutes = async (medicineName: string, salt: string): Promise<string> => {
  try {
    const responseText = await callGeminiApi('substitutes', { medicineName, salt });
    return responseText;
  } catch (error) {
    console.error("Error fetching medicine substitutes:", error);
    return JSON.stringify({ error: "Failed to fetch substitutes. The AI service may be temporarily unavailable." });
  }
};

export const getSymptomAnalysis = async (history: ChatMessage[]): Promise<string> => {
  try {
      const responseText = await callGeminiApi('analysis', { history });
      return responseText;
  } catch (error) {
    console.error("Error fetching symptom analysis:", error);
    return "I'm sorry, I encountered an error while processing your request. Please check your connection or try again later. \n\n --- \n *Disclaimer: I am an AI assistant...*";
  }
};
