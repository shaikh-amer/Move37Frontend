"use client";
import React from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

interface LoadingPopupProps {
  isLoading: boolean;
}

export const LoadingPopup: React.FC<LoadingPopupProps> = ({ isLoading }) => {
  return (
    <MultiStepLoader
      loadingStates={[
        {
          text: "Setting up environment...",
          title: "Initializing",
          status: "loading",
        },
        {
          text: "Adding scenes to timeline...",
          title: "Adding Scenes",
          status: "loading",
        },
        {
          text: "Generating captions...",
          title: "Adding Captions",
          status: "loading",
        },
        {
          text: "Building preview...",
          title: "Compiling Video Preview",
          status: "loading",
        },
        {
          text: "Processing video effects...",
          title: "Processing",
          status: "loading",
        },
        {
          text: "Almost there...",
          title: "Finalizing",
          status: "loading",
        },
      ]}
      loading={isLoading}
      duration={4000} // 4 seconds per step
      loop={false}
    />
  );
};
