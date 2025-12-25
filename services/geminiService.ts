import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client securely
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are ElectroMind, a world-class Electrical and Electronics Engineering Professor and Assistant. 
Your goal is to help students and engineers solve problems, understand concepts, and design circuits.

Guidelines:
1. Be precise with units (V, A, Ω, W, Hz, F, H).
2. When solving problems, show step-by-step mathematical derivation using plain text notation (e.g., I = V/R).
3. If asked about circuit diagrams, describe the topology clearly or use simple ASCII representations if helpful.
4. For code requests (Arduino, MATLAB, Python for signal processing), provide efficient, commented code.
5. Keep responses concise but comprehensive.
6. If the user asks for a calculation that you can perform, do it and explain the formula.
`;

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview', // Fast model for responsive chat
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed in chat
    },
  });
};

export const solveComplexProblem = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro model for complex reasoning
      contents: prompt,
      config: {
        systemInstruction: "You are a senior electrical engineer. Solve this complex problem with detailed reasoning.",
        thinkingConfig: { thinkingBudget: 1024 } // Allow some thinking for complex math
      }
    });
    return response.text || "No solution generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to solve problem. Please check your connection.");
  }
};

export const generateQuizQuestion = async (topic: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a single multiple-choice question about ${topic} in JSON format with fields: question, options (array), answer (index), explanation.`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("Quiz Gen Error", error);
    return "{}";
  }
}