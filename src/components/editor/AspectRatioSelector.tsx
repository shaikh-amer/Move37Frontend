import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAspectRatio } from "@/redux/screenSlice";
import type { RootState } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Smartphone, Square } from "lucide-react";

const AspectRatioSelector: React.FC = () => {
  const dispatch = useDispatch();
  const selectedAspectRatio = useSelector(
    (state: RootState) => state.sceneSettings.aspectRatio,
  );

  const handleAspectRatioChange = (aspectRatio: string) => {
    dispatch(setAspectRatio(aspectRatio));
  };

  return (
    <div className="p-4">
      <Select
        value={selectedAspectRatio}
        onValueChange={handleAspectRatioChange}
      >
        <SelectTrigger className="w-[180px] bg-white text-black hover:bg-gray-200">
          <SelectValue placeholder="Select aspect ratio" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="16:9"
            className="flex items-center gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
          >
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-blue-500" />
              <span className="font-medium">16:9 (Landscape)</span>
            </div>
          </SelectItem>
          <SelectItem
            value="9:16"
            className="flex items-center gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-pink-500" />
              <span className="font-medium">9:16 (Portrait)</span>
            </div>
          </SelectItem>
          <SelectItem
            value="1:1"
            className="flex items-center gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50"
          >
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-green-500" />
              <span className="font-medium">1:1 (Square)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AspectRatioSelector;
