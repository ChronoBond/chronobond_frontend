"use client";

import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState = ({
  message = "Loading...",
  className = "app-container",
}: LoadingStateProps) => {
  return (
    <div className={`${className} w-full`}>
      <Card className="w-full rounded-2xl bg-semantic-surface backdrop-blur-xl border border-semantic-border">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="space-y-3">
            {/* Header skeleton bar */}
            <div className="h-16 bg-white/5 rounded-xl animate-pulse border border-semantic-border/50" />

            {/* Content skeleton bars */}
            <div className="h-10 bg-white/5 rounded-lg animate-pulse border border-semantic-border/50 w-5/6" />
            <div className="h-10 bg-white/5 rounded-lg animate-pulse border border-semantic-border/50 w-10/5" />
            <div className="h-10 bg-white/5 rounded-lg animate-pulse border border-semantic-border/50 w-5/6" />

            {/* Extra space */}
            <div className="pt-2">
              <div className="h-24 bg-white/5 rounded-lg animate-pulse border border-semantic-border/50 w-3/4" />
            </div>
          </div>

          {/* Loading message */}
          {message && (
            <div className="flex items-center justify-center pt-4">
              <span
                className="text-sm text-semantic-text-secondary"
                aria-live="polite"
              >
                {message}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
