"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Mic, Settings, PlayCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaClosedCaptioning } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import SceneSlider from "./ScreenSlider";
import type { Scene } from "@/types/types";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import VideoPlayer from "../video/VideoPlayer";
import TextEditor from "./TextEditor";
import AIVoicesSelector from "../video/VoiceOverSelector";
import { setScenes, updateSceneDisplayFormat } from "@/redux/screenSlice";
import { displayFormat } from "@/lib/displayItem";
import { DraggableText } from "./DraggableText";
import {
  addTextDisplayItem,
  clearCurrentText,
  setCurrentText,
  setSelectedSceneIndex,
  setSelectedScreen,
  setSelectedTextIndex,
} from "@/redux/textSlice";
import AspectRatioSelector from "./AspectRatioSelector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import SubtitleToggle from "../video/SubtitleToggle";
import ClientOnly from "../sidebar/ClientOnly";
import VolumeBar from "./VolumeBar";
import BackgroundVolume from "./BackgroundVolume";

interface SceneEditorProps {
  onSidebarPageChange?: (page: string) => void;
}

const SceneEditor = ({ onSidebarPageChange }: SceneEditorProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // 🔹 Get scenes from Redux store
  const screens = useSelector(
    (state: RootState) =>
      state.sceneSettings?.sceneSettings?.scenesSettings ||
      state.sceneSettings?.sceneSettings ||
      [],
  );

  const selectedScene = useSelector(
    (state: RootState) => state.reduxScene.selectedScene,
  );
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const selectedTextIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedTextIndex,
  );

  const currentText = useSelector(
    (state: RootState) => state.reduxScene.currentText,
  );
  // const [currentText, setCurrentText] = useState<string>("");

  const selectedSceneIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedSceneIndex,
  );

  const audioSettings = useSelector(
    (state: RootState) => state.sceneSettings.data.audioSettings,
  );

  useEffect(() => {
    if (screens[selectedSceneIndex]) {
      dispatch(setSelectedScreen(screens[selectedSceneIndex]));
    }
  }, [screens, selectedSceneIndex]);

  // When a text item is selected, load its text into local state.
  useEffect(() => {
    if (
      selectedTextIndex !== null &&
      selectedScene?.sub_scenes?.[0]?.displayItems?.[selectedTextIndex]
    ) {
      const displayItem =
        selectedScene.sub_scenes[0].displayItems[selectedTextIndex];
      dispatch(setCurrentText(displayItem.text_lines?.[0]?.text || ""));
    }
  }, [selectedTextIndex, selectedScene, dispatch]);

  const handleSceneSelect = (scene: Scene) => {
    const index = screens.indexOf(scene);
    dispatch(setSelectedScreen(screens[selectedSceneIndex]));
    dispatch(setSelectedTextIndex(null));
    dispatch(clearCurrentText());
    dispatch(setSelectedSceneIndex(index));
  };

  const handleDeleteScene = () => {
    if (!selectedScene) return;
    const updatedScreens = screens.filter(
      (scene: Scene) =>
        scene.background.src[0].asset_id !==
        selectedScene.background.src[0].asset_id,
    );

    dispatch(setScenes(updatedScreens));
    if (updatedScreens.length > 0) {
      handleSceneSelect(updatedScreens[0]);
    } else {
      dispatch(setSelectedScreen(null));
      dispatch(setSelectedTextIndex(null));
      setCurrentText("");
    }
  };

  const handleDeleteText = (index: number) => {
    if (!selectedScene) return;
    const updatedScene = {
      ...selectedScene,
      sub_scenes: selectedScene.sub_scenes.map((subScene) => ({
        ...subScene,
        displayItems: subScene.displayItems.filter((_, i) => i !== index),
      })),
    };
    const updatedScreens = screens.map((scene: Scene) =>
      scene.background.src[0].asset_id ===
      selectedScene.background.src[0].asset_id
        ? updatedScene
        : scene,
    );

    dispatch(setScenes(updatedScreens));
    dispatch(setSelectedTextIndex(null));
    dispatch(clearCurrentText());
  };

  // Update the draggable text position with preset "custom".
  const handlePositionChange = (
    index: number,
    newPosition: { x: number; y: number },
  ) => {
    if (!selectedScene || !videoContainerRef.current) return;

    // Get the actual width and height of the video container
    const containerWidth = videoContainerRef.current.offsetWidth;
    const containerHeight = videoContainerRef.current.offsetHeight;

    // Convert draggable UI pixel values into absolute pixels for the final render
    const finalRenderPosition = {
      center_x: Math.round((newPosition.x / containerWidth) * 1920), // Convert relative to 1920
      start_y: Math.round((newPosition.y / containerHeight) * 1080), // Convert relative to 1080
      preset: "custom",
    };

    const updatedScene = {
      ...selectedScene,
      sub_scenes: selectedScene.sub_scenes.map((subScene) => ({
        ...subScene,
        displayItems: subScene.displayItems.map((item, i) =>
          i === index ? { ...item, location: finalRenderPosition } : item,
        ),
      })),
    };

    const updatedScreens = screens.map((scene: Scene) =>
      scene.background.src[0].asset_id ===
      selectedScene.background.src[0].asset_id
        ? updatedScene
        : scene,
    );

    dispatch(setScenes(updatedScreens));
  };

  const handleAddText = () => {
    dispatch(addTextDisplayItem("New Text"));
    const newDisplayItem = JSON.parse(JSON.stringify(displayFormat));

    // Ensure new text starts at a visible location
    newDisplayItem.location = {
      center_x: 960, // Default to center horizontally (1920/2)
      start_y: 540, // Default to center vertically (1080/2)
      preset: "custom",
    };

    if (newDisplayItem.text_lines && newDisplayItem.text_lines.length > 0) {
      newDisplayItem.text_lines[0].text = "New Text";
    }

    dispatch(
      updateSceneDisplayFormat({
        sceneIndex: selectedSceneIndex,
        displayFormat: newDisplayItem,
      }),
    );
    const lastIndex = selectedScene?.sub_scenes?.[0]?.displayItems?.length ?? 0;

    dispatch(setSelectedTextIndex(lastIndex > 0 ? lastIndex - 1 : 0));
    window.dispatchEvent(
      new CustomEvent("changeSidebarPage", { detail: "Text" }),
    );
  };

  const updateSubtitleStyle = (key: string, value: string) => {
    if (!selectedScene) return;

    const updatedScene = { ...selectedScene };
    updatedScene.sub_scenes = updatedScene.sub_scenes.map((subscene) => ({
      ...subscene,
      font: { ...subscene.font, [key]: value }, // ✅ Updating only subtitle font properties
    }));

    dispatch(setSelectedScreen(screens[selectedSceneIndex]));

    const updatedScreens = screens.map((scene: Scene) =>
      scene.background.src[0].asset_id ===
      selectedScene.background.src[0].asset_id
        ? updatedScene
        : scene,
    );

    dispatch(setScenes(updatedScreens)); // ✅ Save changes to Redux store
  };

  const handlePreviewScene = () => {
    const videoElement = document.getElementById(
      "video-player",
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.play(); // 🎬 Start playing the scene video
    }
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play(); // ✅ Ensures play() is called on the <video> element.
    }
  };

  // Update your handleAIVoices function to use the custom event
  const handleAIVoices = () => {
    // Dispatch a custom event to change the sidebar page
    window.dispatchEvent(
      new CustomEvent("changeSidebarPage", { detail: "Audio" }),
    );
  };

  return (
    <ClientOnly
      fallback={
        <div className="h-screen flex justify-center items-center p-4">
          <Loader2 className="animate-spin text-black" />
        </div>
      }
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col bg-gray-100 flex-grow">
          {/* Header Section */}
          <div className="flex justify-between items-center w-full px-4 bg-gray-100">
            {/* Left: Scene Duration */}
            <span className="text-sm font-medium text-gray-700">
              Scene Duration: {selectedScene?.time || "N/A"}s
            </span>

            {/* Center: Aspect Ratio Selector */}
            <AspectRatioSelector />

            {/* Right: Video Duration (Rounded to 2 decimal places) */}
            <span className="text-sm font-medium text-gray-700">
              Video Duration:{" "}
              {screens
                .reduce(
                  (total: number, scene: Scene) => total + (scene.time || 0),
                  0,
                )
                .toFixed(2)}
              s
            </span>
          </div>

          {/* Video Section */}
          <div className="p-2 rounded-t-3xl bg-white flex-grow flex flex-col dark:bg-black">
            <div
              className="aspect-video w-full md:w-8/12 mx-auto relative flex-grow"
              ref={videoContainerRef}
            >
              {selectedScene?.sub_scenes?.[0]?.displayItems?.map(
                (displayItem, index) => {
                  if (displayItem.type !== "text")
                    return <div key={index} className="hidden" />;
                  return (
                    <DraggableText
                      key={index}
                      text={displayItem.text_lines?.[0]?.text}
                      initialPosition={{
                        x:
                          videoContainerRef.current &&
                          displayItem.location?.center_x !== undefined
                            ? (displayItem.location.center_x / 1920) *
                                videoContainerRef.current.offsetWidth -
                              5
                            : 20,
                        y:
                          videoContainerRef.current &&
                          displayItem.location?.start_y !== undefined
                            ? (displayItem.location.start_y / 1080) *
                                videoContainerRef.current.offsetHeight -
                              5
                            : 20,
                      }}
                      containerRef={
                        videoContainerRef as React.RefObject<HTMLDivElement>
                      }
                      onDelete={() => handleDeleteText(index)}
                      onPositionChange={(position) =>
                        handlePositionChange(index, position)
                      }
                      index={index}
                      isSelected={selectedTextIndex === index}
                      styleData={displayItem.font}
                    />
                  );
                },
              )}

              <VideoPlayer
                videoUrl={selectedScene?.background?.src?.[0]?.url || ""}
                backgroundColor={selectedScene?.background?.color || ""}
                displayItems={
                  selectedScene?.sub_scenes?.[0]?.displayItems || []
                }
                scenes={screens}
                audioSettings={audioSettings}
              />
            </div>

            {/* Action Buttons Row - Moved outside the video container for better layout */}
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm w-full max-w-[900px] mx-auto mt-4">
              {/* Scene Number */}
              <span className="text-gray-700 font-medium">
                Scene {selectedSceneIndex + 1}
              </span>

              <div className="flex items-center text-gray-600">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center align-middle">
                        <button
                          className="p-2 hover:text-gray-900"
                          onClick={handlePlayVideo}
                        >
                          <PlayCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Preview Scene</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200 transition group">
                {/* Subtitle Icon Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <FaClosedCaptioning className="w-5 h-5 text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Subtitles Color</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Separate Color Picker (Not inside button) */}
                <input
                  id="subtitle-color-picker"
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={selectedScene?.sub_scenes[0]?.font?.color || "#ffffff"}
                  onChange={(e) => updateSubtitleStyle("color", e.target.value)}
                />
              </div>

              <SubtitleToggle />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleAddText}
                      className="group relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200 transition"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Text</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleDeleteScene}
                      className="group relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Scene</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center align-middle">
                      <button
                        onClick={handleAIVoices}
                        className="group relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200 transition"
                      >
                        <Mic className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Voices</p>
                  </TooltipContent>
                </Tooltip>
                <div className="space-y-2">
                  <VolumeBar />

                  <BackgroundVolume />
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* Scene Slider - Fixed at Bottom */}
          <div className="w-full py-2 bg-white dark:bg-black">
            <SceneSlider
              selectedSceneIndex={selectedSceneIndex}
              onSelectScene={handleSceneSelect}
            />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default SceneEditor;
