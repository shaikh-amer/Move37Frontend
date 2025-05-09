"use client";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFinalVideoOutputMutation } from "@/redux/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "@/redux/store";
import { Scene } from "@/types/types";
import { setScenes, setVideoUrl } from "@/redux/screenSlice";
import { LoadingPopup } from "../common/LoadingPopup";
import { Save } from "lucide-react";
import { SavingPopup } from "../editor/SavingPopup";
import { splitTextLines } from "@/lib/MergeTextLines";

interface VideoDialogProps {
  screens: Scene[];
}

export function VideoDialog({ screens }: VideoDialogProps) {
  const generatedUrl = useSelector(
    (state: RootState) => state.sceneSettings.videoUrl,
  );
  const [videoUrl, setLocalVideoUrl] = useState<string>(generatedUrl || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const accessToken = Cookies.get("accessToken");
  const [finalVideo, { isLoading }] = useFinalVideoOutputMutation();
  const dispatch = useDispatch();
  const previewData = useSelector(
    (state: RootState) => state.sceneSettings.data,
  );

  const aspectRatio = useSelector(
    (state: RootState) => state.sceneSettings.aspectRatio,
  ); // Fetch aspect ratio
  const handleSaveChanges = useCallback(async () => {
    try {
      const sceneWithSplitText = screens.map((scene) => {
        return {
          ...scene,
          sub_scenes: scene.sub_scenes.map((subScene) => {
            const splitText = Array.isArray(subScene.text_lines)
              ? splitTextLines({ text_lines: subScene.text_lines }) // ✅ Proper input structure
              : [];

            return {
              ...subScene,
              text_lines: splitText,
            };
          }),
          // Ensure subtitle is enabled and text is preserved
          subtitle: true,
          subtitles:
            scene.subtitles && scene.subtitles.length > 0
              ? scene.subtitles
              : [{ text: "", time: 0 }],
        };
      });

      // Prepare the complete render data
      const renderData = {
        audioSettings: previewData?.audioSettings || {
          video_volume: 1,
          audio_id: "",
          audio_library: "",
          src: "",
          track_volume: 1,
          tts: "",
        },
        outputSettings: {
          name: "Generated_Video.mp4",
          format: "mp4",
          title: "Generated_Video",
          height:
            aspectRatio === "16:9"
              ? 1080
              : aspectRatio === "9:16"
                ? 1920
                : 1080,
          width:
            aspectRatio === "16:9"
              ? 1920
              : aspectRatio === "9:16"
                ? 1080
                : 1080,
        },
        // scenesSettings: screens
        scenesSettings: sceneWithSplitText.map((scene) => ({
          ...scene,
          background: {
            ...scene.background,
            src: scene.background.src.map((bg) => ({
              ...bg,
              mode: aspectRatio === "1:1" ? "fit" : "crop", //
              // mode:"fit",
            })),
          },
          // Preserve original scene duration exactly
          time: scene.time,
          subtitle: true, // Ensure subtitle is enabled
          subtitles: scene.subtitles, // Preserve subtitles exactly
          sub_scenes: scene.sub_scenes.map((subScene) => ({
            ...subScene,
            // Preserve original subScene duration
            time: scene.time,
            location: {
              center_x:
                aspectRatio === "1:1"
                  ? 540
                  : aspectRatio === "9:16"
                    ? 540
                    : subScene.location.center_x,
              start_y:
                aspectRatio === "1:1"
                  ? 850
                  : aspectRatio === "9:16"
                    ? 1500
                    : subScene.location.start_y,
            },
            font: {
              ...subScene.font,
              size:
                aspectRatio === "1:1" ? 22 : aspectRatio === "9:16" ? 22 : 28, // Adjust font size
              fullWidth:
                aspectRatio === "1:1"
                  ? true
                  : aspectRatio === "9:16"
                    ? true
                    : false, // Adjust full width
            },
            max_width:
              aspectRatio === "1:1"
                ? "80%"
                : aspectRatio === "9:16"
                  ? "50%"
                  : "80%", // Adjust max width
            subtitle: subScene.subtitle || true, // Ensure subtitle property is set
            displayItems: subScene.displayItems || [], // Preserve display items
          })),
        })),
      };

      const response = await finalVideo({
        renderData,
        accessToken,
      });

      if (response?.data?.data?.videoURL) {
        const newVideoUrl = response.data.data.videoURL;
        setLocalVideoUrl(newVideoUrl);
        dispatch(setVideoUrl(newVideoUrl));
        dispatch(setScenes(screens)); // Save the updated scenes
        setIsDialogOpen(true);
        toast.success("Video generated successfully!");
      } else {
        throw new Error("No video URL in response");
      }
    } catch (error) {
      toast.error("Failed to generate video");
    }
  }, [screens, aspectRatio, previewData, finalVideo, accessToken, dispatch]);

  if (isLoading) {
    return <SavingPopup isLoading={isLoading} />;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleSaveChanges}
          variant="default"
          disabled={isLoading}
        >
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Generated Video</DialogTitle>
        </DialogHeader>
        {videoUrl && (
          <div className="mt-4 relative" style={{ minHeight: "400px" }}>
            <>
              <video
                src={videoUrl}
                className="w-full aspect-video rounded-lg"
                preload="auto"
                autoPlay
                controls
                style={{ display: isLoading ? "none" : "block" }}
              />
              <div className="mt-4 flex justify-end gap-2">
                <a
                  href={videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Download Video</Button>
                </a>
              </div>
            </>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
