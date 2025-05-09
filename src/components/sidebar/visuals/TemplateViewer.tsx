"use client";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useGenerateScenariosMutation } from "@/redux/api";
import toast from "react-hot-toast";
import { LayoutDashboard, Loader2 } from "lucide-react";
import { Scene, VisualTemplate } from "@/types/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { stripHTML } from "@/utils/stripHtmlToText";
import debounce from "lodash/debounce";

interface TemplateViewerProps {
  onVideoSelect: (videoUrl: Scene) => void;
}

interface CachedTemplates {
  input: string;
  data: VisualTemplate[];
}

export function TemplateViewer({ onVideoSelect }: TemplateViewerProps) {
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [templateScenes, setTemplateScenes] = useState<VisualTemplate[]>([]);
  const [displayCount, setDisplayCount] = useState(2);
  const [scenarioGenerator, { isLoading }] = useGenerateScenariosMutation();
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>("");

  const selectedScene = useSelector(
    (state: RootState) => state.reduxScene.selectedScene,
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const cachedTemplatesRef = useRef<Record<string, VisualTemplate[]>>({});

  // Update current subtitle text whenever selectedScene changes
  useEffect(() => {
    if (selectedScene?.subtitles?.[0]?.text) {
      const newText = stripHTML(selectedScene.subtitles[0].text);
      setCurrentSubtitleText(newText);
    }
  }, [selectedScene]);

  // Try to load from cache whenever currentSubtitleText changes
  useEffect(() => {
    if (!currentSubtitleText) return;

    // Try to load from in-memory cache first (faster than sessionStorage)
    if (cachedTemplatesRef.current[currentSubtitleText]) {
      const cachedData = cachedTemplatesRef.current[currentSubtitleText];
      setTemplateScenes(cachedData);
      setVideoLinks(cachedData.map((item) => item.preview.url).filter(Boolean));
      setDisplayCount(2);
      return;
    }

    // Then try from sessionStorage
    try {
      const cacheKey = "cachedTemplates";
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        const allCachedData = JSON.parse(cached);
        if (allCachedData[currentSubtitleText]) {
          const data = allCachedData[currentSubtitleText];

          // Store in memory for faster access next time
          cachedTemplatesRef.current[currentSubtitleText] = data;
          setTemplateScenes(data);
          setVideoLinks(
            data.map((item: any) => item.preview.url).filter(Boolean),
          );
          setDisplayCount(2);
        } else {
          // Reset UI when no cache exists for this text
          setTemplateScenes([]);
          setVideoLinks([]);
        }
      }
    } catch (error) {
      console.error("Error loading cached templates:", error);
    }
  }, [currentSubtitleText]);

  const handleScenarios = useCallback(async () => {
    if (!currentSubtitleText) return;

    try {
      const response = await scenarioGenerator({ input: currentSubtitleText });
      if (response?.data?.data?.searchResults) {
        const searchResults = response.data.data.searchResults;

        // Store preview URLs from the search results
        const sceneUrls = searchResults
          .map((item: { preview?: { url?: string } }) => item.preview?.url)
          .filter(Boolean);

        // Update in-memory cache
        cachedTemplatesRef.current[currentSubtitleText] = searchResults;

        // Update session storage with all cached templates
        const cacheKey = "cachedTemplates";
        try {
          let allCached = {};
          const cachedString = sessionStorage.getItem(cacheKey);
          if (cachedString) {
            allCached = JSON.parse(cachedString);
          }

          allCached = {
            ...allCached,
            [currentSubtitleText]: searchResults,
          };

          sessionStorage.setItem(cacheKey, JSON.stringify(allCached));
        } catch (e) {
          console.error("Error saving to cache:", e);
        }

        setTemplateScenes(searchResults);
        setVideoLinks(sceneUrls);
        setDisplayCount(2);
        toast.success("Templates generated!");
      }
    } catch (error) {
      toast.error("Failed to generate templates");
    }
  }, [scenarioGenerator, currentSubtitleText]);

  const createSceneFromTemplate = (template: VisualTemplate): Scene => {
    // Make sure we have the selected scene available
    if (!selectedScene) {
      toast.error("No scene selected to apply template to");
      return {} as Scene;
    }

    return {
      background: {
        src: [
          {
            url: template.preview.url,
            asset_id: parseInt(template.assetId) || 0,
            type: template.mediaType.toLowerCase(),
            library: template.searchLibrary,
            mode: "",
            frame: null,
            loop_video: true,
            mute: true,
            resource_id: parseInt(template.id) || 0,
            sessionId: template.id,
          },
        ],
        color: selectedScene.background.color || "",
        bg_animation: selectedScene.background.bg_animation || {
          animation: "",
        },
      },
      // Preserve the original scene duration
      time: selectedScene.time || template.duration || 0,
      keywords: selectedScene.keywords || [template.keyword].filter(Boolean),
      // Keep all original sub_scenes exactly as they were
      sub_scenes: selectedScene.sub_scenes || [],
      // Preserve the original subtitles
      subtitles: selectedScene.subtitles || [],
      // Preserve original audio settings
      music: selectedScene.music || false,
      tts: selectedScene.tts || false,
      subtitle: true, // Ensure subtitles are enabled
      // Add the preview to make it compatible with SceneSlider
      preview: {
        url: template.preview.url,
      },
    };
  };

  const handleChooseVideo = useCallback(
    (index: number) => {
      if (!templateScenes || templateScenes.length <= index) {
        toast.error("Template not found!");
        return;
      }

      // Get the selected template
      const selectedTemplate = templateScenes[index];

      // Transform it to a Scene object
      const sceneObject = createSceneFromTemplate(selectedTemplate);

      onVideoSelect(sceneObject);
      toast.success("Template applied!");
    },
    [templateScenes, onVideoSelect, selectedScene],
  );

  const videoGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-4">
        {videoLinks.slice(0, displayCount).map((video, index) => (
          <div
            key={index}
            className="flex flex-col bg-white border rounded-sm shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <video
              src={video}
              controls
              className="w-full aspect-video object-cover"
              preload="metadata"
            />
            <Button
              onClick={() => handleChooseVideo(index)}
              className="m-1 p-0.5 text-sm bg-gradient-to-r from-black to-gray-800 text-white hover:opacity-90 text-[10px]"
            >
              Choose Template {index + 1}
            </Button>
          </div>
        ))}
      </div>
    ),
    [videoLinks, displayCount, handleChooseVideo],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < videoLinks.length) {
          setDisplayCount((prev) => Math.min(prev + 2, videoLinks.length));
        }
      },
      { threshold: 1 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [displayCount, videoLinks]);

  return (
    <div className="w-full bg-white dark:bg-neutral-900 p-2 rounded-lg shadow-md">
      {videoLinks.length === 0 && (
        <Button
          onClick={handleScenarios}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-black to-gray-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
        >
          {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
          Generate Visuals
        </Button>
      )}

      <div className="mt-4 relative">
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin text-black" />
          </div>
        ) : videoLinks.length > 0 ? (
          <>
            {videoGrid}
            {displayCount < videoLinks.length && (
              <div ref={sentinelRef} className="h-4"></div>
            )}
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No templates available. Click above to generate some!
          </p>
        )}
      </div>
    </div>
  );
}
