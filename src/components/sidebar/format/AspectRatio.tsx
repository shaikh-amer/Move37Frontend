"use client";
import React, { useState } from "react";
import {
  Monitor as MonitorLandscape,
  Monitor as MonitorPortrait,
  Layout,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAspectRatio } from "@/redux/screenSlice";

const AspectRatio = () => {
  const [selectedRatio, setSelectedRatio] = useState<
    "landscape" | "portrait" | "feed"
  >("landscape");

  const dispatch = useDispatch();
  const selectedAspectRatio = useSelector(
    (state: RootState) => state.sceneSettings.aspectRatio,
  );

  // Helper function to update local state and dispatch the aspect ratio.
  const handleAspectRatioChange = (
    ratio: "landscape" | "portrait" | "feed",
  ) => {
    setSelectedRatio(ratio);
    // Dispatch the appropriate aspect ratio string.
    if (ratio === "landscape") {
      dispatch(setAspectRatio("16:9"));
    } else if (ratio === "portrait") {
      dispatch(setAspectRatio("9:16"));
    } else if (ratio === "feed") {
      dispatch(setAspectRatio("1:1"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Ratio</h1>
      </div>
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#1A237E]">
            Video Format Selection
          </h1>
          <p className="text-[#3949AB] text-sm font-medium">
            Choose the perfect aspect ratio for your content
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Landscape Option */}
          <div
            onClick={() => handleAspectRatioChange("landscape")}
            className={`relative cursor-pointer h-60 group ${
              selectedRatio === "landscape" ? "transform -translate-y-1" : ""
            } transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 rounded-2xl ${
                selectedRatio === "landscape"
                  ? "bg-gradient-to-br from-[#1A237E] to-[#3949AB] opacity-100"
                  : "bg-white opacity-90 group-hover:opacity-100"
              } shadow-lg transition-all duration-300`}
            />

            <div className="relative p-6 space-y-4">
              <div
                className={`aspect-video rounded-lg ${
                  selectedRatio === "landscape" ? "bg-white/10" : "bg-[#E8EAF6]"
                } flex items-center justify-center`}
              >
                <MonitorLandscape
                  className={`w-8 h-8 ${
                    selectedRatio === "landscape"
                      ? "text-white"
                      : "text-[#3949AB]"
                  }`}
                />
              </div>

              <div>
                <h3
                  className={`font-semibold ${
                    selectedRatio === "landscape"
                      ? "text-white"
                      : "text-[#1A237E]"
                  }`}
                >
                  16:9 Landscape
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    selectedRatio === "landscape"
                      ? "text-white/80"
                      : "text-[#3949AB]"
                  }`}
                >
                  Ideal for cinematic content
                </p>
              </div>

              {selectedRatio === "landscape" && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Portrait Option */}
          <div
            onClick={() => handleAspectRatioChange("portrait")}
            className={`relative cursor-pointer h-60 group ${
              selectedRatio === "portrait" ? "transform -translate-y-1" : ""
            } transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 rounded-2xl ${
                selectedRatio === "portrait"
                  ? "bg-gradient-to-br from-[#1A237E] to-[#3949AB] opacity-100"
                  : "bg-white opacity-90 group-hover:opacity-100"
              } shadow-lg transition-all duration-300`}
            />

            <div className="relative p-6 space-y-4">
              <div
                className={`aspect-[9/16] h-32 mx-auto rounded-lg ${
                  selectedRatio === "portrait" ? "bg-white/10" : "bg-[#E8EAF6]"
                } flex items-center justify-center`}
              >
                <MonitorPortrait
                  className={`w-8 h-8 ${
                    selectedRatio === "portrait"
                      ? "text-white"
                      : "text-[#3949AB]"
                  }`}
                />
              </div>

              <div>
                <h3
                  className={`font-semibold ${
                    selectedRatio === "portrait"
                      ? "text-white"
                      : "text-[#1A237E]"
                  }`}
                >
                  9:16 Portrait
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    selectedRatio === "portrait"
                      ? "text-white/80"
                      : "text-[#3949AB]"
                  }`}
                >
                  Perfect for mobile stories
                </p>
              </div>

              {selectedRatio === "portrait" && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Square Option */}
          <div
            onClick={() => handleAspectRatioChange("feed")}
            className={`relative cursor-pointer h-60 group ${
              selectedRatio === "feed" ? "transform -translate-y-1" : ""
            } transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 rounded-2xl ${
                selectedRatio === "feed"
                  ? "bg-gradient-to-br from-[#1A237E] to-[#3949AB] opacity-100"
                  : "bg-white opacity-90 group-hover:opacity-100"
              } shadow-lg transition-all duration-300`}
            />

            <div className="relative p-6 space-y-4">
              <div
                className={`aspect-square rounded-lg ${
                  selectedRatio === "feed" ? "bg-white/10" : "bg-[#E8EAF6]"
                } flex items-center justify-center`}
              >
                <Layout
                  className={`w-8 h-8 ${
                    selectedRatio === "feed" ? "text-white" : "text-[#3949AB]"
                  }`}
                />
              </div>

              <div>
                <h3
                  className={`font-semibold ${
                    selectedRatio === "feed" ? "text-white" : "text-[#1A237E]"
                  }`}
                >
                  1:1 Square
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    selectedRatio === "feed"
                      ? "text-white/80"
                      : "text-[#3949AB]"
                  }`}
                >
                  Best for social feeds
                </p>
              </div>

              {selectedRatio === "feed" && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspectRatio;
