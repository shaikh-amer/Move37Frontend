"use client";

import React, { useEffect, useState } from "react";
import { useGenerateSignedUrlMutation } from "@/redux/api";
import { useGetAttachmentsQuery } from "@/redux/newApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Scene } from "@/types/types";
import { useUpdateScene } from "@/lib/updateScene";
import toast from "react-hot-toast";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import VideoGallery, { VideoAttachment } from "./VideoGallery";

export default function CustomFileUpload() {
  const [uploadedVideos, setUploadedVideos] = useState<VideoAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [generateSignedUrl] = useGenerateSignedUrlMutation();
  const {
    data: fetchedVideos,
    isLoading,
    error,
    refetch,
  } = useGetAttachmentsQuery(undefined);

  const selectedScene = useSelector(
    (state: RootState) => state.reduxScene.selectedScene,
  );
  const handleVideoUrlChange = useUpdateScene();

  useEffect(() => {
    if (fetchedVideos) {
      setUploadedVideos(fetchedVideos);
    }
  }, [fetchedVideos]);

  const handleVideoClick = (video: VideoAttachment) => {
    if (!selectedScene) {
      toast.error("No scene selected");
      return;
    }

    const scene: Scene = {
      background: {
        src: [
          {
            url: video.url,
            asset_id: Math.floor(Math.random() * 10000),
            type: "video",
            library: "custom",
            mode: "crop",
            frame: null,
            loop_video: true,
            mute: false,
            resource_id: Math.floor(Math.random() * 10000),
            sessionId: `custom-${Date.now()}`,
          },
        ],
        color: selectedScene.background.color || "",
        bg_animation: selectedScene.background.bg_animation || {
          animation: "",
        },
      },
      time: selectedScene.time || 0,
      keywords: selectedScene.keywords || [],
      sub_scenes: selectedScene.sub_scenes || [],
      subtitles: selectedScene.subtitles || [],
      music: selectedScene.music || false,
      tts: selectedScene.tts || false,
      subtitle: true,
      preview: {
        url: video.url,
      },
    };

    handleVideoUrlChange(scene);
    toast.success("Scene applied!");
  };

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith("video/")) continue;

        const signedUrlRes = await generateSignedUrl({
          fileName: file.name,
          contentType: file.type,
        }).unwrap();

        if (!signedUrlRes.success) {
          console.error("Signed URL generation failed");
          continue;
        }

        const { signedUrl } = signedUrlRes.data;

        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) continue;
      }

      // ✅ Refetch attachments after upload completes
      await refetch();
      toast.success("Upload complete and data refreshed!");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  return (
    <div className="bg-background text-foreground p-4 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload & Select Video
        </h1>

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center transition-colors relative",
            isDragging
              ? "border-foreground bg-muted"
              : "border-muted-foreground/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Uploading files...
                </p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg mb-2">Drag and drop your files here</p>
              <p className="text-sm text-muted-foreground mb-4">
                Only video files are supported
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                  multiple
                  accept="video/*"
                />
                <span className="px-6 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                  Browse Files
                </span>
              </label>
            </>
          )}
        </div>

        {/* Video Display */}
        {isLoading ? (
          <div className="flex items-center gap-2 my-2 justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">files loading...</p>
          </div>
        ) : (
          <VideoGallery
            videos={uploadedVideos}
            onVideoClick={handleVideoClick}
          />
        )}
      </div>
    </div>
  );
}
