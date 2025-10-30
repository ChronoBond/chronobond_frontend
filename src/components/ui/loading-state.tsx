"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState = ({ 
  message = "Loading...", 
  className = "app-container" 
}: LoadingStateProps) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />
        <CardContent className="relative z-10 p-8 md:p-10">
          <div className="flex items-center justify-center gap-3 text-white">
            <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-brand-primary" aria-hidden="true" />
            <span className="text-base md:text-lg text-white/90" aria-live="polite">{message}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
