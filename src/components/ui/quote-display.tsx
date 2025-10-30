import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Loader2 } from "lucide-react"

interface QuoteDisplayProps {
  fromToken: "FLOW" | "USDC"
  toToken: "FLOW" | "USDC"
  fromAmount: string | number
  toAmount: string | null
  loading?: boolean
  label?: string
}

export const QuoteDisplay = React.forwardRef<
  HTMLDivElement,
  QuoteDisplayProps
>(({ fromToken, toToken, fromAmount, toAmount, loading = false, label }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-lg overflow-hidden p-4 transition-all duration-300",
        "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
        "border border-white/20",
        "backdrop-blur-md"
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

      <div className="relative z-10">
        {label && (
          <p className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wide">
            {label}
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          {/* From */}
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-1">From</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {fromAmount}
              </span>
              <span className="text-sm font-semibold text-white/70">{fromToken}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 px-2">
            <ArrowRight className="h-5 w-5 text-white/40" />
          </div>

          {/* To */}
          <div className="flex-1 text-right">
            <p className="text-xs text-white/50 mb-1">To</p>
            <div className="flex items-baseline justify-end gap-2">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  <span className="text-sm text-white/70">Fetching...</span>
                </div>
              ) : toAmount ? (
                <>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {toAmount}
                  </span>
                  <span className="text-sm font-semibold text-white/70">{toToken}</span>
                </>
              ) : (
                <span className="text-sm text-white/50">—</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
QuoteDisplay.displayName = "QuoteDisplay"
