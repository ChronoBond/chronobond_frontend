"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Squares from "./squares"

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
  return (
    <div className={cn("relative w-full min-h-screen", className)}>
      {/* Animated Squares Background */}
      <div className="fixed inset-0 h-screen w-screen pointer-events-none z-0">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='rgba(255, 255, 255, 0.1)'
          hoverFillColor='rgba(255, 255, 255, 0.05)'
        />
      </div>
      <div className="relative z-10 min-h-screen">
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
    <div className={cn("relative w-full min-h-screen", className)}>
      {/* Animated Squares Background */}
      <div className="fixed inset-0 h-screen w-screen pointer-events-none z-0">
        <Squares 
          speed={0.3} 
          squareSize={30}
          direction='diagonal'
          borderColor='rgba(255, 255, 255, 0.08)'
          hoverFillColor='rgba(255, 255, 255, 0.03)'
        />
      </div>
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
} 