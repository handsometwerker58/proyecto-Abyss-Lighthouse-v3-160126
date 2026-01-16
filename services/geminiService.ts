
import { GoogleGenAI } from "@google/genai";
import { AuditData } from "../types";
import { SYSTEM_PERSONA_INSTRUCTION } from "../constants";

export async function performOversightAudit(data: AuditData) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    INITIATING DATA AUDIT FOR OPERATOR.
    TARGET LOCKED: ${data.target}
    
    7-DAY HARD DATA:
    ${data.sevenDayData.map(d => `Day ${d.day}: Hours Worked: ${d.hoursWorked}, Output: ${d.outputUnits}, Sleep: ${d.hoursSlept}, Emotional Interference: ${d.emotionalInterference}%, Meds: ${d.medication ? 'YES' : 'NO'}`).join('\n')}
    
    30-DAY STRUCTURAL INFORMATION:
    ${data.thirtyDayStructural}
    
    EXECUTE EVALUATION PROTOCOL NOW.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PERSONA_INSTRUCTION,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Audit failed:", error);
    throw new Error("COMMUNICATION LINK SEVERED. REBOOTING SYSTEM.");
  }
}
