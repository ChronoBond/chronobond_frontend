import React from "react";
import { LucideIcon } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { cn } from "@/lib/utils";

interface FeatureStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  className?: string;
}

export function FeatureStep({
  icon: Icon,
  title,
  description,
  color,
  className,
}: FeatureStepProps) {
  return (
    <div className={cn("layout-flex-feature", className)}>
      <div className={`card-feature-icon ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="flex-1">
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={2}
          blurStrength={6}
          stagger={0.08}
          className="text-feature-title"
        >
          {title}
        </ScrollReveal>
        <ScrollReveal
          baseOpacity={0}
          enableBlur={true}
          baseRotation={1}
          blurStrength={3}
          stagger={0.03}
          className="text-feature-description"
        >
          {description}
        </ScrollReveal>
      </div>
    </div>
  );
}
