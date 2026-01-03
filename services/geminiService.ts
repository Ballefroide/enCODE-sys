
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// // Initialize the API client using the environment variable directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing how well the code meets the objective.",
    },
    feedback: {
      type: Type.STRING,
      description: "Constructive feedback on what is wrong or right. Keep it brief and witty.",
    },
    isCorrect: {
      type: Type.BOOLEAN,
      description: "True if the code functionally achieves the goal, even if not perfect.",
    },
  },
  required: ["score", "feedback", "isCorrect"],
};

export interface EvaluationResult {
  score: number;
  feedback: string;
  isCorrect: boolean;
}

export const evaluateCodeSubmission = async (
  objective: string,
  userCode: string,
  language: Language
): Promise<EvaluationResult> => {
  try {
    const prompt = `
      Act as a strict code reviewer for a programming game.
      Language: ${language}
      Objective: ${objective}
      
      User's Code:
      \`\`\`
      ${userCode}
      \`\`\`
      
      Evaluate if the code achieves the visual or logical objective. 
      For HTML/CSS, focus on visual similarity to description.
      For JS/C++/Java, focus on functional correctness and output.
    `;

    // // Using gemini-3-pro-preview for complex coding evaluation tasks.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
      },
    });

    // // response.text is a property, not a method.
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text.trim()) as EvaluationResult;

  } catch (error) {
    console.error("Gemini evaluation failed:", error);
    return {
      score: 0,
      feedback: "Failed to connect to the grading server (AI Error). Please check your connection.",
      isCorrect: false,
    };
  }
};
