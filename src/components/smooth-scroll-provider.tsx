"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  className?: string;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  className = "",
}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // RAF loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // ScrollTrigger proxy
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && lenisRef.current && typeof value === 'number') {
          lenisRef.current.scrollTo(value, { immediate: true });
        }
        return lenisRef.current?.scroll || 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    // Refresh ScrollTrigger when Lenis updates
    lenisRef.current?.on("scroll", ScrollTrigger.update);

    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.scrollerProxy(document.body, undefined);
    };
  }, []);

  return (
    <div className={`smooth-scroll-container ${className}`}>
      {children}
    </div>
  );
};
