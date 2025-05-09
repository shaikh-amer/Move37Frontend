import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setVolume } from "@/redux/screenSlice"; // update with your actual path
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RootState } from "@/redux/store";

const VolumeBar = () => {
  const dispatch = useDispatch();
  const volume = useSelector(
    (state: RootState) => state.sceneSettings.audioSettings?.video_volume,
  );

  const sliderValue = ((volume + 1) / 2) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const newVolume = (val / 100) * 2 - 1;
    dispatch(setVolume(newVolume));
  };

  const getTooltipText = () => {
    if (volume === -1) return "Mute: -1";
    if (volume === 0) return "Normal: 0";
    return `TTS: ${volume.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <input
            id="volume"
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={handleChange}
            className="w-full accent-black cursor-pointer"
          />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
        >
          {getTooltipText()}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default VolumeBar;
