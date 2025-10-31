"use client";

import { useEffect, useState } from "react";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800); // 0.8 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center pointer-events-none">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Animated circle background */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 border-r-brand-500 animate-spin" />
        
        {/* Inner animated circle */}
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-brand-primary border-l-brand-primary animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
        
        {/* Center dot */}
        <div className="absolute w-4 h-4 rounded-full bg-brand-900 animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="absolute bottom-12 text-center">
        <p className="text-semantic-text-secondary text-sm font-medium animate-pulse">
          Initializing...
        </p>
      </div>
    </div>
  );
};
