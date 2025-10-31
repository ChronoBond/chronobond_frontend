"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { type BondData } from "@/lib/chronobond-service";
import { DollarSign, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface HoldingsRedeemModalProps {
  isOpen: boolean;
  bond: BondData | null;
  isRedeeming?: boolean;
  expectedYield: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  formatFlow: (amount: number) => string;
}

export const HoldingsRedeemModal = ({
  isOpen,
  bond,
  isRedeeming = false,
  expectedYield,
  onClose,
  onConfirm,
  formatFlow,
}: HoldingsRedeemModalProps) => {
  const [status, setStatus] = React.useState<
    "idle" | "confirming" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  if (!isOpen || !bond) return null;

  const totalValue = bond.principal + expectedYield;

  const handleConfirm = async () => {
    setStatus("confirming");
    setErrorMessage("");
    try {
      await onConfirm();
      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to redeem bond"
      );
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDisabled={isRedeeming || status === "confirming"}
    >
      <div className="rounded-2xl bg-semantic-surface p-6 border border-semantic-border shadow-2xl max-w-sm w-full max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-accent border border-semantic-border flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-semantic-text">
                Redeem Bond
              </h3>
              <p className="text-xs text-semantic-text/70">Bond #{bond.id}</p>
            </div>
          </div>
        </div>

        {/* Bond Details */}
        <div className="space-y-3 mb-6">
          <div className="bg-semantic-overlay rounded-lg p-4 border border-semantic-border">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-semantic-text/80 uppercase tracking-wide">
                Principal
              </span>
              <span className="text-lg font-bold text-semantic-text">
                {formatFlow(bond.principal)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-semantic-text/80 uppercase tracking-wide">
                Expected Yield
              </span>
              <span className="text-lg font-bold text-brand-accent">
                +{formatFlow(expectedYield)}
              </span>
            </div>
            <div className="border-t border-semantic-border pt-3 flex justify-between items-center">
              <span className="text-xs font-semibold text-semantic-text uppercase tracking-wide">
                Total Redemption
              </span>
              <span className="text-2xl font-bold text-brand-accent">
                {formatFlow(totalValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Display */}
        {status === "success" && (
          <div className="mb-6 p-4 rounded-lg bg-brand-accent/10 border border-brand-accent/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-brand-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-brand-accent">
                Bond redeemed successfully!
              </p>
              <p className="text-xs text-brand-accent/70">
                Your funds will be transferred to your wallet
              </p>
            </div>
          </div>
        )}

        {status === "error" && errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">
                Redemption failed
              </p>
              <p className="text-xs text-red-400/70">{errorMessage}</p>
            </div>
          </div>
        )}

        {status === "confirming" && (
          <div className="mb-6 p-4 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-brand-primary animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-brand-primary">
                Processing redemption...
              </p>
              <p className="text-xs text-brand-primary/70">
                Please approve the transaction in your wallet
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={
              isRedeeming || status === "confirming" || status === "success"
            }
            className="flex-1"
          >
            {status === "success" ? "Close" : "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              isRedeeming ||
              status === "confirming" ||
              status === "success" ||
              status === "error"
            }
            className="flex-1 gap-2"
          >
            {status === "confirming" && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {status === "success"
              ? "Redeemed"
              : status === "confirming"
              ? "Redeeming..."
              : "Confirm Redemption"}
          </Button>
        </div>

        {/* Warning Note */}
        {status === "idle" && (
          <div className="mt-4 p-3 rounded-lg bg-semantic-accent/10 border border-semantic-accent/30 text-center">
            <span className="text-xs font-semibold text-semantic-accent">
              Real Transaction - Will execute on Flow blockchain
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
