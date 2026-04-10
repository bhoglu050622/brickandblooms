import { useState, useRef, useEffect } from 'react';

interface MobileGalleryProps {
  images: string[];
  altTexts?: string[];
  className?: string;
}

export const MobileGallery = ({ 
  images, 
  altTexts = [], 
  className = '' 
}: MobileGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    if (galleryRef.current) {
      galleryRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (galleryRef.current) {
      galleryRef.current.style.transition = 'transform 0.3s ease-out';
    }
    
    // Check if swipe was significant enough to change slide
    if (Math.abs(translateX) > 50) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (translateX < 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
    
    setTranslateX(0);
  };

  // Auto-reset translate when index changes programmatically
  useEffect(() => {
    setTranslateX(0);
    if (galleryRef.current) {
      galleryRef.current.style.transition = 'transform 0.3s ease-out';
    }
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gallery container */}
      <div 
        ref={galleryRef}
        className="flex transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
          touchAction: 'pan-y'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => setIsDragging(false)}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img 
              src={image} 
              alt={altTexts[index] || `Gallery image ${index + 1}`}
              className="w-full h-auto object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow buttons for desktop */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        disabled={currentIndex === images.length - 1}
        className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
};