// api/proxy.js
import { GoogleGenAI, Modality } from "@google/genai";

export default async function handler(req, res) {
  // 设置 CORS 头，允许前端访问
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 检查 API Key
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API_KEY missing" });
  }

  try {
    const { type, text, voice } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    // === 场景 A: 语音合成 (TTS) ===
    if (type === 'tts') {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
            },
          },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return res.status(200).json({ audio: audioData });
    }

    // === 场景 B: 单词解释 (Explain) ===
    if (type === 'explain') {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Explain the meaning of "${text}" simply in English under 40 words.`,
        });
        return res.status(200).json({ text: response.text });
    }

    return res.status(400).json({ error: "Invalid request type" });

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
