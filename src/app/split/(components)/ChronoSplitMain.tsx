"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/ui/glass-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TextType } from "@/components/ui/text-type";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StepperItem } from "@/components/ui/stepper-item";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  BarChart3,
  Split,
  DollarSign,
  PieChart,
  Activity,
  Timer,
  Target,
  Shuffle,
  LineChart,
  Layers,
  Clock,
  Shield,
  Rocket,
} from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ChronoSplitMain = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  // GSAP Hero Animation
  useEffect(() => {
    if (!heroRef.current || !titleRef.current || !subtitleRef.current || !ctaRef.current) return;

    const tl = gsap.timeline({ delay: 0.5 });

    // Animate title with scale and fade
    tl.fromTo(
      titleRef.current,
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Animate subtitle
    tl.fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );

    // Animate CTA buttons
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

  // GSAP Stepper Animation
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
      {/* Typography-Led Hero Section */}
      <section ref={heroRef} className="scroll-snap-section min-h-screen flex items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl">
              <Split className="w-10 h-10 text-white" />
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>

        <h1 className="text-hero-lg sm:text-hero-xl lg:text-hero-2xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent tracking-tight">
          <TextType
            text={["ChronoSplit is Coming Soon", "Revolutionary DeFi Innovation", "Split Your Bonds"]}
            typingSpeed={80}
            pauseDuration={2500}
            loop={true}
            showCursor={true}
            className="inline-block"
          />
        </h1>

        <div className="max-w-4xl mx-auto mb-12">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={3}
            blurStrength={8}
            stagger={0.1}
            className="text-body-lg sm:text-body-xl lg:text-subheading-xl text-white/80 leading-relaxed"
          >
            Revolutionary DeFi innovation that splits your ChronoBond NFTs into tradeable Principal and Yield tokens, unlocking unprecedented liquidity and yield optimization strategies.
          </ScrollReveal>
        </div>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" size="lg" className="rounded-full px-12 py-4 text-body-lg font-semibold shadow-2xl hover:scale-105 transition-transform">
              <Timer className="w-5 h-5 mr-2" />
              Launch Q2 2025
            </Button>
          </div>
        </div>
      </section>

      {/* Typography-Led How ChronoSplit Works */}
      <section className="scroll-snap-section py-8">
        <div className="text-center mb-12">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            stagger={0.15}
            className="text-section-lg sm:text-section-xl lg:text-section-2xl font-bold text-white mb-6 tracking-tight"
          >
              How ChronoSplit Works
          </ScrollReveal>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={2}
            blurStrength={6}
            stagger={0.08}
            className="text-body-lg sm:text-body-xl lg:text-body-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your single ChronoBond into two powerful financial instruments
          </ScrollReveal>
                    </div>

        <div ref={stepperRef} className="max-w-4xl mx-auto space-y-16">
          <StepperItem
            icon={Layers}
            title="ChronoBond NFT #1337"
            subtitle="Original Bond Token"
            description="Your time-locked bond containing both principal and future yield potential."
            stepNumber={1}
          >
            <div className="bg-white/5 rounded-lg p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Principal:</span>
                  <span className="font-semibold text-white break-words">10,000 FLOW</span>
                      </div>
                      <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Expected Yield:</span>
                  <span className="font-semibold text-green-400 break-words">1,200 FLOW</span>
                      </div>
                      <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Maturity:</span>
                  <span className="font-semibold text-white break-words">365 days</span>
                      </div>
                      <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Strategy:</span>
                  <span className="font-semibold text-white break-words">FlowStaking</span>
                </div>
              </div>
              <Button disabled variant="secondary" className="w-full mt-2 sm:mt-0">
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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <ArrowRight className="w-12 h-12 text-white" />
              </div>
              <Button disabled variant="primary" size="lg" className="px-10 sm:px-12 py-4 w-full sm:w-auto">
                <Split className="w-6 h-6 mr-3" />
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
            <div className="bg-white/5 rounded-lg p-4 sm:p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Amount:</span>
                <span className="font-semibold text-cyan-400 break-words">10,000 cPT</span>
                </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Redeemable:</span>
                <span className="font-semibold text-white break-words">10,000 FLOW</span>
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
            <div className="bg-white/5 rounded-lg p-4 sm:p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Amount:</span>
                <span className="font-semibold text-green-400 break-words">1,200 cYT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Yield Claim:</span>
                <span className="font-semibold text-white break-words">1,200 FLOW</span>
                  </div>
                </div>
          </StepperItem>
                        </div>
      </section>

      {/* Typography-Led DeFi Strategies Section */}
      <section className="scroll-snap-section py-8">
        <div className="text-center mb-12">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={5}
            blurStrength={10}
            stagger={0.15}
            className="text-section-lg sm:text-section-xl lg:text-section-2xl font-bold text-white mb-6 tracking-tight"
          >
            Unlock New <span className="text-cyan-400">DeFi Strategies</span>
          </ScrollReveal>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={2}
            blurStrength={6}
            stagger={0.08}
            className="text-body-lg sm:text-body-xl lg:text-body-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            ChronoSplit revolutionizes how you interact with time-locked assets, creating liquid markets for both principal and yield
          </ScrollReveal>
              </div>

        {/* Editorial Stepper Flow */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Strategy 1 */}
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-white" />
                  </div>
            <div className="flex-1">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={2}
                blurStrength={6}
                stagger={0.08}
                className="text-subheading-lg sm:text-subheading-xl font-semibold text-white mb-3"
              >
                Sell Your <span className="text-green-400">Yield</span>
              </ScrollReveal>
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={1}
                blurStrength={3}
                stagger={0.03}
                className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch] mb-3"
              >
                Split your bond and sell the Yield Token (cYT) on our upcoming AMM to lock in profits today.
              </ScrollReveal>
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={1}
                blurStrength={2}
                stagger={0.02}
                className="text-caption-lg text-white/70"
              >
                ✓ Instant liquidity for future yields • ✓ Lock in current yield rates • ✓ Diversify your portfolio
              </ScrollReveal>
                    </div>
                  </div>

          {/* Strategy 2 */}
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <DollarSign className="w-8 h-8 text-white" />
                      </div>
            <div className="flex-1">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={2}
                blurStrength={6}
                stagger={0.08}
                className="text-subheading-lg sm:text-subheading-xl font-semibold text-white mb-3"
              >
                Buy Fixed-Rate <span className="text-blue-400">Principal</span>
              </ScrollReveal>
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={1}
                blurStrength={3}
                stagger={0.03}
                className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch] mb-3"
              >
                Purchase Principal Tokens (cPT) at a discount to create a zero-coupon bond strategy.
              </ScrollReveal>
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={1}
                blurStrength={2}
                stagger={0.02}
                className="text-caption-lg text-white/70"
              >
                ✓ Guaranteed principal return • ✓ No yield risk exposure • ✓ Predictable returns
              </ScrollReveal>
                    </div>
                  </div>

          {/* Strategy 3 */}
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <Zap className="w-8 h-8 text-white" />
                        </div>
            <div className="flex-1">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={2}
                blurStrength={6}
                stagger={0.08}
                className="text-subheading-lg sm:text-subheading-xl font-semibold text-white mb-3"
              >
                Speculate & <span className="text-purple-400">Hedge</span>
              </ScrollReveal>
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={1}
                blurStrength={3}
                stagger={0.03}
                className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch] mb-3"
              >
                Trade cYT to speculate on the future of FLOW staking rewards and hedge your positions.
              </ScrollReveal>
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={1}
                blurStrength={2}
                stagger={0.02}
                className="text-caption-lg text-white/70"
              >
                ✓ Leverage yield expectations • ✓ Hedge against rate changes • ✓ Active trading strategies
              </ScrollReveal>
                  </div>
                </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <GlassCard className="frosted-glass">
          <GlassCardContent className="py-20 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Be the First to Experience ChronoSplit
              </h3>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                Join our waitlist to get early access to beta testing and be
                notified when ChronoSplit launches.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button variant="primary" size="lg" className="px-12 py-4 text-lg font-semibold">
                  <Sparkles className="w-6 h-6 mr-3" />
                  Join Beta Waitlist
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-12 py-4 text-lg font-semibold"
                >
                  <Target className="w-6 h-6 mr-3" />
                  Get Notified
                </Button>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </section>
    </div>
  );
};

export default ChronoSplitMain;
