"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Scene } from "@/types/types";
import { stripHTML } from "@/utils/stripHtmlToText";
import { setScenes } from "@/redux/screenSlice";
import { setSelectedSceneIndex } from "@/redux/textSlice";
import debounce from "lodash/debounce";
import { useGenerateScenariosMutation } from "@/redux/api";
import ClientOnly from "../ClientOnly";
import { GripIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const SceneTextArea = ({ index, initialText, screens, dispatch }) => {
  const [text, setText] = useState(initialText);

  const debouncedUpdate = useMemo(
    () =>
      debounce((newText: string) => {
        const updatedScreens = [...screens];
        if (!updatedScreens[index]) return;

        updatedScreens[index] = {
          ...updatedScreens[index],
          subtitles: [{ ...updatedScreens[index].subtitles[0], text: newText }],
        };

        dispatch(setScenes(updatedScreens));
      }, 500),
    [screens, index, dispatch]
  );

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    debouncedUpdate(newText);
  };

  return (
    <Textarea
      value={text}
      onChange={handleChange}
      className="w-full mt-2 resize-none"
      rows={3}
    />
  );
};

const StoryText = () => {
  const dispatch = useDispatch();
  const screens = useSelector(
    (state: RootState) =>
      state.sceneSettings?.sceneSettings?.scenesSettings ||
      state.sceneSettings?.sceneSettings ||
      []
  );

  const selectedSceneIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedSceneIndex
  );

  const [generateScenarios] = useGenerateScenariosMutation();

  // Store the index of the dragged item
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === targetIndex) return;

    const updatedScreens = [...screens];
    const [draggedItem] = updatedScreens.splice(draggingIndex, 1);
    updatedScreens.splice(targetIndex, 0, draggedItem);

    dispatch(setScenes(updatedScreens));
    setDraggingIndex(null);
  };

  const handleGenerateScene = async (index: number) => {
    try {
      const sceneText = stripHTML(screens[index]?.subtitles?.[0]?.text || "");
      if (!sceneText) {
        toast.error("Please enter some text for the scene first");
        return;
      }

      const response = await generateScenarios({ input: sceneText });
      
      if (response?.data?.data?.scenesSettings?.[0]) {
        const newScene = response.data.data.scenesSettings[0];
        const updatedScreens = [...screens];
        
        // Preserve existing scene properties while updating with new content
        updatedScreens[index] = {
          ...updatedScreens[index],
          ...newScene,
          subtitles: [
            {
              ...newScene.subtitles[0],
              text: screens[index].subtitles[0].text // Keep original text
            }
          ]
        };

        dispatch(setScenes(updatedScreens));
        toast.success("Scene generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate scene");
      console.error("Scene generation error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <ClientOnly>
        <Flipper flipKey={screens.length}>
          {screens.map((scene: Scene, index: number) => (
            <Flipped key={index} flipId={`scene-${index}`}>
              <li
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => dispatch(setSelectedSceneIndex(index))}
                className={`bg-background shadow-sm rounded-lg p-4 flex items-center gap-4 mb-4 w-full cursor-move border border-muted-foreground/50 transition-all duration-300 hover:bg-muted/20
                ${selectedSceneIndex === index ? "border-black border-4" : ""}
                ${draggingIndex === index ? "opacity-50" : ""}`}
              >
                <div className="flex-shrink-0 text-muted-foreground">
                  <GripIcon className="h-5 w-5 cursor-move" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Scene {index + 1}</p>
                  </div>
                  <SceneTextArea
                    index={index}
                    initialText={stripHTML(scene?.subtitles?.[0]?.text || "")}
                    screens={screens}
                    dispatch={dispatch}
                  />
                </div>
              </li>
            </Flipped>
          ))}
        </Flipper>
      </ClientOnly>
    </div>
  );
};

export default StoryText;
