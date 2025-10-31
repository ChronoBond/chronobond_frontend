"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Coins,
  Loader2,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { type MintFormProps } from "@/types/mint.types";

export const MintForm = ({
  formData,
  txStatus,
  onInputChange,
  onMintBond,
  yieldStrategies,
  durationOptions,
  paymentToken = "FLOW",
  onPaymentTokenChange,
  usdcQuote = null,
}: MintFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Principal Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
            <Input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => onInputChange("amount", e.target.value)}
              className="pl-10 pr-16 text-lg h-12 bg-white/5 border-white/20 text-white placeholder:text-white/50"
              min="0"
              step="0.01"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-white/70 bg-white/10 px-2 py-1 rounded">
              FLOW
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Pay with</label>
          <Select
            value={paymentToken}
            onValueChange={(value) =>
              onPaymentTokenChange?.(value as "FLOW" | "USDC")
            }
          >
            <option value="FLOW">FLOW (default)</option>
            <option value="USDC">MockUSDC</option>
          </Select>
        </div>

        {paymentToken === "USDC" && (
          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/70 mb-1">Swap Quote</div>
                <div className="text-lg font-bold text-white">
                  {usdcQuote ? (
                    <span>{usdcQuote}</span>
                  ) : (
                    <span className="text-white/50">Calculating...</span>
                  )}
                </div>
                <div className="text-xs text-white/60 mt-2">
                  Rate: 1 USDC = 10 FLOW
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/70 mb-1">You receive</div>
                <div className="text-lg font-bold text-brand-primary">
                  {formData.amount ? `${formData.amount} FLOW` : "0 FLOW"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-2">
            Yield Strategy
          </label>
          <Select
            value={formData.strategyID}
            onValueChange={(value) => onInputChange("strategyID", value)}
          >
            {yieldStrategies.map((strategy) => (
              <option key={strategy.name} value={strategy.name}>
                {strategy.name} - {strategy.expectedYield}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Lock-up Period
          </label>
          <Select
            value={formData.lockupPeriod.toString()}
            onValueChange={(value) =>
              onInputChange("lockupPeriod", parseInt(value))
            }
          >
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value.toString()}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Button
          onClick={onMintBond}
          disabled={
            !formData.amount ||
            parseFloat(formData.amount) <= 0 ||
            ["checking", "setup", "minting", "success", "error"].includes(
              txStatus.state
            )
          }
          className="w-full btn-primary h-12 text-lg"
          size="lg"
        >
          {txStatus.state === "checking" && (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Checking Account...
            </>
          )}
          {txStatus.state === "setup" && (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Setting Up Account...
            </>
          )}
          {txStatus.state === "minting" && (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Minting Bond...
            </>
          )}
          {txStatus.state === "idle" && (
            <>
              <Coins className="w-5 h-5 mr-2" />
              {paymentToken === "USDC" ? "Mint with MockUSDC" : "Mint Bond"}
            </>
          )}
          {txStatus.state === "success" && (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Bond Minted!
            </>
          )}
          {txStatus.state === "error" && (
            <>
              <AlertCircle className="w-5 h-5 mr-2" />
              Retry
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
