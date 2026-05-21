import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.length < 5) {
      return NextResponse.json(
        { error: 'Please provide a valid prompt with at least 5 characters.' },
        { status: 400 }
      );
    }

    // Count words in the prompt to scale response length dynamically
    const wordCount = prompt.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    let lengthInstruction = "";
    if (wordCount <= 4) {
      lengthInstruction = "The user has provided an extremely short input (1-4 words). Keep the generated endorsement extremely brief, punchy, and natural, consisting of exactly 2 lines of text (approx 2 sentences, maximum 25 words). Do NOT generate a long paragraph under any circumstances.";
    } else if (wordCount <= 10) {
      lengthInstruction = "The user has provided a short input (5-10 words). Keep the generated endorsement exactly 3 lines of text (approx 3 sentences, maximum 45 words).";
    } else {
      lengthInstruction = "The user has provided detailed thoughts. Expand them into a comprehensive professional endorsement of exactly 4 to 6 lines of text (approx 4-6 sentences, maximum 85 words).";
    }

    const systemInstruction = `You are an AI assistant helping a user write a professional endorsement for Saqlein. The user has provided some rough thoughts.
${lengthInstruction}

CRITICAL RULES:
1. Refer to him ONLY as 'Saqlein'. Do NOT under any circumstances use his full name 'Saqlein Shaikh' or 'Mr. Shaikh'. Always use 'Saqlein' only.
2. Ground your response strictly in the user's specific thoughts, adjectives, and concepts. Completely avoid using pre-written templates or corporate boilerplate (like starting with 'I highly recommend...' or 'I had the pleasure of...'). Make sure the output is highly personalized, direct, and directly incorporates the meaning of the words they typed.
3. Keep the tone genuine, positive, direct, and professional.
4. Do NOT include placeholders like [Your Name], [Company Name], or salutations/sign-offs. Just output the review text itself.`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let text = "";
    let success = false;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gemini API] Attempting generation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction,
          generationConfig: {
            temperature: 0.95, // Higher temperature for creativity and variety
          }
        });

        const result = await model.generateContent(`User's initial thoughts: ${prompt}`);
        const response = result.response;
        const generatedText = response.text();
        if (generatedText && generatedText.trim().length > 0) {
          text = generatedText;
          success = true;
          console.log(`[Gemini API] Generation successful with model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Gemini API] Failed with model ${modelName}:`, err?.message || err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("All generative models failed to respond.");
    }

    return NextResponse.json({ generatedText: text.trim() });
  } catch (error: any) {
    console.error('Error generating AI endorsement:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI endorsement. ' + (error.message || '') },
      { status: 500 }
    );
  }
}
