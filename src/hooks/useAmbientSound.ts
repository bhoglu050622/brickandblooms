import { useState, useEffect, useRef } from 'react';

interface AmbientSoundOptions {
  volume?: number;
  autoplay?: boolean;
  loop?: boolean;
}

export const useAmbientSound = (soundUrl: string, options: AmbientSoundOptions = {}) => {
  const { volume = 0.3, autoplay = false, loop = true } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(soundUrl);
    audio.volume = volume;
    audio.loop = loop;
    audioRef.current = audio;

    // Handle audio loading
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);
    
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Auto-play if enabled
    if (autoplay && !isMuted) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [soundUrl, volume, autoplay, loop, isMuted]);

  const play = async () => {
    if (!audioRef.current || isMuted) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.warn('Failed to play ambient sound:', error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    isPlaying,
    isMuted,
    isLoading,
    play,
    pause,
    toggle,
    toggleMute,
    setVolume
  };
};