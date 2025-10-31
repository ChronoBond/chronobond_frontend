"use client";

import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/splash-screen";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Timer to hide splash screen after 0.8 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 800);

    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}
      {children}
    </>
  );
}
