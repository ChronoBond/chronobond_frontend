"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'button' | 'avatar';
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'default',
  animate = true 
}) => {
  const baseClasses = "bg-muted/20 rounded";
  
  const variantClasses = {
    default: "h-4 w-full",
    card: "h-32 w-full",
    text: "h-4 w-3/4",
    button: "h-10 w-24",
    avatar: "h-12 w-12 rounded-full"
  };

  const content = (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    />
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ 
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {content}
    </motion.div>
  );
};

// Professional Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 space-y-4", className)}>
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
    <div className="flex space-x-2">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

// Professional Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-20" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 w-20" />
        ))}
      </div>
    ))}
  </div>
);

// Professional Stats Skeleton
export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="text-center">
        <div className="rounded-lg bg-muted/20 p-4 sm:p-6">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

// Professional Feature Grid Skeleton
export const FeatureGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <Skeleton variant="avatar" className="h-12 w-12" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    ))}
  </div>
);

// Professional Hero Skeleton
export const HeroSkeleton: React.FC = () => (
  <div className="text-center space-y-6">
    <Skeleton className="h-6 w-32 mx-auto" />
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-6 w-2/3 mx-auto" />
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Skeleton variant="button" className="h-12 w-40" />
      <Skeleton variant="button" className="h-12 w-40" />
    </div>
  </div>
);

export default Skeleton;
