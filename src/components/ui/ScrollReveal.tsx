"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
  stagger?: number;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  baseOpacity = 0,
  enableBlur = true,
  baseRotation = 5,
  blurStrength = 10,
  stagger = 0.1,
  trigger,
  start = "top 80%",
  end = "bottom 20%",
  scrub = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Split text into words and wrap each word in a span
    const text = containerRef.current.textContent || "";
    const words = text.split(" ");
    
    // Clear container and create word spans
    containerRef.current.innerHTML = "";
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.style.display = "inline-block";
      span.style.opacity = baseOpacity.toString();
      if (enableBlur) {
        span.style.filter = `blur(${blurStrength}px)`;
      }
      span.style.transform = `rotate(${baseRotation}deg)`;
      span.style.marginRight = "0.25em";
      containerRef.current?.appendChild(span);
    });

    // Get all word spans
    const wordSpans = Array.from(containerRef.current.children) as HTMLSpanElement[];
    wordsRef.current = wordSpans;

    // Create GSAP animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger ? document.querySelector(trigger) : containerRef.current,
        start,
        end,
        scrub,
        toggleActions: scrub ? "play none none reverse" : "play none none none",
      },
    });

    // Animate each word
    wordSpans.forEach((word, index) => {
      tl.fromTo(
        word,
        {
          opacity: baseOpacity,
          filter: enableBlur ? `blur(${blurStrength}px)` : "blur(0px)",
          transform: `rotate(${baseRotation}deg)`,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "rotate(0deg)",
          duration: 0.8,
          ease: "power2.out",
        },
        index * stagger
      );
    });

    return () => {
      tl.kill();
    };
  }, [baseOpacity, enableBlur, baseRotation, blurStrength, stagger, trigger, start, end, scrub]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
