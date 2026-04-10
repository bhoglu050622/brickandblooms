import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAmbientSound } from '@/hooks/useAmbientSound';

interface SoundControllerProps {
  soundUrl?: string;
  className?: string;
}

export const SoundController = ({ 
  soundUrl = '/sounds/nature-ambient.mp3', 
  className = '' 
}: SoundControllerProps) => {
  const [showControls, setShowControls] = useState(false);
  const {
    isPlaying,
    isMuted,
    isLoading,
    toggle,
    toggleMute
  } = useAmbientSound(soundUrl, { 
    volume: 0.25, 
    autoplay: false,
    loop: true 
  });

  // Show controls on user interaction
  useEffect(() => {
    const handleInteraction = () => setShowControls(true);
    
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  if (!showControls || isLoading) return null;

  return (
    <button
      onClick={isMuted ? toggleMute : toggle}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-sage/20 backdrop-blur-sm border border-white/10 text-white transition-all duration-300 hover:bg-sage/30 hover:scale-105 ${className}`}
      aria-label={isMuted ? "Unmute ambient sound" : isPlaying ? "Pause ambient sound" : "Play ambient sound"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
};