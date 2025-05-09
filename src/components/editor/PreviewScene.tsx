"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useChangeVoiceOverMutation } from "@/redux/api";
import { useDispatch } from "react-redux";
import { setAudioSettings } from "@/redux/screenSlice";

const PreviewScene: React.FC = () => {
  const [changeVoice, { isLoading }] = useChangeVoiceOverMutation();
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const initialSettingsRef = useRef<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("sceneSettings");
    initialSettingsRef.current = stored;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem("sceneSettings");
      if (current !== initialSettingsRef.current) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePreview = async () => {
    const stored = localStorage.getItem("sceneSettings");
    const speaker = JSON.parse(localStorage.getItem("speaker") || '"Alex"');

    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);

        const result = await changeVoice({
          scenesSettings: parsedSettings,
          speaker,
        }).unwrap();

        dispatch(setAudioSettings(result.data));

        initialSettingsRef.current = stored;
        setIsChanged(false);
      } catch (err) {
        console.error("Error sending sceneSettings or parsing failed", err);
      }
    } else {
      console.warn("No sceneSettings found in localStorage.");
    }
  };

  return (
    <div>
      <Button onClick={handlePreview} disabled={!isChanged || isLoading}>
        {isLoading ? "Loading..." : "Preview Scene"}
      </Button>
    </div>
  );
};

export default PreviewScene;
