"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Music, Play, Pause, Search, Check } from "lucide-react";
import { useGenerateBackgroundMusicMutation } from "@/redux/api";
import { useDispatch, useSelector } from "react-redux";
import { setBackgroundMusicSrc } from "@/redux/screenSlice";
import { RootState } from "@/redux/store";

interface Track {
  id: number;
  title: string;
  audioUrl: string;
  duration: number;
  genres: string[];
  instruments: string[];
  moods: string[];
  purposes: string[];
}

const CHUNK_SIZE = 10;
const LOCAL_STORAGE_KEY = "cachedTracks";

const BackgroundMusic = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const [applyingTrackId, setApplyingTrackId] = useState<number | null>(null);
  const dispatch = useDispatch();

  const audioSettings = useSelector(
    (state: RootState) => state.sceneSettings.data.audioSettings,
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [generateBackgroundMusic] = useGenerateBackgroundMusicMutation();

  const fetchInitialTracks = async () => {
    const cached = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      setAllTracks(parsed);
      setTracks(parsed.slice(0, CHUNK_SIZE));
      setVisibleCount(CHUNK_SIZE);
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateBackgroundMusic({ searchTerm: "" });
      if (response.data.items) {
        setAllTracks(response.data.items);
        setTracks(response.data.items.slice(0, CHUNK_SIZE));
        setVisibleCount(CHUNK_SIZE);
        sessionStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(response.data.items),
        );
      }
    } catch (error) {
      console.error("Initial fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialTracks();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = allTracks.filter((track) =>
      track.title.toLowerCase().includes(term.toLowerCase()),
    );
    setTracks(filtered.slice(0, CHUNK_SIZE));
    setVisibleCount(CHUNK_SIZE);
  };

  const handlePlayPause = (track: Track) => {
    if (!audioRef.current) return;

    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current.src !== track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
      }
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play failed:", err));
      setPlayingTrackId(track.id);
    }
  };

  const handleApply = async (track: Track) => {
    try {
      setApplyingTrackId(track.id);
      dispatch(setBackgroundMusicSrc(track.audioUrl));
    } catch (err) {
      console.error("Apply failed:", err);
    } finally {
      setApplyingTrackId(null);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !isLoading &&
          visibleCount < tracks.length
        ) {
          setVisibleCount((prevCount) =>
            Math.min(prevCount + CHUNK_SIZE, tracks.length),
          );
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleCount, tracks.length, isLoading]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allTracks.filter((track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setTracks(filtered);
      setVisibleCount(Math.min(CHUNK_SIZE, filtered.length));
    } else {
      setTracks(allTracks);
      setVisibleCount(Math.min(CHUNK_SIZE, allTracks.length));
    }
  }, [searchTerm, allTracks]);

  return (
    <div className="mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Background Music</h1>
      </div>
      <div className="w-full max-w-3xl p-6 bg-card rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Music className="w-7 h-7 text-primary" />
          <h2 className="text-2xl font-semibold">Music Manager</h2>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <div
          className="space-y-4 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {tracks.slice(0, visibleCount).map((track) => {
                const isSelected = track.audioUrl === audioSettings?.src;

                return (
                  <div
                    key={track.id}
                    className={`group p-4 rounded-lg border transition-colors duration-200 cursor-pointer ${
                      isSelected
                        ? "border-green-500 bg-green-50 dark:bg-green-900"
                        : "border-border hover:bg-accent"
                    }`}
                    onClick={() => handleApply(track)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(track);
                          }}
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {track.duration}s • {track.genres.join(", ")}
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : applyingTrackId === track.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {!isLoading && tracks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tracks found for "{searchTerm}"
                </div>
              )}

              {visibleCount < tracks.length && (
                <div ref={loaderRef} className="h-10 py-4 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
            </>
          )}
          <audio ref={audioRef} hidden preload="auto" />
        </div>
      </div>
    </div>
  );
};

export default BackgroundMusic;
