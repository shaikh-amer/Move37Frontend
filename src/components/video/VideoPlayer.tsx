"use client";
import React, { useEffect, useRef, useState } from "react";
import type { Scene, AudioSettings, DisplayItem } from "@/types/types";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import styles from "./VideoPlayer.module.css";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
  videoUrl: string;
  backgroundColor: string;
  displayItems: DisplayItem[];
  scenes: Scene[];
  audioSettings: AudioSettings;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  backgroundColor,
  scenes,
  audioSettings,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const videoRef = useRef<any>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null); // src
  const ttsRef = useRef<HTMLAudioElement | null>(null); // tts

  const trackVolume = useSelector(
    (state: RootState) => state.sceneSettings.audioSettings?.track_volume,
  );
  const videoVolume = useSelector(
    (state: RootState) => state.sceneSettings.audioSettings?.video_volume,
  );

  const isMuted = videoVolume === -1;
  const normalizedVolume = isMuted
    ? 0
    : Math.max(0, Math.min(1, (videoVolume + 1) / 2));

  const isBGMuted = trackVolume === -1;
  const normalizedBGVolume = isBGMuted
    ? 0
    : Math.max(0, Math.min(1, (trackVolume + 1) / 2));

  const selectedScene = useSelector(
    (state: RootState) => state.reduxScene.selectedScene,
  );
  const selectedSceneIndex = useSelector(
    (state: RootState) => state.reduxScene.selectedSceneIndex,
  );

  const toggleSubtitle = useSelector(
    (state: RootState) => state.sceneSettings.subtitleToggle,
  );

  const aspectRatio = useSelector(
    (state: RootState) => state.sceneSettings.aspectRatio,
  ) as "16:9" | "9:16" | "1:1";

  let sceneStartTime = 0;
  for (let i = 0; i < selectedSceneIndex; i++) {
    sceneStartTime += scenes[i]?.time || 0;
  }
  const sceneEndTime = sceneStartTime + (selectedScene?.time || 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!bgMusicRef.current && audioSettings?.src) {
      bgMusicRef.current = new Audio(audioSettings.src);
      bgMusicRef.current.loop = true;
    }

    if (!ttsRef.current && audioSettings?.tts) {
      ttsRef.current = new Audio(audioSettings.tts);
    }
  }, [audioSettings, isMounted]);

  useEffect(() => {
    if (ttsRef.current) {
      ttsRef.current.volume = normalizedVolume;
      ttsRef.current.muted = isMuted;
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = normalizedBGVolume;
      bgMusicRef.current.muted = isBGMuted;
    }
  }, [normalizedVolume, isMuted, normalizedBGVolume, isBGMuted]);

  useEffect(() => {
    if (isPlaying) {
      if (ttsRef.current) {
        ttsRef.current.currentTime = sceneStartTime;
        ttsRef.current
          .play()
          .catch((err) => console.error("TTS play error:", err));
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.currentTime = sceneStartTime;
        bgMusicRef.current
          .play()
          .catch((err) => console.error("BG Music play error:", err));
      }
    } else {
      if (ttsRef.current) ttsRef.current.pause();
      if (bgMusicRef.current) bgMusicRef.current.pause();
    }
  }, [isPlaying, sceneStartTime]);

  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleTimeUpdate = () => {
    if (ttsRef.current && ttsRef.current.currentTime >= sceneEndTime) {
      ttsRef.current.pause();
    }
    if (bgMusicRef.current && bgMusicRef.current.currentTime >= sceneEndTime) {
      bgMusicRef.current.pause();
    }
  };

  // Cleanup audio elements
  useEffect(() => {
    return () => {
      if (ttsRef.current) {
        ttsRef.current.pause();
        ttsRef.current = null;
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`relative flex justify-center items-center w-full h-[65vh] mx-auto ${
        aspectRatio === "16:9"
          ? "aspect-[16/9] max-w-full"
          : aspectRatio === "9:16"
            ? "aspect-[9/16] max-w-[50%]"
            : "aspect-[1/1] max-w-[80%]"
      }`}
      style={{ backgroundColor: backgroundColor || "black" }}
    >
      <ReactPlayer
        ref={videoRef}
        url={videoUrl}
        playing={isPlaying}
        controls={true}
        width="100%"
        height="100%"
        style={{ backgroundColor: backgroundColor || "transparent" }}
        className="absolute top-0 left-0"
        onPlay={() => handlePlayPause(true)}
        onPause={() => handlePlayPause(false)}
        muted={isMuted}
        volume={normalizedVolume}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
      />

      <audio onTimeUpdate={handleTimeUpdate} />
      <audio onTimeUpdate={handleTimeUpdate} />

      {toggleSubtitle && (
        <div
          className={styles.subtitle}
          style={{
            fontSize: `${
              selectedScene?.sub_scenes?.[0]?.font?.size
                ? selectedScene.sub_scenes[0].font.size * 0.34
                : 20
            }px`,
            color: selectedScene?.sub_scenes?.[0]?.font?.color || "#ffffff",
            backgroundColor: "rgba(0,0,0,0.15)",
            fontFamily:
              selectedScene?.sub_scenes?.[0]?.font?.name || "sans-serif",
            width: "98%",
            maxWidth: "98%",
            whiteSpace: "normal",
            lineHeight: `${
              selectedScene?.sub_scenes?.[0]?.font?.line_height
                ? selectedScene.sub_scenes[0].font.line_height * 0.42
                : 1.2
            }px`,
            fontWeight:
              selectedScene?.sub_scenes?.[0]?.font?.decoration?.includes("bold")
                ? "bold"
                : "normal",
          }}
          dangerouslySetInnerHTML={{
            __html: selectedScene?.subtitles?.[0]?.text || "",
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
