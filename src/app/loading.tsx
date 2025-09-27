"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  BackgroundGrid,
  BackgroundDots,
} from "@/components/ui/background-grid";
import Skeleton, {
  HeroSkeleton,
  FeatureGridSkeleton,
  StatsSkeleton,
} from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <BackgroundDots className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="relative pt-16 sm:pt-20">
        <BackgroundGrid className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        </BackgroundGrid>

        <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Hero Section Skeleton */}
            <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
              <CardContent className="p-6 sm:p-8 md:p-12">
                <HeroSkeleton />
              </CardContent>
            </Card>

            {/* Features Grid Skeleton */}
            <FeatureGridSkeleton count={4} />

            {/* Stats Section Skeleton */}
            <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <Skeleton className="h-6 w-48 mx-auto mb-2" />
                  <Skeleton className="h-4 w-64 mx-auto" />
                </div>
                <StatsSkeleton count={4} />
              </CardContent>
            </Card>

            {/* Getting Started Skeleton */}
            <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton variant="avatar" className="h-8 w-8" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </BackgroundDots>
  );
}
