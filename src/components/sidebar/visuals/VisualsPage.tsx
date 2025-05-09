import React, { useCallback, useState } from "react";
import { TemplateViewer } from "./TemplateViewer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Scene } from "@/types/types";
import { setScenes } from "@/redux/screenSlice";
import {
  setSelectedSceneIndex,
  setSelectedScreen,
  setSelectedTextIndex,
} from "@/redux/textSlice";
import CustomFileUpload from "./CustomFileUpload";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const VisualsPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("template"); // 'template' or 'upload'

  const selectedSceneIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedSceneIndex,
  );

  const screens = useSelector(
    (state: RootState) =>
      state.sceneSettings?.sceneSettings?.scenesSettings ||
      state.sceneSettings?.sceneSettings ||
      [],
  );

  const handleVideoUrlChange = useCallback(
    (newUrl: Scene) => {
      const newScreens = [...screens];
      if (!newScreens[selectedSceneIndex]) return;

      const oldScreen = newScreens[selectedSceneIndex];

      // Create a new scene object merging the newUrl properties with the old sub_scenes and subtitles.
      const updatedScene = {
        ...newUrl,
        sub_scenes: oldScreen?.sub_scenes,
        subtitles: oldScreen?.subtitles,
      };

      newScreens[selectedSceneIndex] = updatedScene;
      dispatch(setScenes(newScreens));

      // If this is the currently selected scene, update it
      if (selectedSceneIndex === selectedSceneIndex) {
        dispatch(setSelectedScreen(screens[selectedSceneIndex]));
        dispatch(setSelectedTextIndex(null));
        dispatch(setSelectedSceneIndex(selectedSceneIndex));
      }
    },
    [screens, selectedSceneIndex, dispatch],
  );

  return (
    <div className="mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Visuals</h1>
      </div>

      <div className="mb-6 w-full">
        <Tabs defaultValue="template" className="w-full flex-1">
          <TabsList className="border-b border-gray-400  rounded-none w-full">
            <TabsTrigger value="template">Templates</TabsTrigger>
            <TabsTrigger value="upload">Custom Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="template">
            <TemplateViewer onVideoSelect={handleVideoUrlChange} />
          </TabsContent>
          <TabsContent value="upload">
            <CustomFileUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VisualsPage;
