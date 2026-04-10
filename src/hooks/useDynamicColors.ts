import { useState, useEffect, useCallback } from 'react';

interface DynamicColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export const useDynamicColors = () => {
  const [colors, setColors] = useState<DynamicColors>({
    primary: '#7C8C6E',
    secondary: '#8FA07F',
    accent: '#C67D5B',
    background: '#1A1A17'
  });

  // Get seasonal colors based on current month
  const getSeasonalColors = useCallback(() => {
    const month = new Date().getMonth(); // 0-11 (Jan-Dec)
    
    // Spring: March-May (2-4)
    if (month >= 2 && month <= 4) {
      return {
        primary: '#8FA07F', // Fresh green
        secondary: '#A0B894', // Light spring green
        accent: '#D4C9B8', // Warm stone
        background: '#1A1A17'
      };
    }
    // Summer: June-August (5-7)
    else if (month >= 5 && month <= 7) {
      return {
        primary: '#7C8C6E', // Deep green
        secondary: '#8FA07F', // Rich green
        accent: '#C67D5B', // Terracotta
        background: '#1A1A17'
      };
    }
    // Autumn: September-November (8-10)
    else if (month >= 8 && month <= 10) {
      return {
        primary: '#C67D5B', // Terracotta
        secondary: '#D4C9B8', // Stone
        accent: '#7C8C6E', // Sage green
        background: '#1A1A17'
      };
    }
    // Winter: December-February (11, 0, 1)
    else {
      return {
        primary: '#D4C9B8', // Cream/stone
        secondary: '#F5F0E8', // Light cream
        accent: '#7C8C6E', // Sage green
        background: '#1A1A17'
      };
    }
  }, []);

  // Get context-aware colors based on section background brightness
  const getContextColors = useCallback((backgroundColor: string) => {
    // Simple brightness calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // If background is dark, use lighter accents
    if (brightness < 128) {
      return {
        primary: '#8FA07F',
        secondary: '#A0B894',
        accent: '#D4C9B8',
        background: backgroundColor
      };
    } else {
      // If background is light, use darker accents
      return {
        primary: '#7C8C6E',
        secondary: '#6A7A5C',
        accent: '#C67D5B',
        background: backgroundColor
      };
    }
  }, []);

  // Initialize with seasonal colors
  useEffect(() => {
    const seasonalColors = getSeasonalColors();
    setColors(seasonalColors);
  }, [getSeasonalColors]);

  return {
    colors,
    setSeasonalColors: () => setColors(getSeasonalColors()),
    setContextColors: (bgColor: string) => setColors(getContextColors(bgColor)),
    updatePrimaryColor: (color: string) => 
      setColors(prev => ({ ...prev, primary: color })),
    updateAccentColor: (color: string) => 
      setColors(prev => ({ ...prev, accent: color }))
  };
};