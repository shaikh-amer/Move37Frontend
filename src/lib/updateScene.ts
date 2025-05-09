import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setScenes } from "@/redux/screenSlice";
import {
  setSelectedSceneIndex,
  setSelectedScreen,
  setSelectedTextIndex,
} from "@/redux/textSlice";
import { RootState } from "@/redux/store";
import { Scene } from "@/types/types";

export const useUpdateScene = () => {
  const dispatch = useDispatch();

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
    (newUrl: any) => {
      const newScreens = [...screens];
      if (!newScreens[selectedSceneIndex]) return;

      const oldScreen = newScreens[selectedSceneIndex];

      const updatedScene = {
        ...newUrl,
        sub_scenes: oldScreen?.sub_scenes,
        subtitles: oldScreen?.subtitles,
      };

      newScreens[selectedSceneIndex] = updatedScene;
      dispatch(setScenes(newScreens));

      if (selectedSceneIndex === selectedSceneIndex) {
        dispatch(setSelectedScreen(screens[selectedSceneIndex]));
        dispatch(setSelectedTextIndex(null));
        dispatch(setSelectedSceneIndex(selectedSceneIndex));
      }
    },
    [screens, selectedSceneIndex, dispatch],
  );

  return handleVideoUrlChange;
};
