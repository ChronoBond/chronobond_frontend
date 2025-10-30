import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Zap, DollarSign, Check } from "lucide-react"

interface TokenSelectorProps {
  token: "FLOW" | "USDC"
  onTokenChange: (token: "FLOW" | "USDC") => void
  disabled?: boolean
}

const TOKEN_ICONS = {
  FLOW: Zap,
  USDC: DollarSign,
}

const TOKEN_INFO = {
  FLOW: {
    symbol: "FLOW",
    color: "from-blue-400 to-cyan-400",
  },
  USDC: {
    symbol: "USDC",
    color: "from-yellow-400 to-yellow-300",
  },
}

export const TokenSelector = React.forwardRef<
  HTMLButtonElement,
  TokenSelectorProps
>(({ token, onTokenChange, disabled = false }, ref) => {
  const [open, setOpen] = React.useState(false)
  const tokenInfo = TOKEN_INFO[token]

  return (
    <div className="relative">
      <button
        ref={ref}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          "border border-white/20 bg-white/5",
          "hover:border-white/40 hover:bg-white/10",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {React.createElement(TOKEN_ICONS[token], { className: "h-5 w-5 text-blue-400" })}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{tokenInfo.symbol}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-white/70 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-full z-50 bg-background border border-white/20 rounded-lg overflow-hidden shadow-lg backdrop-blur-md">
          {Object.entries(TOKEN_INFO).map(([key, info]) => {
            const IconComponent = TOKEN_ICONS[key as "FLOW" | "USDC"]
            return (
              <button
                key={key}
                onClick={() => {
                  onTokenChange(key as "FLOW" | "USDC")
                  setOpen(false)
                }}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-3 transition-all duration-200",
                  "border-b border-white/10 last:border-b-0",
                  key === token
                    ? "bg-white/10 border-l-2 border-l-blue-500"
                    : "hover:bg-white/5"
                )}
              >
                <IconComponent className="h-5 w-5 text-blue-400" />
                <span className="font-medium text-white">{info.symbol}</span>
                {key === token && (
                  <Check className="ml-auto h-4 w-4 text-blue-400" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
})
TokenSelector.displayName = "TokenSelector"
