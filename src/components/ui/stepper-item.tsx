"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LucideIcon } from "lucide-react";
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "./glass-card";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepperItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  stepNumber: number;
  isLast?: boolean;
  className?: string;
}

export function StepperItem({
  icon: Icon,
  title,
  subtitle,
  description,
  children,
  stepNumber,
  isLast = false,
  className = "",
}: StepperItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !iconRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    // Animate icon and step number
    tl.fromTo(
      iconRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
    );

    // Animate content
    tl.fromTo(
      contentRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Animate connecting line
    if (!isLast && lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 0.8, ease: "power2.out" },
        "-=0.2"
      );
    }

    return () => {
      tl.kill();
    };
  }, [isLast]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Connecting line */}
      {!isLast && (
        <div
          ref={lineRef}
          className="absolute left-8 top-20 w-0.5 h-32 bg-gradient-to-b from-cyan-400/50 via-blue-500/30 to-violet-500/20"
        />
      )}

      <div className="flex items-start gap-8">
        {/* Icon and step number */}
        <div className="flex-shrink-0 relative">
          <div
            ref={iconRef}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 flex items-center justify-center shadow-2xl relative z-10"
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white">
            {stepNumber}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 min-w-0">
          <GlassCard className="frosted-glass">
            <GlassCardHeader className="pb-4">
              <GlassCardTitle className="text-3xl font-bold text-white mb-2">
                {title}
              </GlassCardTitle>
              {subtitle && (
                <GlassCardDescription className="text-cyan-400 text-lg font-medium">
                  {subtitle}
                </GlassCardDescription>
              )}
            </GlassCardHeader>
            <GlassCardContent className="pt-0">
              {description && (
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {description}
                </p>
              )}
              {children}
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
