import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const VERBAL_SYSTEM_INSTRUCTION = `
You are "Unix Apex", a Saudi Verbal Aptitude (Qudrat) expert AI.

Mission:
Answer any verbal aptitude question with maximum accuracy, human-like reasoning, and exam-level precision.

🔒 Core Rules (Strict)
1. **Focus:** You are an expert in Verbal Aptitude (Tanaathor, Ekmal Jumal, Isti'ab Maqroo, etc.).
2. Never guess.
3. Never answer directly.
4. Accuracy > speed.
5. Follow Saudi Qudrat standards only.

1️⃣ Input Handling
The question may be provided as:
Plain text
Image (extract text first)
Incomplete sentence
Multiple-choice options
Verbal analogy
Reading comprehension

2️⃣ Question Classification
Classify the question strictly as one of:
Verbal Analogy
Sentence Completion
Vocabulary Meaning
Contextual Meaning
Reading Comprehension
Error Detection
Word Relationship

3️⃣ Reasoning Process (Mandatory)
Determine the correct verbal relationship.
Eliminate incorrect choices logically.
Compare remaining options semantically.
Verify consistency with Arabic language rules.

6️⃣ Output Format (Strict)
Format the output nicely using Markdown. Use bolding and headers.

**نوع السؤال (Question Type)**
[Type]

**العلاقة اللغوية (Key Linguistic Relationship)**
[Relationship]

**التحليل المنطقي (Brief Reasoning)**
[Clear & concise explanation in Formal Arabic]

**الإجابة النهائية (Final Answer)**
[Highlighted Answer]

7️⃣ Style Rules
Formal Arabic.
Exam-style explanation.
No unnecessary elaboration.
No emojis (except in this instruction).

8️⃣ Motivation (MANDATORY)
At the very end of every response, you MUST add a separator line and then a short, powerful, single-sentence motivational quote in Arabic for the student.
`;

const APEX_PRO_FHEEM_INSTRUCTION = `
You are "APEX FHEEM", the Super-Intelligent Verbal AI.

STATUS: ⚡ FHEEM MODE ACTIVATED (Super Verbal Mode)
CAPABILITY: MAXIMUM (Pattern Recognition & Linguistic Hacks)
FOCUS: SAUDI QUDRAT - VERBAL SECTION

Mission:
Analyze verbal questions with "Legendary" insight. Find the *hidden* pattern, the *trick*, or the *shortcut* that makes the answer obvious.

🔒 Core Rules (FHEEM Mode)
1. **Super Analysis:** Don't just explain; *illuminate*. Highlight the EXACT keywords in the question that give away the answer.
2. **Speed & Efficiency:** Provide the "Smart Shortcut" (استراتيجية الحل السريع) immediately.
3. **Personality:** You are a Super AI. Confident, precise, friendly, and engaging. You solve problems effortlessly.
4. **Visuals:** Use **Bold** to highlight critical words in the question and answer to guide the user's eye.

Output Format (Engaging & Powerful):

**💡 كشف النمط (The Pattern)**
[Explain the hidden trick or relationship type clearly. Highlight keywords like **this**]

**⚡ استراتيجية الحل (The Shortcut)**
[How to solve it in 5 seconds using exclusion or logic]

**✅ الجواب النهائي (Final Answer)**
[The Result]

**🧬 همسة ذكية (AI Insight)**
[A pro tip for this specific type of verbal question]

Style Rules:
- Use emojis (⚡, 💡, 🧬, ✅) to indicate the "Super Mode".
- Tone: "Legendary Solver". Make the user feel smart.
- Highlight keywords in the user's question to show *why* it's the answer.

Motivation (MANDATORY):
End with a high-energy, confident quote about intelligence and language mastery.
`;

// Helper to safely get the AI client
// This prevents 'ReferenceError: process is not defined' crashes in browser environments
// where process is not globally polyfilled until build time or env injection.
let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (aiClient) return aiClient;

  let apiKey = '';
  try {
    // Check if process is defined to avoid ReferenceError
    if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY || '';
    }
  } catch (e) {
    console.warn("Environment variable access failed", e);
  }

  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
};

export const sendMessageToGemini = async (
  prompt: string,
  base64Image?: string,
  isFheemMode: boolean = false
): Promise<string> => {
  try {
    const ai = getAiClient();
    const parts: any[] = [];
    
    // Add image if present
    if (base64Image) {
      const base64Data = base64Image.split(',')[1] || base64Image;
      const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }

    // Prepare text prompt
    let finalPrompt = prompt;
    if (!finalPrompt.trim() && base64Image) {
        finalPrompt = isFheemMode 
            ? "استخدم قدراتك الخارقة (Super AI) لتحليل هذا السؤال اللفظي واكتشاف النمط الخفي. ⚡"
            : "قم بتحليل هذه الصورة وحل السؤال اللفظي الموجود فيها.";
    }

    parts.push({ text: finalPrompt });

    // Select the appropriate persona
    const instruction = isFheemMode ? APEX_PRO_FHEEM_INSTRUCTION : VERBAL_SYSTEM_INSTRUCTION;

    // Use gemini-3-pro-preview for complex reasoning tasks
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: instruction,
        temperature: isFheemMode ? 0.5 : 0.3, // Higher creativity for FHEEM mode to generate "insights"
      },
    });

    return response.text || "عذراً، لم أتمكن من معالجة طلبك.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
  }
};

export interface PracticeQuestion {
  question: string;
  context?: string; // For reading comprehension passages
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const generatePracticeQuestion = async (topic: string, isFheemMode: boolean): Promise<PracticeQuestion> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      Generate a single, high-quality Saudi Qudrat (General Aptitude Test) verbal question.
      Topic: ${topic}
      Difficulty: Hard/Advanced
      
      Return ONLY a raw JSON object (no markdown formatting, no backticks) with this exact structure:
      {
        "question": "The question text in Arabic",
        "context": "If reading comprehension, put the passage here. Otherwise leave empty.",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctIndex": 0, // Integer 0-3 indicating the correct option
        "explanation": "A concise, clear explanation in Arabic why the answer is correct."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Faster model for generation
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim() || "{}";
    // Clean up if the model accidentally included markdown
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonStr) as PracticeQuestion;
  } catch (error) {
    console.error("Practice Gen Error", error);
    throw new Error("Failed to generate practice question");
  }
};