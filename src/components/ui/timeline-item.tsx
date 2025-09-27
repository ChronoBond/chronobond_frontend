"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "./glass-card";

interface TimelineItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  isLast?: boolean;
  delay?: number;
  className?: string;
}

export function TimelineItem({
  icon: Icon,
  title,
  subtitle,
  description,
  children,
  isLast = false,
  delay = 0,
  className = "",
}: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      gsap.fromTo(itemRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, delay }
      );
    }
  }, [delay]);

  return (
    <div ref={itemRef} className={`relative ${className}`}>
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-cyan-400/50 via-blue-500/30 to-violet-500/20" />
      )}
      
      {/* Timeline node */}
      <div className="relative z-10 flex items-start gap-6">
        {/* Icon badge */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        {/* Content card */}
        <div className="flex-1 min-w-0">
          <GlassCard className="frosted-glass">
            <GlassCardHeader className="pb-4">
              <GlassCardTitle className="text-xl font-bold text-white">
                {title}
              </GlassCardTitle>
              {subtitle && (
                <GlassCardDescription className="text-gray-400 text-sm">
                  {subtitle}
                </GlassCardDescription>
              )}
            </GlassCardHeader>
            <GlassCardContent className="pt-0">
              {description && (
                <p className="text-gray-300 leading-relaxed mb-4">
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
