import React from "react";
import { LucideIcon } from "lucide-react";
import { GlassCard, GlassCardContent } from "./glass-card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  className,
}: FeatureCardProps) {
  return (
    <GlassCard className={cn("card-value-prop", className)}>
      <GlassCardContent className="p-0">
        <div className={`card-feature-icon ${color} mx-auto mb-6`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-subheading-md sm:text-subheading-lg font-bold text-white mb-3">
          {title}
        </div>
        <div className="text-body-md text-white/80 leading-relaxed">
          {description}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}
