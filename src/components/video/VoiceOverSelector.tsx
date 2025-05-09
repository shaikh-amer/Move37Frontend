"use client";
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Search, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import Cookies from "js-cookie";
import {
  useGenerateCustomAiVoiceMutation,
  useVoiceOverTracksMutation,
} from "@/redux/api";
import { setAudioSettings } from "@/redux/screenSlice";
import { useDispatch } from "react-redux";
import { getFormattedSubtitleText } from "@/lib/MergeTextLines";

// Types
interface VoiceTrack {
  id: number;
  name: string;
  gender: string;
  accent: string;
  language: string;
  category: string;
  engine: string;
  sample: string;
  service: string;
  ssmlHelp: string;
  ssmlSupportCategory: string;
}

const CACHE_KEY = "cachedVoices";

const AIVoicesSelector: React.FC = () => {
  const dispatch = useDispatch();

  const [voices, setVoices] = useState<VoiceTrack[]>([]);
  const [displayedVoices, setDisplayedVoices] = useState<VoiceTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceTrack | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const itemsPerPage = 5;

  const [generateCustomVoice] = useGenerateCustomAiVoiceMutation();
  const [getVoiceOverTracks, { isLoading: isLoadingVoices }] =
    useVoiceOverTracksMutation();

  // Intersection observer for infinite scrolling
  const { ref: bottomRef, inView } = useInView({
    threshold: 0.1,
  });

  // Fetch voices from API or cache from sessionStorage
  const fetchVoices = async () => {
    if (loading) return;
    setLoading(true);

    // Try to get cached voices first from sessionStorage
    const cachedVoices = sessionStorage.getItem(CACHE_KEY);
    if (cachedVoices) {
      const parsedVoices = JSON.parse(cachedVoices);
      setVoices(parsedVoices);
      setDisplayedVoices(parsedVoices.slice(0, itemsPerPage));
      setLoading(false);
      return;
    }

    try {
      const response = await getVoiceOverTracks({}).unwrap();
      setVoices(response);
      setDisplayedVoices(response.slice(0, itemsPerPage));
      // Cache in sessionStorage so it doesn't persist across sessions.
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(response));
    } catch (error) {
      console.error("Error fetching voiceover tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch voices when component mounts.
  useEffect(() => {
    fetchVoices();
  }, []);

  // Clear cached data when user refreshes or leaves the page.
  useEffect(() => {
    const clearCache = () => {
      sessionStorage.removeItem(CACHE_KEY);
    };

    window.addEventListener("beforeunload", clearCache);
    return () => {
      window.removeEventListener("beforeunload", clearCache);
    };
  }, []);

  // Handle playing audio samples.
  const handlePlayPause = (voice: VoiceTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing === voice.id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (voice.sample) {
        audioRef.current = new Audio(voice.sample);
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
        });
        audioRef.current.onended = () => setPlaying(null);
        setPlaying(voice.id);
      }
    }
  };

  const [loadingVoiceId, setLoadingVoiceId] = useState<number | null>(null);
  // Apply selected voice and update Redux.
  const handleApply = async (voice: VoiceTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingVoiceId(voice.id);

    const raw = localStorage.getItem("sceneSettings");
    let script = "";

    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        script = getFormattedSubtitleText(parsed);
      } else {
        console.warn("sceneSettings not found in localStorage");
      }
    } catch (err) {
      console.error("Failed to parse sceneSettings from localStorage", err);
      return;
    }

    try {
      const response = await generateCustomVoice({
        text: script,
        voiceSettings: {
          speaker: voice.name,
          speed: "100",
          amplifyLevel: "0",
        },
      }).unwrap();

      const audioSettings = response?.data?.audioSettings;
      localStorage.setItem("speaker", JSON.stringify(voice.name));
      dispatch(setAudioSettings(audioSettings));
      setSelectedVoice(voice);
    } catch (error) {
      console.error("Error generating custom voice:", error);
    } finally {
      setLoadingVoiceId(null);
    }
  };

  // Filter and paginate voices based on search.
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filtered = voices.filter(
        (voice) =>
          voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voice.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voice.accent.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setDisplayedVoices(filtered.slice(0, page * itemsPerPage));
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, voices, page]);

  // Load more voices when scrolling to bottom.
  useEffect(() => {
    if (inView && !loading && displayedVoices.length < voices.length) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading, displayedVoices.length, voices.length]);

  // Clean up audio on unmount.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Count of voices matching the current search query.
  const filteredVoicesCount = voices.filter(
    (voice) =>
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchQuery.toLowerCase()),
  ).length;

  return (
    <div className="w-full z-50">
      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />

      <Button variant="outline" className="w-full justify-between my-2">
        {selectedVoice ? selectedVoice.name : "AI Voices"}
        {selectedVoice && <Check className="w-4 h-4 ml-2 text-green-600" />}
      </Button>

      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search voices"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset pagination when search changes.
          }}
        />
      </div>

      {/* Loading state */}
      {loading && voices.length === 0 ? (
        <div className="py-4 text-center">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          <p className="mt-2 text-sm text-gray-500">Loading voices...</p>
        </div>
      ) : (
        <div
          className="max-h-[56vh] overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
        >
          {displayedVoices.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              No voices found
            </p>
          ) : (
            <>
              {displayedVoices.map((voice) => (
                <div
                  key={voice.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={(e) => handleApply(voice, e)}
                >
                  <div className="flex items-center">
                    <button
                      className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center mr-2 hover:bg-gray-200"
                      onClick={(e) => handlePlayPause(voice, e)}
                    >
                      {playing === voice.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-medium">
                        {voice.name}, {voice.gender}
                      </p>
                      <p className="text-xs text-gray-500">{voice.accent}</p>
                    </div>
                  </div>
                  {loadingVoiceId === voice.id ? (
                    <Loader2 className="text-green-500 animate-spin h-5 w-5" />
                  ) : selectedVoice?.id === voice.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : null}
                </div>
              ))}

              {/* Loading more indicator */}
              {displayedVoices.length < filteredVoicesCount && (
                <div
                  ref={bottomRef}
                  className="py-2 text-center text-xs text-gray-500"
                >
                  {loading ? "Loading more..." : "Scroll for more"}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIVoicesSelector;
