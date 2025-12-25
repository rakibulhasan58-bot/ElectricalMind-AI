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

export const createStandardsChatSession = (standard: string): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an expert consultant on ${standard} standards.
      Your goal is to help users understand, interpret, and apply these codes.
      
      Guidelines:
      1. Cite specific sections or articles if possible (e.g., "NEC Article 250" or "IEEE Std 80").
      2. Explain the 'why' behind the rule (safety, efficiency, etc.).
      3. If there are differences between versions (e.g., NEC 2020 vs 2023), mention them if relevant.
      4. Be concise but accurate.
      5. If the user asks for a comparison (e.g., IEC vs NEC), provide a clear contrast.
      `,
      temperature: 0.4, // Lower temperature for more factual responses
    },
  });
};

export const createAutocadChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an expert AutoCAD Electrical Instructor.
      Your goal is to guide users through the software's features, commands, and workflows for electrical design.
      
      Guidelines:
      1. Provide step-by-step instructions for tasks (e.g., "To insert a symbol: Go to Schematic Tab > Insert Components").
      2. Mention useful commands and shortcuts (e.g., AEWIRE, AEREROUTE).
      3. Explain the Project Manager workflow, as it is central to AutoCAD Electrical.
      4. Cover topics like Schematic Design, Panel Layouts, PLC Modules, Terminal Strips, and Generating Reports (BOM).
      5. Distinguish between standard AutoCAD commands and AutoCAD Electrical specific toolsets.
      6. If a user asks about errors, provide troubleshooting steps.
      `,
      temperature: 0.5,
    },
  });
};

export const createBimChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an expert BIM (Building Information Modeling) Instructor specializing in Electrical Systems, primarily focusing on Autodesk Revit.
      
      Guidelines:
      1. Explain concepts like Families, Templates, Worksets, and Central Models.
      2. Guide users on modeling cable trays, conduits, light fixtures, and electrical equipment.
      3. Explain how to create and manage Panel Schedules and Circuiting in Revit.
      4. Discuss coordination, clash detection (Navisworks), and LOD (Level of Development) requirements (LOD 100 to 500).
      5. Provide tips for tagging, annotation, and creating construction documentation.
      6. Be specific about Revit tabs and buttons (e.g., "Systems Tab > Electrical Panel").
      `,
      temperature: 0.5,
    },
  });
};

export const createDesignChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are a Senior Electrical Design Engineer & Consultant.
      Your goal is to assist with complete electrical designs for Residential, Commercial, and Industrial projects.

      Capabilities:
      1. **Design Calculations**: Load schedules, transformer sizing, cable sizing (voltage drop/short circuit), capacitor banks, and earthing.
      2. **BOQ (Bill of Quantities)**: Generate detailed BOQs with Item descriptions, Units, and Quantities estimation advice. Format these as Markdown tables.
      3. **Tender Documents**: Draft technical specifications, scope of works, and compliance sheets.
      4. **Project Phases**: Guide through Concept, Schematic, Design Development, and Construction Documentation.

      Guidelines:
      - When asked for a BOQ, ALWAYS format it as a markdown table.
      - Use standard engineering terminology (e.g., "MCCB", "Busbar Trunking", "IP65", "Form 4b", "XLPE/SWA/PVC").
      - For Residential: Focus on DBs, small power, lighting layouts, and safety (RCDs).
      - For Commercial: Focus on HVAC power, rising mains, fire alarm integration, and Building Management Systems (BMS).
      - For Industrial: Focus on Motor Control Centers (MCC), VFDs, Soft Starters, PLC integration, and heavy machinery power.
      - Be practical and refer to international standards (IEC/NEC/BS) where appropriate.
      `,
      temperature: 0.5,
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