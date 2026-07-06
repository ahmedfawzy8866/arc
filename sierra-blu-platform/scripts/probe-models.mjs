import { GoogleGenerativeAI } from "@google/generative-ai";
// Removed dotenv for native --env-file support


const apiKey = process.env.GOOGLE_AI_API_KEY;

async function listModels() {
  if (!apiKey) {
    console.error("❌ No GOOGLE_AI_API_KEY found");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // There is no direct listModels in the JS SDK's main class, 
    // it's usually handled via a different client or by trying common ones.
    // However, we can try to fetch a known one or check the error.
    
    console.log("--- Attempting to find supported models ---");
    const models = ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-pro-latest"];
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        await model.generateContent("test");
        console.log(`✅ Model '${m}' is AVAILABLE`);
      } catch (e) {
        console.log(`❌ Model '${m}' is NOT available (${e.message.split('\n')[0]})`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
