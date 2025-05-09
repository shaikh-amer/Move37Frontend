"use client";
import React, { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactPlayer from "react-player";
import { usePreviewSceneMutation } from "@/redux/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setScenes } from "@/redux/screenSlice";
import { LoadingPopup } from "../common/LoadingPopup";
import { VideoDialog } from "../video/VideoDialog";
import type { Scene } from "@/types/types";
import { RootState } from "@/redux/store";
import PreviewScene from "./PreviewScene";

interface SceneSliderProps {
  selectedSceneIndex: number;
  onSelectScene: (scene: Scene) => void;
}

const SceneSlider: React.FC<SceneSliderProps> = ({
  selectedSceneIndex,
  onSelectScene,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreviewMutation, { isLoading: loader }] =
    usePreviewSceneMutation();
  const dispatch = useDispatch();

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

  const stripHTML = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleVideoUrlChange = useCallback(
    (index: number, newUrl: Scene) => {
      const newScreens = [...screens];
      if (!newScreens[index]) return;

      const oldScreen = newScreens[index];

      // Create a new scene object merging the newUrl properties with the old sub_scenes and subtitles.
      const updatedScene = {
        ...newUrl,
        sub_scenes: oldScreen?.sub_scenes,
        subtitles: oldScreen?.subtitles,
      };

      newScreens[index] = updatedScene;
      dispatch(setScenes(newScreens));

      // If this is the currently selected scene, update it
      if (index === selectedSceneIndex) {
        onSelectScene(updatedScene);
      }
    },
    [screens, selectedSceneIndex, dispatch, onSelectScene],
  );

  // Scroll controls
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
    setIsDragging(true);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;

    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newScreens = [...screens];
      const draggedItemContent = newScreens[dragItem.current];
      newScreens.splice(dragItem.current, 1);
      newScreens.splice(dragOverItem.current, 0, draggedItemContent);
      dragItem.current = dragOverItem.current;
      dragOverItem.current = null;

      dispatch(setScenes(newScreens));
    }
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
  };

  const handleTextChange = useCallback(
    (index: number, newText: string) => {
      const newScreens = [...screens];
      if (!newScreens[index]) return;

      newScreens[index] = {
        ...newScreens[index],
        subtitles: [{ ...newScreens[index].subtitles[0], text: newText }],
      };

      dispatch(setScenes(newScreens));
    },
    [screens, dispatch],
  );

  const handlePreview = async () => {
    if (!selectedScene) return;

    try {
      const response = await videoPreviewMutation({
        text: selectedScene.subtitles[0]?.text,
      });

      if (!response.data) {
        toast.error("Failed to generate script");
        return;
      }

      const newSceneData = response?.data?.data?.scenesSettings[0];
      const selectedIndex = screens.findIndex(
        (scene: Scene) =>
          scene?.background?.src?.[0]?.asset_id ===
          selectedScene?.background?.src?.[0]?.asset_id,
      );

      if (selectedIndex === -1) return;

      const updatedScreens = [...screens];
      updatedScreens[selectedIndex] = newSceneData;

      dispatch(setScenes(updatedScreens));
      onSelectScene(newSceneData);

      toast.success("Scene preview generated successfully!");
    } catch (error) {
      toast.error("Failed to generate preview");
    }
  };

  if (loader) {
    return <LoadingPopup isLoading={loader} />;
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-lg p-2 w-11/12 mx-auto">
      <div className="flex space-x-3 overflow-x-auto px-2">
        <span className="text-gray-800 font-semibold text-lg">
          Scene Timeline
        </span>

        <div className="ml-auto flex gap-2">
          {/* {selectedScene && (
            <Button
              onClick={handlePreview}
              variant="outline"
            >
              <Play className="w-4 h-4" />
              Preview
            </Button>
          )} */}
          <PreviewScene />
          <VideoDialog screens={screens} />
        </div>
      </div>

      <div className="relative group">
        <Button
          variant="ghost"
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex gap-3 p-2 overflow-x-auto [&::-webkit-scrollbar]:h-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500  "
          >
            {screens.map((scene: Scene, index: number) => (
              <div
                key={index}
                onClick={() => onSelectScene(scene)}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                className={`
                  relative flex-shrink-0 
                  rounded-lg overflow-hidden 
                  duration-200 ease-out
                  border border-gray-200 shadow-sm hover:scale-105 transition-all
                  ${isDragging && dragItem.current === index ? "scale-95 opacity-50" : ""}
                  ${
                    selectedScene?.background?.src?.[0]?.asset_id ===
                    scene?.background?.src?.[0]?.asset_id
                      ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#1c1c1f]"
                      : "hover:ring-2 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-[#1c1c1f]"
                  }
                `}
                style={{ width: "120px" }}
              >
                <div className="relative aspect-video w-full bg-gray-900/50">
                  {scene?.background?.src?.[0]?.type === "video" ? (
                    <ReactPlayer
                      url={scene?.background?.src?.[0]?.url || ""}
                      className="!absolute top-0 left-0"
                      width="100%"
                      height="100%"
                      loop
                      muted
                      playing={!isDragging}
                    />
                  ) : (
                    <img
                      src={scene?.background?.src?.[0]?.url || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded-full text-xs text-gray-300 backdrop-blur-sm">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SceneSlider;
