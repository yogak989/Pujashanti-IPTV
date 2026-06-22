import { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player/dist/shaka-player.ui.js';
import 'shaka-player/dist/controls.css';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';

export default function VideoPlayer({ url, onError, name }: { url: string, onError: () => void, name: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [volume, setVolume] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchRef = useRef<{
    startY: number;
    lastY: number;
    side: 'left' | 'right' | null;
    type: 'volume' | 'brightness' | null;
  } | null>(null);

  const showOverlay = () => {
      setIsOverlayVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsOverlayVisible(false), 3000);
      if (videoRef.current) setVolume(videoRef.current.volume);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const videoContainer = videoContainerRef.current;
    if (!video || !videoContainer || !url) return;

    setError(null);
    setIsLoading(true);
    const player = new shaka.Player(video);
    playerRef.current = player;
    const ui = new shaka.ui.Overlay(player, videoContainer, video);
   // UI configuration can be accessed through ui.getControls() if needed

    player.addEventListener('error', (event: any) => {
      setError(event.detail);
      onError(); // Trigger the callback
    });

    player.load(url).then(() => {
        setIsLoading(false);
        // Robust autoplay handling
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((e: any) => {
            console.warn("Autoplay restricted, waiting for user interaction", e);
          });
        }
    }).catch((e: any) => {
        setIsLoading(false);
        setError(e);
        onError(); // Also trigger on catch
    });

    return () => {
      ui.destroy();
      player.destroy();
      playerRef.current = null;
    };
  }, [url]);

  const retry = () => {
    setError(null);
    playerRef.current?.load(url).catch((e: any) => setError(e));
  };

  return (
    <div ref={videoContainerRef} 
        className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10 relative group"
        onClick={showOverlay}
    >
      <video ref={videoRef} className="w-full h-full" />
      
      {isOverlayVisible && (
        <div className="absolute top-4 left-4 z-20 bg-black/60 p-4 rounded text-white backdrop-blur-sm transition-opacity duration-300">
            <h3 className="font-bold text-lg">{name}</h3>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-20">
          <p className="text-white text-sm font-medium">Failed to load stream.</p>
          <button 
            onClick={retry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold uppercase tracking-widest"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}
      <button 
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
      >
         {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
    </div>
  );
}
