"use client";

import { Suspense, lazy, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useFlowCurrentUser } from "@onflow/kit";
import { useMint } from "./useMint";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

// Lazy load components for better performance
const MintWalletPrompt = lazy(() => import("./MintWalletPrompt").then(module => ({ default: module.MintWalletPrompt })));
const MintForm = lazy(() => import("./MintForm").then(module => ({ default: module.MintForm })));
const MintSummary = lazy(() => import("./MintSummary").then(module => ({ default: module.MintSummary })));
const MintTransactionStatus = lazy(() => import("./MintTransactionStatus").then(module => ({ default: module.MintTransactionStatus })));

const MintMain = () => {
  const { user } = useFlowCurrentUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const {
    formData,
    txStatus,
    selectedStrategy,
    selectedDuration,
    estimatedYield,
    handleInputChange,
    handleMintBond,
    yieldStrategies,
    durationOptions
  } = useMint();

  useEffect(() => {
    if (containerRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      
      if (headerRef.current) {
        tl.fromTo(headerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        );
      }
      
      if (formRef.current) {
        tl.fromTo(formRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        );
      }
      
      if (summaryRef.current) {
        tl.fromTo(summaryRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.1"
        );
      }
    }
  }, []);

  // Reveal animation when component mounts
  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.reveal-item');
    if (elements && elements.length > 0) {
      gsap.fromTo(elements, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, []);

  if (!user?.loggedIn) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MintWalletPrompt />
      </Suspense>
    );
  }

  return (
    <div ref={containerRef} className="app-container max-w-6xl mx-auto">
      <Card className="reveal-item relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10">
        <CardHeader className="text-center">
          <div ref={headerRef} className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-brand-primary/70 bg-clip-text text-transparent">
                Mint ChronoBond
              </CardTitle>
              <CardDescription className="text-lg text-brand-neutral">
                Create time-locked bonds with guaranteed yields
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div ref={formRef}>
              <Suspense fallback={<div>Loading form...</div>}>
                <MintForm
                  formData={formData}
                  txStatus={txStatus}
                  onInputChange={handleInputChange}
                  onMintBond={handleMintBond}
                  yieldStrategies={yieldStrategies}
                  durationOptions={durationOptions}
                />
              </Suspense>
            </div>

            {/* Right Column - Strategy Details and Yield Calculator */}
            <div ref={summaryRef}>
              <Suspense fallback={<div>Loading summary...</div>}>
                <MintSummary
                  selectedStrategy={selectedStrategy}
                  selectedDuration={selectedDuration}
                  formData={formData}
                  estimatedYield={estimatedYield}
                />
              </Suspense>
            </div>
          </div>

          {/* Transaction Status */}
          <Suspense fallback={<div>Loading transaction status...</div>}>
            <MintTransactionStatus txStatus={txStatus} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default MintMain;