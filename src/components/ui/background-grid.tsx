"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface BackgroundGridProps {
  children: React.ReactNode
  className?: string
  gridSize?: number
  strokeDasharray?: string
  strokeWidth?: number
  fade?: boolean
}

export function BackgroundGrid({
  children,
  className,
  gridSize = 50,
  strokeDasharray = "0",
  strokeWidth = 1,
  fade = true
}: BackgroundGridProps) {
  const svgPatternId = React.useId()
  
  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute inset-0 h-full w-full">
        <svg className="h-full w-full">
          <defs>
            <pattern
              id={svgPatternId}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M.5 ${gridSize}V.5H${gridSize}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                className="text-gray-300/30 dark:text-gray-700"
              />
            </pattern>
            {fade && (
              <radialGradient id={`${svgPatternId}-fade`}>
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            )}
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${svgPatternId})`}
            mask={fade ? `url(#${svgPatternId}-fade)` : undefined}
          />
        </svg>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export function BackgroundDots({
  children,
  className,
  dotSize = 1,
  dotColor = "rgb(100 116 139 / 0.5)"
}: {
  children: React.ReactNode
  className?: string
  dotSize?: number
  dotColor?: string
}) {
  return (
    <div 
      className={cn("relative w-full", className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 