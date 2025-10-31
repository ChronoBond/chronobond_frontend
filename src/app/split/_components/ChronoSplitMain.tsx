"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { TextType } from "@/components/ui/text-type";
import { StepperItem } from "@/components/ui/stepper-item";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Split,
  DollarSign,
  Timer,
  Target,
  Layers,
  Check,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ChronoSplitMain = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !heroRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !ctaRef.current
    )
      return;

    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      titleRef.current,
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    tl.fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );

    tl.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!stepperRef.current) return;

    gsap.fromTo(
      stepperRef.current.children,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stepperRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section
        ref={heroRef}
        className="scroll-snap-section min-h-screen flex items-center justify-center text-center py-20 lg:py-32"
      >
        <div className="flex flex-col items-center justify-center gap-6 lg:gap-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-semantic-overlay border border-semantic-border text-sm font-medium text-semantic-text mb-4">
            <Sparkles className="w-4 h-4 text-semantic-accent" />
            <span>Coming Soon Q4 2025</span>
          </div>

          <div className="card-hero-icon mb-6">
            <Split className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-hero-title text-center max-w-3xl">
            <TextType
              text={[
                "ChronoSplit is Coming Soon",
                "Revolutionary DeFi Innovation",
                "Split Your Bonds",
              ]}
              typingSpeed={80}
              pauseDuration={2500}
              loop={true}
              showCursor={true}
              className="inline-block"
            />
          </h1>

          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-hero-subtitle text-center text-section-md sm:text-xl  leading-relaxed">
              Revolutionary DeFi innovation that splits your ChronoBond NFTs
              into{" "}
              <span className="font-semibold text-semantic-accent">
                tradeable Principal and Yield tokens
              </span>
              , unlocking unprecedented liquidity and yield optimization
              strategies.
            </p>
          </div>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              variant="default"
              className="!h-12 sm:!h-14 !text-base sm:!text-lg !font-semibold !px-8 sm:!px-12 !py-0 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-brand-500 hover:!bg-brand-600 !text-white !border-0 !ring-0 focus-visible:!ring-0"
              disabled
            >
              <Timer className="mr-2 w-5 h-5" />
              Launch Q4 2025
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-4xl mt-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-semantic-text mb-1">
                Split
              </div>
              <div className="text-xs sm:text-sm text-semantic-muted">
                Principal & Yield
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-semantic-text mb-1">
                Trade
              </div>
              <div className="text-xs sm:text-sm text-semantic-muted">
                On AMM
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-semantic-text mb-1">
                Optimize
              </div>
              <div className="text-xs sm:text-sm text-semantic-muted">
                Your Strategy
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-snap-section py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-section-2xl font-bold text-semantic-text mb-4">
            How ChronoSplit Works
          </h2>
          <p className="text-body-lg text-semantic-muted max-w-3xl mx-auto leading-relaxed">
            Transform your single ChronoBond into two powerful financial
            instruments
          </p>
        </div>

        <div ref={stepperRef} className="max-w-4xl mx-auto space-y-16">
          <StepperItem
            icon={Layers}
            title="ChronoBond NFT #1337"
            subtitle="Original Bond Token"
            description="Your time-locked bond containing both principal and future yield potential."
            stepNumber={1}
          >
            <div className="bg-semantic-overlay rounded-lg p-4 sm:p-6 space-y-4 border border-semantic-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-semantic-text/85 font-medium">
                    Principal:
                  </span>
                  <span className="font-semibold text-semantic-text break-words">
                    10,000 FLOW
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-semantic-text/85 font-medium">
                    Expected Yield:
                  </span>
                  <span className="font-semibold text-semantic-accent break-words">
                    1,200 FLOW
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-semantic-text/85 font-medium">
                    Maturity:
                  </span>
                  <span className="font-semibold text-semantic-text break-words">
                    365 days
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-semantic-text/85 font-medium">
                    Strategy:
                  </span>
                  <span className="font-semibold text-semantic-text break-words">
                    FlowStaking
                  </span>
                </div>
              </div>
              <Button
                disabled
                variant="default"
                className="w-full mt-4 !bg-semantic-overlay hover:!bg-semantic-overlay !text-semantic-text !border !border-semantic-border"
              >
                Select Bond to Split
              </Button>
            </div>
          </StepperItem>

          <StepperItem
            icon={Split}
            title="Split Action"
            subtitle="Transform Your Bond"
            description="Execute the split to separate your bond into two distinct tokens."
            stepNumber={2}
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-semantic-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ArrowRight className="w-10 h-10 text-white" />
              </div>
              <Button
                disabled
                variant="default"
                className="!h-12 !text-base !font-semibold !px-8 sm:!px-12 !py-0 !rounded-lg !shadow-lg !transition-all !duration-300 !bg-semantic-surface !text-semantic-text !border-2 !border-semantic-accent/50 hover:!border-semantic-accent !ring-0 focus-visible:!ring-0 w-full sm:w-auto opacity-75"
              >
                <Split className="w-5 h-5 mr-2" />
                Execute Split (Coming Soon)
              </Button>
            </div>
          </StepperItem>

          <StepperItem
            icon={DollarSign}
            title="Principal Token (cPT)"
            subtitle="Zero-coupon bond token"
            description="Represents the principal amount of your bond, redeemable at maturity."
            stepNumber={3}
          >
            <div className="bg-semantic-overlay rounded-lg p-4 sm:p-6 space-y-4 border border-semantic-border">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-sm text-semantic-text/85 font-medium">
                  Amount:
                </span>
                <span className="font-semibold text-semantic-accent break-words">
                  10,000 cPT
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-sm text-semantic-text/85 font-medium">
                  Redeemable:
                </span>
                <span className="font-semibold text-semantic-text break-words">
                  10,000 FLOW
                </span>
              </div>
            </div>
          </StepperItem>

          <StepperItem
            icon={TrendingUp}
            title="Yield Token (cYT)"
            subtitle="Future yield claim token"
            description="Represents the future yield of your bond, tradeable on secondary markets."
            stepNumber={4}
            isLast={true}
          >
            <div className="bg-semantic-overlay rounded-lg p-4 sm:p-6 space-y-4 border border-semantic-border">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-sm text-semantic-text/85 font-medium">
                  Amount:
                </span>
                <span className="font-semibold text-semantic-accent break-words">
                  1,200 cYT
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-sm text-semantic-text/85 font-medium">
                  Yield Claim:
                </span>
                <span className="font-semibold text-semantic-text break-words">
                  1,200 FLOW
                </span>
              </div>
            </div>
          </StepperItem>
        </div>
      </section>

      <section className="scroll-snap-section py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-semantic-accent blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-semantic-primary blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-section-2xl font-bold text-semantic-text mb-4">
              Unlock New{" "}
              <span className="text-semantic-accent">DeFi Strategies</span>
            </h2>
            <p className="text-body-lg text-semantic-muted max-w-3xl mx-auto leading-relaxed">
              ChronoSplit revolutionizes how you interact with time-locked
              assets, creating liquid markets for both principal and yield
            </p>
          </div>

          <div className="space-y-16 lg:space-y-24 max-w-5xl mx-auto">
            <div className="relative">
              <div className="hidden lg:block absolute left-12 top-24 w-0.5 h-16 bg-semantic-border" />

              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 group">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-semantic-accent flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shadow-lg border-2 border-semantic-surface">
                    <span className="text-xs font-bold text-white">01</span>
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <div className="mb-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-semantic-text mb-2">
                      Sell Your{" "}
                      <span className="text-semantic-accent">Yield</span>
                    </h3>
                    <p className="text-body-lg text-semantic-muted mb-6 leading-relaxed">
                      Split your bond and sell the Yield Token (cYT) on our
                      upcoming AMM to lock in profits today.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-accent/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-accent" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Instant liquidity
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-accent/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-accent" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Lock yield rates
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-accent/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-accent" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Diversify portfolio
                      </span>
                    </div>
                  </div>

                  {/* Token Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-semantic-overlay border border-semantic-border">
                    <div className="w-2 h-2 rounded-full bg-semantic-accent animate-pulse" />
                    <span className="text-sm font-medium text-semantic-text">
                      cYT Token
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute left-12 top-24 w-0.5 h-16 bg-semantic-border" />

              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 group">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-semantic-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shadow-lg border-2 border-semantic-surface">
                    <span className="text-xs font-bold text-white">02</span>
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <div className="mb-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-semantic-text mb-2">
                      Buy Fixed-Rate{" "}
                      <span className="text-semantic-primary">Principal</span>
                    </h3>
                    <p className="text-body-lg text-semantic-muted mb-6 leading-relaxed">
                      Purchase Principal Tokens (cPT) at a discount to create a
                      zero-coupon bond strategy.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-primary" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Guaranteed return
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-primary" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        No yield risk
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-primary/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-primary" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Predictable returns
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-semantic-overlay border border-semantic-border">
                    <div className="w-2 h-2 rounded-full bg-semantic-primary animate-pulse" />
                    <span className="text-sm font-medium text-semantic-text">
                      cPT Token
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 group">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-semantic-accent flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shadow-lg border-2 border-semantic-surface">
                    <span className="text-xs font-bold text-white">03</span>
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <div className="mb-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-semantic-text mb-2">
                      Speculate &{" "}
                      <span className="text-semantic-accent">Hedge</span>
                    </h3>
                    <p className="text-body-lg text-semantic-muted mb-6 leading-relaxed">
                      Trade cYT to speculate on the future of FLOW staking
                      rewards and hedge your positions.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-accent/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-accent" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Leverage yields
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-accent/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-accent" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Hedge positions
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-semantic-overlay border border-semantic-border">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-semantic-accent/20 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-semantic-accent" />
                      </div>
                      <span className="text-sm text-semantic-text font-medium">
                        Active trading
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-semantic-overlay border border-semantic-border">
                    <div className="w-2 h-2 rounded-full bg-semantic-accent animate-pulse" />
                    <span className="text-sm font-medium text-semantic-text">
                      Advanced Trading
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-semantic-surface border-2 border-semantic-border hover:border-semantic-accent transition-all duration-300 shadow-lg hover:shadow-xl p-8 lg:p-12 text-center">
            <div className="max-w-3xl mx-auto space-y-6 lg:space-y-8">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-semantic-accent flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="w-10 h-10 lg:w-12 lg:h-12 text-white animate-pulse" />
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-semantic-text">
                Be the First to Experience{" "}
                <span className="inline-block px-3 py-1 rounded-lg bg-semantic-accent text-white">
                  ChronoSplit
                </span>
              </h3>

              <p className="text-body-lg text-semantic-text/90 max-w-2xl mx-auto leading-relaxed">
                Join our waitlist to get early access to beta testing and be
                notified when ChronoSplit launches.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  variant="default"
                  className="!h-12 sm:!h-14 !text-base sm:!text-lg !font-semibold !px-8 sm:!px-12 !py-0 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-semantic-accent hover:!bg-semantic-accent/90 !text-white !border-0 !ring-0 focus-visible:!ring-0 w-full sm:w-auto"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Join Beta Waitlist
                </Button>
                <Button
                  variant="default"
                  className="!h-12 sm:!h-14 !text-base sm:!text-lg !font-semibold !px-8 sm:!px-12 !py-0 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-semantic-surface hover:!bg-semantic-overlay !text-semantic-text !border-2 !border-semantic-accent/60 hover:!border-semantic-accent !ring-0 focus-visible:!ring-0 w-full sm:w-auto"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Get Notified
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChronoSplitMain;
