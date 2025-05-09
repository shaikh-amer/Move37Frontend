import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const REPLICATE_API_TOKEN = 'r8_FYqrzQgAlE44zt5pJgWXEipxboAJeUy2AVrlM';
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const MODEL_VERSION = "69599cebad125acfd3d5c682c187702ea7a84d537603e46b468a44fe94c5fd13";

interface SceneResult {
  success: boolean;
  videoUrl?: string;
  scene: string;
  index: number;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const { expandedScript } = await request.json();

    if (!expandedScript) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    // Split the script into scenes
    const scenes = expandedScript.split('\n\n').filter(Boolean);
    
    // Generate video for each scene
    const sceneResults = await Promise.all(
      scenes.map(async (scene: string, index: number): Promise<SceneResult> => {
        try {
          // Start video generation with Replicate for this scene
          const response = await fetch(REPLICATE_API_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${REPLICATE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              version: MODEL_VERSION,
              input: {
                prompt: scene,
                negative_prompt: "worst quality, inconsistent motion, blurry, jittery, distorted",
                width: 1280,
                height: 720,
                frame_rate: 25,
                num_frames: 121,
                guidance_scale: 3,
                num_inference_steps: 40
              }
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error(`Replicate API error for scene ${index}:`, errorData || response.statusText);
            
            if (response.status === 422 || errorData?.error?.includes('credit')) {
              throw new Error('Insufficient credits in Replicate account. Please add credits to your account to generate videos.');
            } else {
              throw new Error(`Failed to start video generation for scene ${index}: ${errorData?.error || response.statusText}`);
            }
          }

          const prediction = await response.json();
          
          if (!prediction.id) {
            throw new Error(`Invalid prediction response from Replicate for scene ${index}`);
          }

          // Poll for the result
          let result;
          let attempts = 0;
          const maxAttempts = 300; // 5 minutes timeout (increased from 3 minutes)

          while (attempts < maxAttempts) {
            const statusResponse = await fetch(`${REPLICATE_API_URL}/${prediction.id}`, {
              headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (!statusResponse.ok) {
              const errorText = await statusResponse.text();
              console.error(`Status check failed for scene ${index}:`, {
                status: statusResponse.status,
                statusText: statusResponse.statusText,
                errorText: errorText
              });
              throw new Error(`Failed to check prediction status for scene ${index}: ${statusResponse.status} ${statusResponse.statusText}`);
            }

            let status;
            try {
              status = await statusResponse.json();
            } catch (error) {
              console.error(`Failed to parse status response for scene ${index}:`, error);
              throw new Error(`Invalid response format from Replicate API for scene ${index}`);
            }
            
            if (!status || typeof status !== 'object') {
              console.error(`Invalid status response for scene ${index}:`, status);
              throw new Error(`Invalid status response format for scene ${index}`);
            }

            if (status.status === 'succeeded') {
              if (!status.output || typeof status.output !== 'string') {
                throw new Error(`Invalid video output from Replicate for scene ${index}`);
              }
              result = status.output;
              break;
            } else if (status.status === 'failed') {
              throw new Error(`Video generation failed for scene ${index}: ${status.error || 'Unknown error'}`);
            } else if (status.status === 'canceled') {
              throw new Error(`Video generation was canceled for scene ${index}`);
            }
            
            attempts++;
            // Wait for 1 second before polling again
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          if (!result) {
            throw new Error(`Video generation timed out for scene ${index}`);
          }

          return {
            success: true,
            videoUrl: result,
            scene: scene,
            index: index
          };
        } catch (error) {
          console.error(`Error generating video for scene ${index}:`, error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate video',
            scene: scene,
            index: index
          };
        }
      })
    );

    // Check if any scenes failed to generate
    const failedScenes = sceneResults.filter(result => !result.success);
    if (failedScenes.length > 0) {
      console.error('Failed scenes:', failedScenes);
      return NextResponse.json(
        { 
          error: 'Some scenes failed to generate',
          failedScenes: failedScenes.map(f => ({ index: f.index, error: f.error }))
        },
        { status: 500 }
      );
    }

    // Format scenes for the scene editor with the generated videos
    const formattedScenes = sceneResults.map((result) => ({
      background: {
        src: [{
          url: result.videoUrl,
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
        bg_animation: { animation: "" }
      },
      time: 5,
      keywords: [result.scene.split(' ').slice(0, 3).join(' ')],
      sub_scenes: [{
        id: `sub-${uuidv4()}`,
        displayItems: [],
        font: {
          color: "#ffffff",
          family: "Arial",
          size: 32,
          weight: "normal"
        }
      }],
      subtitles: [{
        text: result.scene,
        start_time: 0,
        end_time: 5
      }],
      music: false,
      tts: true,
      subtitle: true,
      order: result.index + 1
    }));

    return NextResponse.json({
      success: true,
      data: {
        scenesSettings: formattedScenes,
        audioSettings: {
          backgroundVolume: 50,
          voiceVolume: 100
        }
      }
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video' },
      { status: 500 }
    );
  }
} 