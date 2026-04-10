import { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  blurHash?: string; // Optional base64 encoded blur hash
  placeholderColor?: string;
}

export const ProgressiveImage = ({ 
  src, 
  alt, 
  className = '',
  blurHash,
  placeholderColor = '#2A2A25'
}: ProgressiveImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
        >
          {blurHash && (
            <img 
              src={blurHash} 
              alt="placeholder" 
              className="w-full h-full object-cover opacity-30"
            />
          )}
        </div>
      )}
      
      {/* Actual image */}
      {!isLoading && imageSrc && (
        <img 
          src={imageSrc} 
          alt={alt} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
};