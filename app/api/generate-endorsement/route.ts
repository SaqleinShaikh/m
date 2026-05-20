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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemInstruction = "You are an AI assistant helping a user write a professional endorsement for Saqlein Shaikh. The user has provided some rough, short thoughts. Expand those thoughts into a polished, well-written, professional endorsement (around 3 to 4 sentences). Keep the tone genuine, positive, and direct. Do NOT include placeholders like [Your Name]. Just write the review text. Make sure it highlights their experience working with Saqlein.";

    const result = await model.generateContent(`${systemInstruction}\n\nUser's initial thoughts: ${prompt}`);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ generatedText: text.trim() });
  } catch (error: any) {
    console.error('Error generating AI endorsement:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI endorsement. ' + (error.message || '') },
      { status: 500 }
    );
  }
}
