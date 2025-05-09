import React, { useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export interface VideoAttachment {
  id: string;
  url: string;
  dateCreated: string;
  dateUpdated: string;
}

interface VideoGalleryProps {
  videos: VideoAttachment[];
  onVideoClick: (video: VideoAttachment) => void;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  onVideoClick,
}) => {
  if (!videos.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 mt-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onVideoClick={onVideoClick} />
      ))}
    </div>
  );
};

interface VideoCardProps {
  video: VideoAttachment;
  onVideoClick: (video: VideoAttachment) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onVideoClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isHovered) {
      videoElement.play().catch(() => {});
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-transform duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onVideoClick(video)}
    >
      <div className="aspect-video relative">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
        >
          <source src={video.url} type="video/mp4" />
        </video>

        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
        >
          <Play className="w-12 h-12 text-white opacity-80" />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isHovered ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div
        className={`absolute inset-0 border-2 border-white/0 rounded-xl transition-all duration-300 ${isHovered ? "border-white/20" : ""}`}
      />
    </div>
  );
};

export default VideoGallery;
