import { GoogleGenAI, ThinkingLevel, Modality } from "@google/genai";

export interface ChatResponse {
  text: string;
  error?: string;
}

export async function sendChatMessage(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  useThinking: boolean = false
): Promise<ChatResponse> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelName = "gemini-3.1-pro-preview";
    
    const config: any = {
      systemInstruction: "You are the AI assistant for the 'Listening Project' app. Your goal is to help users understand the app, which is designed to improve active listening and communication skills. Be helpful, concise, and friendly. If the user asks complex questions about communication theory or psychology, use your deep reasoning capabilities.",
    };

    if (useThinking) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    const chat = ai.chats.create({
      model: modelName,
      config,
      history,
    });

    const result = await chat.sendMessage({ message });
    return { text: result.text || "I'm sorry, I couldn't generate a response." };
  } catch (error: any) {
    console.error("Chat error:", error);
    return { text: "", error: error.message || "An error occurred." };
  }
}

export async function generateSpeech(text: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS error:", error);
    return null;
  }
}
