import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-semantic-border bg-semantic-surface px-3 py-2 text-sm text-semantic-text ring-offset-semantic-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder-[var(--input-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 