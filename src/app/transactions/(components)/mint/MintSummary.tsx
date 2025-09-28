"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Clock } from "lucide-react";
import { type MintSummaryProps } from "@/types/mint.types";

export const MintSummary = ({ 
  selectedStrategy, 
  selectedDuration, 
  formData, 
  estimatedYield 
}: MintSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Strategy Details */}
      <div className="reveal-item">
        <Card className="relative overflow-hidden bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {selectedStrategy?.name} Strategy
            </CardTitle>
            <Badge className={`w-fit ${
              selectedStrategy?.riskLevel === 'LOW' ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40' :
              selectedStrategy?.riskLevel === 'MEDIUM' ? 'bg-brand-warning/20 text-brand-warning border-brand-warning/40' :
              'bg-brand-error/20 text-brand-error border-brand-error/40'
            }`}>
              {selectedStrategy?.riskLevel} RISK
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-neutral mb-4">
              {selectedStrategy?.description}
            </p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-accent" />
              <span className="text-brand-accent font-semibold">
                {selectedStrategy?.expectedYield} Expected APY
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yield Calculator */}
      <div className="reveal-item">
        <Card className="relative overflow-hidden bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Yield Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-2xl font-bold text-brand-primary">
                  {formData.amount || "0.00"}
                </div>
                <div className="text-xs text-brand-neutral">
                  Principal
                </div>
              </div>
              <div className="text-center p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-2xl font-bold text-brand-accent">
                  +{estimatedYield}
                </div>
                <div className="text-xs text-brand-neutral">
                  Est. Yield
                </div>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 rounded-lg border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-brand-primary/70 bg-clip-text text-transparent mb-1">
                {(
                  parseFloat(formData.amount || "0") +
                  parseFloat(estimatedYield)
                ).toFixed(4)}{" "}
                FLOW
              </div>
              <div className="text-sm text-brand-neutral">
                Total at Maturity ({selectedDuration?.label})
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
