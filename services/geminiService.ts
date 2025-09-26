import { GoogleGenAI, Type } from '@google/genai';
import { AIModel, Category, Prompt } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Prompt generation will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateOptimizedPrompt = async (
  userInput: string,
  model: AIModel,
  category: Category
): Promise<{ title: string; prompt: string; tags: string[] }> => {
  
  const systemInstruction = `You are PromptGenie, an expert in AI prompt engineering. A user wants a prompt for the AI model "${model}".
The user's goal is: "${userInput}".
The prompt should be in the category: "${category}".

Based on this, generate a complete, structured, and optimized prompt. The prompt should be creative, detailed, and follow best practices for the specified AI model.

Return your response as a single JSON object.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'A short, catchy title for the generated prompt.'
      },
      prompt: {
        type: Type.STRING,
        description: 'The full, optimized prompt text, ready to be copied and used.'
      },
      tags: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: 'A relevant tag for the prompt'
        },
        description: 'An array of 3-5 relevant tags for the prompt.'
      }
    },
    required: ["title", "prompt", "tags"]
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate prompt from Gemini API.');
  }
};

export const generateExampleOutput = async (prompt: Prompt): Promise<string> => {
    const systemInstruction = `You are an AI model tasked with generating an example output for a given prompt.
The user has provided a prompt designed for the "${prompt.model}" model.
The prompt is: "${prompt.prompt}"

Your task is to generate a concise and relevant example of what this prompt might produce. Keep the output clean and directly related to the prompt's instructions.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt.prompt,
            config: {
                systemInstruction,
            },
        });

        return response.text;
    } catch (error) {
        console.error('Error generating example output from Gemini API:', error);
        throw new Error('Failed to generate example output from Gemini API.');
    }
};
