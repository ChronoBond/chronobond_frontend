"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextType } from "@/components/ui/TextType";
import {
  Coins,
  ShoppingCart,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  Lock,
  Globe,
  Users,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PageMain: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // GSAP Hero Animation
  useEffect(() => {
    if (
      !heroRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !ctaRef.current
    )
      return;

    const tl = gsap.timeline({ delay: 0.5 });

    // Animate title with letter stagger
    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    // Animate subtitle
    tl.fromTo(
      subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );

    // Animate CTA buttons
    tl.fromTo(
      ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    // Stats animation
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Features animation
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.children,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // How it works animation
    if (howItWorksRef.current) {
      gsap.fromTo(
        howItWorksRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  const features = [
    {
      icon: Lock,
      title: "Time-Locked Security",
      description:
        "Bonds are secured by smart contracts with guaranteed time-locked returns",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Predictable Yields",
      description:
        "Fixed interest rates with transparent, auditable return calculations",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Globe,
      title: "Flow Blockchain",
      description:
        "Built on Flow's fast, secure, and environmentally friendly blockchain",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Decentralized marketplace for peer-to-peer bond trading",
      color: "from-orange-400 to-red-500",
    },
  ];

  const valuePropositions = [
    {
      headline: "Engineered for Trust",
      subtext:
        "Every bond is secured by smart contracts with guaranteed integrity.",
      icon: Shield,
      color: "from-green-400 to-emerald-500",
    },
    {
      headline: "Built for People",
      subtext: "Empowering a new generation of investors through open finance.",
      icon: Users,
      color: "from-blue-400 to-cyan-500",
    },
    {
      headline: "Liquidity Without Limits",
      subtext:
        "Trade, split, and manage assets seamlessly in a decentralized marketplace.",
      icon: TrendingUp,
      color: "from-purple-400 to-pink-500",
    },
    {
      headline: "Transparent Yields",
      subtext: "Predictable, auditable returns designed for long-term growth.",
      icon: BarChart3,
      color: "from-orange-400 to-red-500",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20">
      {/* Typography-Led Hero Section */}
      <section
        ref={heroRef}
        className="scroll-snap-section min-h-screen flex items-center justify-center text-center"
      >
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-hero-lg sm:text-hero-xl lg:text-hero-2xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent tracking-tight">
            <TextType
              text={["ChronoBond", "Revolutionary DeFi", "Time-Locked Bonds"]}
              typingSpeed={100}
              pauseDuration={2000}
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
              Revolutionary time-locked DeFi bonds on Flow blockchain. Mint,
              trade, and redeem bonds with guaranteed yields.
            </ScrollReveal>
          </div>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              className="rounded-full px-12 py-4 text-body-lg font-semibold shadow-2xl hover:scale-105 transition-transform"
              onClick={() => router.push("/transactions")}
            >
              Start Trading
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="scroll-snap-section py-8">
        <div className="max-w-6xl mx-auto">
          <div
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {valuePropositions.map((proposition, index) => (
              <GlassCard key={index} className="frosted-glass p-8 text-center">
                <GlassCardContent className="p-0">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${proposition.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <proposition.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-subheading-md sm:text-subheading-lg font-bold text-white mb-3">
                    {proposition.headline}
                  </div>
                  <div className="text-body-md text-white/80 leading-relaxed">
                    {proposition.subtext}
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Typography-Led Features Section */}
      <section className="scroll-snap-section py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
              stagger={0.15}
              className="text-section-lg sm:text-section-xl lg:text-section-2xl font-bold text-white mb-6 tracking-tight"
            >
              Why ChronoBond?
            </ScrollReveal>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={2}
              blurStrength={6}
              stagger={0.08}
              className="text-body-lg sm:text-body-xl lg:text-body-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              Built for the future of DeFi with{" "}
              <span className="text-cyan-400 font-semibold">Security</span>,{" "}
              <span className="text-cyan-400 font-semibold">Transparency</span>,
              and{" "}
              <span className="text-cyan-400 font-semibold">Innovation</span> at
              its core.
            </ScrollReveal>
          </div>

          {/* Editorial Stepper Flow */}
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Lock className="w-8 h-8 text-white" />
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
                  Time-Locked <span className="text-green-400">Security</span>
                </ScrollReveal>
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={1}
                  blurStrength={3}
                  stagger={0.03}
                  className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch]"
                >
                  Bonds are secured by smart contracts with guaranteed
                  time-locked returns and transparent execution.
                </ScrollReveal>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-white" />
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
                  Predictable <span className="text-cyan-400">Yields</span>
                </ScrollReveal>
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={1}
                  blurStrength={3}
                  stagger={0.03}
                  className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch]"
                >
                  Fixed interest rates with transparent, auditable return
                  calculations and guaranteed payouts.
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography-Led How It Works Section */}
      <section className="scroll-snap-section py-16 sm:py-20 pb-32 sm:pb-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
              stagger={0.15}
              className="text-section-lg sm:text-section-xl lg:text-section-2xl font-bold text-white mb-6 tracking-tight"
            >
              How It Works
            </ScrollReveal>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={2}
              blurStrength={6}
              stagger={0.08}
              className="text-body-lg sm:text-body-xl lg:text-body-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              Three simple steps to start earning with time-locked bonds.
            </ScrollReveal>
          </div>

          {/* Editorial Stepper Flow */}
          <div ref={howItWorksRef} className="space-y-16 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Coins className="w-8 h-8 text-white" />
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
                  1. Mint <span className="text-cyan-400">Bonds</span>
                </ScrollReveal>
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={1}
                  blurStrength={3}
                  stagger={0.03}
                  className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch]"
                >
                  Create time-locked bonds with your preferred duration and
                  yield parameters using our intuitive interface.
                </ScrollReveal>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <ShoppingCart className="w-8 h-8 text-white" />
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
                  2. Trade on{" "}
                  <span className="text-purple-400">Marketplace</span>
                </ScrollReveal>
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={1}
                  blurStrength={3}
                  stagger={0.03}
                  className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch]"
                >
                  Buy and sell bonds on our decentralized marketplace for
                  maximum liquidity and competitive pricing.
                </ScrollReveal>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Shield className="w-8 h-8 text-white" />
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
                  3. Redeem & <span className="text-green-400">Earn</span>
                </ScrollReveal>
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={1}
                  blurStrength={3}
                  stagger={0.03}
                  className="text-body-md sm:text-body-lg text-white/80 leading-relaxed max-w-[50ch]"
                >
                  Redeem matured bonds and earn guaranteed yields with full
                  transparency and smart contract security.
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageMain;
