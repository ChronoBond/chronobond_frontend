import React from "react";
import { ScrollReveal } from "./scroll-reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-12", className)}>
      <ScrollReveal
        baseOpacity={0}
        enableBlur={true}
        baseRotation={5}
        blurStrength={10}
        stagger={0.15}
        className={cn("text-section-title", titleClassName)}
      >
        {title}
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={2}
          blurStrength={6}
          stagger={0.08}
          className={cn("text-section-subtitle", subtitleClassName)}
        >
          {subtitle}
        </ScrollReveal>
      )}
    </div>
  );
}
