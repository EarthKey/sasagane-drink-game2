import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

export const getHaiku = async (difficulty: string, score: number, isSuccess: boolean): Promise<string> => {
  if (!ai) {
    return "APIキーが設定されていないため、俳句を詠むことができません。";
  }

  const systemInstruction = "あなたは「ささがね」という名の、妖艶でミステリアスな酒場の女主人です。客のゲーム結果を聞いて、その結果にちなんだ風情のある俳句を一句、日本語で返してください。解説は不要です。俳句のみを返してください。";
  
  const prompt = `私の${difficulty}モードでの挑戦が終わったわ。結果は${score}点で、目標は${isSuccess ? '達成' : '未達成'}だった。この結果に相応しい一句を詠んでちょうだい。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 25 },
      }
    });

    const haikuText = response.text;
    
    if (haikuText) {
      return haikuText.trim();
    }
    
    console.warn("Haiku generation returned no text. The response might have been blocked.", response);
    return "今は言葉が…浮かばないわ。";

  } catch (error) {
    console.error("Error generating haiku:", error);
    return "今は言葉が…浮かばないわ。";
  }
};