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
    <div className={className}>
      <Card className="card-professional">
        <CardContent className="p-12">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-lg">{message}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
