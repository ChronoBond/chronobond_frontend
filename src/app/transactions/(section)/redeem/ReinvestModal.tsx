"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { type BondDetails } from "@/lib/chronobond-service";
import { RotateCcw } from "lucide-react";

interface ReinvestModalProps {
  isOpen: boolean;
  bond: BondDetails | null;
  isReinvesting?: boolean;
  onClose: () => void;
  onConfirm: (
    duration: number,
    yieldRate: number,
    strategyID: string
  ) => Promise<void>;
}

export const ReinvestModal = ({
  isOpen,
  bond,
  isReinvesting = false,
  onClose,
  onConfirm,
}: ReinvestModalProps) => {
  const [duration, setDuration] = React.useState<number>(30);
  const [yieldRate, setYieldRate] = React.useState<number>(8);
  const [strategyID, setStrategyID] = React.useState<string>("FlowStaking");

  const durationOptions = [
    { value: "1", label: "1 Day" },
    { value: "7", label: "1 Week" },
    { value: "30", label: "1 Month" },
    { value: "90", label: "3 Months" },
    { value: "180", label: "6 Months" },
    { value: "365", label: "1 Year" },
  ];

  const strategyOptions = [
    { value: "FlowStaking", label: "Flow Staking (5% APY)" },
    { value: "DeFiYield", label: "DeFi Yield (8.5% APY)" },
    { value: "HighYield", label: "High Yield (15% APY)" },
  ];

  const estimatedYield = bond ? bond.principal * (yieldRate / 100) : 0;

  if (!isOpen || !bond) return null;

  const handleConfirm = async () => {
    await onConfirm(duration, yieldRate, strategyID);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDisabled={isReinvesting}>
      <div className="rounded-2xl bg-semantic-surface p-6 border border-semantic-border shadow-2xl max-w-sm w-full max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-900 border border-semantic-border flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-semantic-text">
                Reinvest Bond
              </h3>
              <p className="text-xs text-semantic-text/70">
                Bond #{bond.bondID}
              </p>
            </div>
          </div>
        </div>

        {/* Current Amount Display */}
        <div className="mb-6 p-4 rounded-lg bg-semantic-overlay border border-semantic-border">
          <p className="text-xs font-semibold text-semantic-text/80 mb-2 uppercase tracking-wide">
            Current Bond Value
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-semantic-accent">
              {bond.principal.toFixed(2)}
            </span>
            <span className="text-lg font-semibold text-semantic-text">
              FLOW
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 mb-6">
          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-semantic-text mb-2 uppercase tracking-wide">
              New Duration
            </label>
            <Select
              value={duration.toString()}
              onValueChange={(v) => setDuration(parseInt(v))}
              placeholder="Select duration"
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Yield Rate */}
          <div>
            <label className="block text-xs font-semibold text-semantic-text mb-2 uppercase tracking-wide">
              Yield Rate (%)
            </label>
            <Input
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={yieldRate}
              onChange={(e) => setYieldRate(parseFloat(e.target.value) || 0)}
              placeholder="Enter yield rate"
              className="w-full"
            />
          </div>

          {/* Strategy */}
          <div>
            <label className="block text-xs font-semibold text-semantic-text mb-2 uppercase tracking-wide">
              Yield Strategy
            </label>
            <Select
              value={strategyID}
              onValueChange={setStrategyID}
              placeholder="Select strategy"
            >
              {strategyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Estimated Yield Display */}
        <div className="mb-6 p-4 rounded-lg bg-semantic-overlay border border-semantic-border">
          <p className="text-xs font-semibold text-semantic-text/80 mb-2 uppercase tracking-wide">
            Estimated Yield
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-semantic-accent">
              +{estimatedYield.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-semantic-text">
              FLOW
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isReinvesting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isReinvesting}
            className="flex-1"
          >
            {isReinvesting ? "Reinvesting..." : "Reinvest"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
