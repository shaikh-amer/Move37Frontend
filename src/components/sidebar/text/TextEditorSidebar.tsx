import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextEditor from "../../editor/TextEditor";
import {
  updateSceneDisplayFormat,
  updateSceneText,
  updateSceneTextStyle,
} from "@/redux/screenSlice";
import {
  addTextDisplayItem,
  setCurrentText,
  setSelectedTextIndex,
} from "@/redux/textSlice";
import { displayFormat } from "@/lib/displayItem";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hexToRgba } from "@/lib/utils";
const TextEditorSideBar = () => {
  const currentText = useSelector(
    (state: RootState) => state.reduxScene.currentText,
  );

  const dispatch = useDispatch();

  const selectedTextIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedTextIndex,
  );

  const selectedScene = useSelector(
    (state: RootState) => state.reduxScene.selectedScene,
  );

  const selectedSceneIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedSceneIndex,
  );

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
      newDisplayItem.text_lines[0].text = "New Texts";
    }

    dispatch(
      updateSceneDisplayFormat({
        sceneIndex: selectedSceneIndex,
        displayFormat: newDisplayItem,
      }),
    );

    const lastIndex = selectedScene?.sub_scenes?.[0]?.displayItems?.length ?? 0;

    dispatch(setSelectedTextIndex(lastIndex > 0 ? lastIndex - 1 : 0));
  };

  const isHexColor = (color: string) => /^#?[0-9A-Fa-f]{3,6}$/.test(color);

  const handleFormatChange = (format: any) => {
    if (selectedTextIndex !== null) {
      let decoration: string[] = [];
      if (format.bold) decoration.push("decor-bold");
      if (format.italic) decoration.push("decor-italics");
      if (format.underline) decoration.push("decor-underline");
      if (format.strike) decoration.push("decor-linethrough");

      const newStyle = {
        fontColor: isHexColor(format.color)
          ? hexToRgba(format.color)
          : format.color,
        textBackgroundColor: isHexColor(format.background)
          ? hexToRgba(format.background)
          : format.background,
        fontName: format.font || undefined,
        fontSize: format.size ? parseInt(format.size, 10) : undefined,
        decoration: decoration,
      };

      dispatch(
        updateSceneTextStyle({
          sceneIndex: selectedSceneIndex,
          textIndex: selectedTextIndex,
          newStyle,
        }),
      );
    }
  };

  return (
    <div>
      <Button onClick={handleAddText} className="w-full my-2">
        <Plus className="w-5 h-5 text-gray-600" /> Add Text
      </Button>
      {selectedTextIndex !== null && selectedScene && (
        <div className="">
          <TextEditor value={currentText} onFormatChange={handleFormatChange} />
        </div>
      )}
    </div>
  );
};

export default TextEditorSideBar;
