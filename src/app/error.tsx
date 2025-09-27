"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BackgroundGrid,
  BackgroundDots,
} from "@/components/ui/background-grid";
import {
  Home,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Bug,
} from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
      
      if (heroRef.current) {
        tl.fromTo(heroRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8 },
          "-=0.4"
        );
      }
      
      if (iconRef.current) {
        tl.fromTo(iconRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6"
        );
      }
      
      if (messageRef.current) {
        tl.fromTo(messageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );
      }
      
      if (buttonsRef.current) {
        tl.fromTo(buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2"
        );
      }
      
      if (helpRef.current) {
        tl.fromTo(helpRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.1"
        );
      }
    }
  }, []);

  return (
    <BackgroundDots className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="relative pt-16 sm:pt-20">
        <BackgroundGrid className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20" />
        </BackgroundGrid>

        <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div ref={containerRef} className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-4xl">
              {/* Error Hero Section */}
              <div ref={heroRef} className="text-center mb-12">
                <Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10" />
                  <CardContent className="relative z-10 p-6 sm:p-8 md:p-12">
                    {/* Error Icon */}
                    <div ref={iconRef} className="mb-6">
                      <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 mb-6">
                        <Bug className="h-4 w-4" />
                        <span className="text-sm font-medium">Application Error</span>
                      </div>
                      
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    {/* Error Message */}
                    <div ref={messageRef} className="mb-8">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                        Something went wrong!
                      </h2>
                      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                        We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working to fix it.
                      </p>
                      
                      {/* Error Details (only in development) */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left max-w-2xl mx-auto">
                          <p className="text-sm text-red-400 font-mono">
                            {error.message}
                          </p>
                          {error.digest && (
                            <p className="text-xs text-red-300 mt-2">
                              Error ID: {error.digest}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={reset}
                        size="lg"
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                          Try Again
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="group rounded-full border-border/40 bg-background/5 px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-sm transition-all duration-300 hover:bg-background/10 hover:scale-105"
                      >
                        <Link href="/">
                          <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
                          Go Home
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Help Section */}
              <div ref={helpRef}>
                <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Need Help?</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      If this error persists, please contact our support team with the error details above.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-border/40 bg-background/5 backdrop-blur-sm"
                      >
                        <Link href="mailto:support@chronobond.com">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Report Issue
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-border/40 bg-background/5 backdrop-blur-sm"
                      >
                        <Link href="/">
                          <Home className="mr-2 h-4 w-4" />
                          Back to ChronoBond
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundDots>
  );
}
