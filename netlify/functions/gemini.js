const { GoogleGenAI, Type } = require("@google/genai");

// This handler will be executed by Netlify when your frontend calls `/.netlify/functions/gemini`
exports.handler = async function (event) {
  // First, validate that the API key is available.
  if (!process.env.API_KEY) {
    console.error('API_KEY environment variable not set.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: The API key is missing. Please contact the site administrator.' }),
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { type, payload } = JSON.parse(event.body);
    
    let responseText = '';

    // Handle request for medicine substitutes
    if (type === 'substitutes') {
      const { medicineName, salt } = payload;
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
      
      const prompt = `Find cheaper, commonly available substitute medicines for "${medicineName}" which contains the salt "${salt}". Provide the response in JSON format.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: substituteSchema }
      });
      responseText = response.text;

    // Handle request for symptom analysis
    } else if (type === 'analysis') {
      const { history } = payload;
      const systemInstruction = `You are "Medi-AI", a helpful AI health assistant for MediDici. Your role is to provide preliminary health guidance based on user-reported symptoms.
- Analyze the symptoms provided.
- Suggest possible general causes (e.g., "This could be related to digestive issues").
- Recommend next steps, such as lifestyle changes, home care tips, or when to see a doctor.
- **Crucially, you must always include this disclaimer at the end of every response, formatted exactly like this:**
"---
*Disclaimer: I am an AI assistant and not a medical professional. This information is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*"
- Keep your responses clear, concise, and easy to understand for a non-medical audience. Avoid jargon.
- Do not provide definitive diagnoses or prescribe medication.`;

      const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: { systemInstruction }
      });
      responseText = response.text ?? "I'm sorry, I couldn't process that. Could you try rephrasing?";
    
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request type' }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: responseText }),
    };

  } catch (error) {
    console.error('Error in Netlify function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};