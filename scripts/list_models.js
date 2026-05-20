import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  // The SDK doesn't have a direct listModels sometimes accessible without REST, let's just make a REST call to v1beta 
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  if (data.models) {
    console.log("Available models:");
    data.models.forEach((m) => console.log(m.name));
  } else {
    console.log("Error fetching models:", data);
  }
}

listModels();
