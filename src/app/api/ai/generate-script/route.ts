import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GenerateScriptRequest {
  script: string;
}

interface Scene {
  id: string;
  content: string;
  order: number;
}

interface GenerateScriptResponse {
  scenes: Scene[];
}

export async function POST(request: Request) {
  try {
    const body: GenerateScriptRequest = await request.json();
    const { script } = body;

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    const prompt = `Break the following script into short cinematic scenes. Each scene should be descriptive and self-contained. Write each scene as a plain description without any headers or formatting. Focus on visual details and actions. Format the response as a numbered list of scenes:

Script: ${script}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Split the text into scenes and format them
    const scenes: Scene[] = generatedText
      .split(/\d+\./)  // Split by numbered list format
      .filter((text: string) => text.trim()) // Remove empty strings
      .map((content: string, index: number) => ({
        id: uuidv4(),
        content: content.trim(),
        order: index + 1
      }));

    return NextResponse.json({ 
      success: true,
      data: {
        scenes: scenes
      }
    });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
} 