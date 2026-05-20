import fs from 'fs';

async function listModels() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (!apiKeyMatch) {
    console.log("No GEMINI_API_KEY found in .env.local");
    return;
  }
  let apiKey = apiKeyMatch[1].trim();
  apiKey = apiKey.replace(/^["']|["']$/g, ''); // Remove quotes if any

  console.log("Fetching models with API Key starting with:", apiKey.substring(0, 5) + "...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      console.log("Available models:");
      data.models.forEach((m) => console.log(m.name));
    } else {
      console.log("Error fetching models. Response:", data);
    }
  } catch(e) {
    console.error("Fetch error:", e);
  }
}

listModels();
