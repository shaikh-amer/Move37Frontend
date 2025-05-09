import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setToggleSubtitle } from "@/redux/screenSlice";
import { FaRegClosedCaptioning } from "react-icons/fa6";
import { MdClosedCaptionDisabled } from "react-icons/md";

const SubtitleToggle = () => {
  const dispatch = useDispatch();

  const sceneIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedSceneIndex,
  );

  // Get subtitle toggle state from Redux
  const toggleSubtitle = useSelector(
    (state: RootState) => state.sceneSettings.subtitleToggle,
  );

  const handleToggle = (checked: boolean) => {
    dispatch(setToggleSubtitle({ sceneIndex, subtitleToggle: checked }));
  };

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* <Switch
              id="subtitle-toggle"
              checked={toggleSubtitle}
              onCheckedChange={handleToggle}
              className={toggleSubtitle ? "bg-black" : "bg-gray-300"}
            /> */}

            <button
              id="subtitle-toggle"
              onClick={() => handleToggle(!toggleSubtitle)}
            >
              {toggleSubtitle ? (
                <MdClosedCaptionDisabled className="text-red-500 w-5 h-5" />
              ) : (
                <FaRegClosedCaptioning className="text-green-500 w-5 h-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Subtitle ({toggleSubtitle ? "Off" : "On"})</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SubtitleToggle;
