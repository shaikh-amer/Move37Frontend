"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGenerateScenariosMutation,
  useScriptGeneratorMutation,
  useVideoGeneratorMutation,
} from "@/redux/api";
import Cookies from "js-cookie";
import { LoadingPopup } from "../../common/LoadingPopup";
import { useDispatch, useSelector } from "react-redux";
import { setData, setScenes } from "@/redux/screenSlice";
import { InputForm } from "../../common/InputForm";
import { ScriptDisplay } from "./ScriptDisplay";
import {
  Sparkles,
  Video,
  Wand2,
  Play,
  Brain,
  FileText,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { MovingBackground } from "../../common/MovingBackground";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../ui/card";
import { mergeTextLines } from "@/lib/MergeTextLines";

interface Scene {
  id: string;
  content: string;
  order: number;
}

export function ScriptVideoGenerator() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [state, setState] = useState({
    generatedScript: "",
  });

  const [error, setError] = useState<string | null>(null);

  const [scriptMutation, { isLoading }] = useScriptGeneratorMutation();
  const [videoPreviewMutation, { isLoading: loader }] =
    useVideoGeneratorMutation();
  const [scenarioGenerator, { isLoading: loads }] =
    useGenerateScenariosMutation();

  const generateScript = async (input: string) => {
    try {
      // First, generate the script using the input
      const scriptResponse = await scriptMutation({ input });
      
      if (scriptResponse?.data?.success) {
        const { scenes } = scriptResponse.data.data;
        
        // Format scenes for the scene editor
        const formattedScenes = scenes.map((scene: Scene) => ({
          background: {
            src: [{
              url: "", // Will be filled by visual template
              asset_id: scene.id,
              type: "video",
              library: "default",
              mode: "",
              frame: null,
              loop_video: true,
              mute: true,
              resource_id: Date.now(),
              sessionId: scene.id
            }],
            color: "#000000",
            bg_animation: { animation: "" }
          },
          time: 5,
          keywords: [scene.content.split(' ').slice(0, 3).join(' ')], // First 3 words as keywords
          sub_scenes: [{
            id: `sub-${scene.id}`,
            displayItems: [],
            font: {
              color: "#ffffff",
              family: "Arial",
              size: 32,
              weight: "normal"
            }
          }],
          subtitles: [{
            text: scene.content,
            start_time: 0,
            end_time: 5
          }],
          music: false,
          tts: true,
          subtitle: true,
          order: scene.order
        }));

        // Update state and Redux store
        setState({ generatedScript: scenes.map((s: Scene) => s.content).join('\n\n') });
        
        // Store in Redux
        dispatch(setScenes({
          scenesSettings: formattedScenes,
          audioSettings: {
            backgroundVolume: 50,
            voiceVolume: 100
          }
        }));

        // Store in localStorage for persistence
        localStorage.setItem("sceneSettings", JSON.stringify(formattedScenes));
        toast.success("Script generated successfully!");
      } else {
        throw new Error("Failed to generate script");
      }
    } catch (error) {
      console.error('Script generation error:', error);
      setError("Failed to generate script");
      toast.error("Failed to generate script");
    }
  };

  const handleGenerateVideo = async () => {
    try {
      const response = await videoPreviewMutation({
        expandedScript: state.generatedScript,
      });

      const sceneData = response.data?.data;
      const scenesSettings = await mergeTextLines(
        response?.data?.data?.scenesSettings || [],
      );

      // Create a new object using the spread operator
      const updatedSceneData = {
        ...sceneData,
        scenesSettings: scenesSettings,
      };

      if (updatedSceneData) {
        dispatch(setScenes(updatedSceneData));
        dispatch(setData(updatedSceneData));
        toast.success("Video generated!");
        router.push("/scene-editor");
      }
    } catch (error) {
      setError("Video generation failed");
    }
  };

  if (loader) {
    return <LoadingPopup isLoading={loader} />;
  }

  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black min-h-screen">
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Left Column - Welcome Section */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-0 flex items-center justify-center lg:h-screen">
          <div className="h-full p-4 md:p-6 lg:p-8 flex flex-col justify-center items-center relative">
            <MovingBackground />
            <div className="relative z-10  space-y-6 lg:space-y-8 w-full max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-4 lg:space-y-6"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Welcome to Move37 Productions
                </h1>
                <p className="text-lg md:text-xl dark:text-gray-300 text-gray-800 max-w-xl mx-auto px-4">
                  Transform your ideas into captivating videos with our
                  AI-powered content generator.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8 lg:mt-12 px-4"
              >
                <Card className="dark:bg-white/10 border-none  p-4 lg:p-6">
                  <CardContent className="space-y-2 flex flex-col items-center text-center p-0">
                    <Brain className="w-8 h-8 lg:w-12 lg:h-12 text-purple-400" />
                    <h3 className="text-base lg:text-lg font-semibold">
                      AI-Powered Scripts
                    </h3>
                    <p className="text-xs lg:text-sm dark:text-gray-300 text-gray-800">
                      Generate professional scripts with advanced AI technology
                    </p>
                  </CardContent>
                </Card>
                <Card className="dark:bg-white/10 border-none  p-4 lg:p-6">
                  <CardContent className="space-y-2 flex flex-col items-center text-center p-0">
                    <Play className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                    <h3 className="text-base lg:text-lg font-semibold">
                      Instant Preview
                    </h3>
                    <p className="text-xs lg:text-sm dark:text-gray-300 text-gray-800">
                      Preview your video scenes in real-time
                    </p>
                  </CardContent>
                </Card>
                <Card className="dark:bg-white/10 border-none  p-4 lg:p-6">
                  <CardContent className="space-y-2 flex flex-col items-center text-center p-0">
                    <Video className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                    <h3 className="text-base lg:text-lg font-semibold">
                      Scene Editor
                    </h3>
                    <p className="text-xs lg:text-sm dark:text-gray-300 text-gray-800">
                      Fine-tune your video with our powerful scene editing tools
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-center mt-6 lg:mt-8 px-4"
              >
                <p className="text-xs lg:text-sm text-gray-400">
                  Create, preview, and perfect your videos in one seamless
                  workflow
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Column - Functional Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="max-w-xl mx-auto p-4 md:p-6 lg:p-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${state.generatedScript ? "lg:pt-16" : ""}`}
            >
              <div className="flex items-center justify-center gap-3 lg:gap-4 mb-6">
                <Wand2 className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
                  Create Your Video
                </h2>
              </div>

              <div className="relative">
                <InputForm
                  onGenerateScript={generateScript}
                  isLoading={isLoading}
                />

                {!state.generatedScript && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute -bottom-8 lg:-bottom-12 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="text-gray-400 flex items-center gap-2">
                      <span className="animate-bounce">↓</span>
                      <span className="text-xs lg:text-sm">
                        Your script will appear below
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {state.generatedScript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 lg:mt-16"
              >
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 h-px w-full my-2" />

                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 dark:text-purple-400" />
                    Generated Content
                  </h3>
                </div>

                <ScriptDisplay
                  script={state.generatedScript}
                  onGenerateVideo={handleGenerateVideo}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-3 lg:p-4 text-red-500 bg-red-50 rounded-lg shadow-sm border border-red-100"
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                  <h2 className="font-semibold text-sm lg:text-base">
                    Oops! Something went wrong
                  </h2>
                </div>
                <p className="text-xs lg:text-sm mt-1 text-red-600/80">
                  {error}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
