"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LucideIcon } from "lucide-react";

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
          className="hidden sm:block absolute left-8 top-20 w-0.5 h-32 bg-semantic-border"
        />
      )}

      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
        {/* Icon and step number */}
        <div className="flex-shrink-0 relative mb-4 sm:mb-0">
          <div
            ref={iconRef}
            className="w-16 h-16 rounded-full bg-semantic-accent flex items-center justify-center shadow-lg relative z-10"
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-semantic-surface">
            {stepNumber}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 min-w-0">
          <div className="rounded-2xl bg-semantic-surface border-2 border-semantic-border hover:border-semantic-accent transition-all duration-300 shadow-lg hover:shadow-xl p-6 lg:p-8">
            <div className="mb-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-semantic-text mb-2">
                {title}
              </h3>
              {subtitle && (
                <p className="text-semantic-accent text-lg font-medium">
                  {subtitle}
                </p>
              )}
            </div>
            {description && (
              <p className="text-semantic-text/90 text-base lg:text-lg leading-relaxed mb-6">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
