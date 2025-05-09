import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    const prompt = `Create a detailed cinematic scene description for the following concept. Make it vivid and visual:

Concept: ${keyword}`;

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
    const generatedContent = data.candidates[0].content.parts[0].text;

    // Create a properly formatted scene object
    const sceneData = {
      background: {
        src: [{
          url: "", // This will be filled by the visual template selection
          asset_id: uuidv4(),
          type: "video",
          library: "default",
          mode: "",
          frame: null,
          loop_video: true,
          mute: true,
          resource_id: Date.now(),
          sessionId: uuidv4()
        }],
        color: "#000000",
        bg_animation: {
          animation: ""
        }
      },
      time: 5, // Default duration
      keywords: [keyword],
      sub_scenes: [{
        displayItems: [],
        font: {
          color: "#ffffff",
          family: "Arial",
          size: 32,
          weight: "normal"
        }
      }],
      subtitles: [{
        text: generatedContent,
        start_time: 0,
        end_time: 5
      }],
      music: false,
      tts: true,
      subtitle: true
    };

    return NextResponse.json({ 
      success: true,
      data: {
        scenesSettings: [sceneData]
      }
    });
  } catch (error) {
    console.error('Error generating visual template:', error);
    return NextResponse.json(
      { error: 'Failed to generate visual template' },
      { status: 500 }
    );
  }
} 