"use client";
import { useState, useEffect } from "react";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";

interface SavingPopupProps {
  isLoading: boolean;
}

export function SavingPopup({ isLoading }: SavingPopupProps) {
  const [preprocessingProgress, setPreprocessingProgress] = useState(0);
  const [renderingProgress, setRenderingProgress] = useState(0);
  const [currentPreprocessingStep, setCurrentPreprocessingStep] = useState(1);
  const [currentRenderingStep, setCurrentRenderingStep] = useState(0);
  const [showRendering, setShowRendering] = useState(false);

  const preprocessingSteps = [
    "Preprocessing scenes...",
    "Processing audio...",
    "Optimizing assets...",
    "Applying effects...",
    "Finalizing composition...",
  ];

  const renderingSteps = [
    "Initializing render...",
    "Generating frames...",
    "Encoding video...",
    "Finalizing export...",
  ];

  useEffect(() => {
    if (isLoading) {
      let startTime = Date.now();
      const totalPreprocessingTime = 30000; // 30 seconds

      // Preprocessing progress
      const preprocessingInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(
          (elapsedTime / totalPreprocessingTime) * 100,
          100,
        );

        setPreprocessingProgress(progress);
        setCurrentPreprocessingStep(
          Math.floor((progress / 100) * preprocessingSteps.length),
        );

        if (progress >= 100) {
          clearInterval(preprocessingInterval);
          setShowRendering(true);
          startTime = Date.now(); // Reset start time for rendering phase
        }
      }, 50); // Update more frequently for smoother animation

      // Rendering progress
      const renderingInterval = setInterval(() => {
        if (!showRendering) return;

        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(
          (elapsedTime / totalPreprocessingTime) * 95,
          95,
        );

        setRenderingProgress(progress);
        setCurrentRenderingStep(
          Math.floor((progress / 95) * renderingSteps.length),
        );
      }, 50);

      return () => {
        clearInterval(preprocessingInterval);
        clearInterval(renderingInterval);
      };
    } else {
      // Reset states when loading is complete
      setPreprocessingProgress(0);
      setRenderingProgress(0);
      setShowRendering(false);
      setCurrentPreprocessingStep(0);
      setCurrentRenderingStep(0);
    }
  }, [isLoading, showRendering]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
          Preparing your video for download
        </h2>

        {/* Preprocessing Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step 1:{" "}
              {preprocessingSteps[currentPreprocessingStep] ||
                preprocessingSteps[preprocessingSteps.length - 1]}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(preprocessingProgress)}%
            </span>
          </div>
          <Progress
            value={preprocessingProgress}
            className="h-2 transition-all duration-300 ease-out"
          />
        </div>

        {/* Rendering Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step 2:{" "}
              {showRendering
                ? renderingSteps[currentRenderingStep] ||
                  renderingSteps[renderingSteps.length - 1]
                : "Generate video"}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {showRendering ? `${Math.round(renderingProgress)}%` : "0%"}
            </span>
          </div>
          <Progress
            value={showRendering ? renderingProgress : 0}
            className="h-2 transition-all duration-300 ease-out"
          />
        </div>
      </div>
    </div>
  );
}
