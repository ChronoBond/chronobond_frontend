"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextType } from "@/components/ui/TextType";
import { FeatureCard } from "@/components/ui/feature-card";
import { FeatureStep } from "@/components/ui/feature-step";
import { SectionHeader } from "@/components/ui/section-header";
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
      <section ref={heroRef} className="layout-hero">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="card-hero-icon">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-hero-title">
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
              className="text-hero-subtitle"
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
              className="btn-primary-cta"
              onClick={() => router.push("/transactions")}
            >
              Start Trading
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="layout-section">
        <div className="layout-container">
          <div ref={statsRef} className="layout-grid-features">
            {valuePropositions.map((proposition, index) => (
              <FeatureCard
                key={index}
                icon={proposition.icon}
                title={proposition.headline}
                description={proposition.subtext}
                color={proposition.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Typography-Led Features Section */}
      <section className="layout-section">
        <div className="layout-container">
          <SectionHeader
            title="Why ChronoBond?"
            subtitle="Built for the future of DeFi with Security, Transparency, and Innovation at its core."
          />

          {/* Editorial Stepper Flow */}
          <div className="space-y-8 layout-container-small">
            <FeatureStep
              icon={Lock}
              title="Time-Locked Security"
              description="Bonds are secured by smart contracts with guaranteed time-locked returns and transparent execution."
              color="from-green-400 to-emerald-500"
            />

            <FeatureStep
              icon={BarChart3}
              title="Predictable Yields"
              description="Fixed interest rates with transparent, auditable return calculations and guaranteed payouts."
              color="from-blue-400 to-cyan-500"
            />
          </div>
        </div>
      </section>

      {/* Typography-Led How It Works Section */}
      <section className="layout-section-large">
        <div className="layout-container">
          <SectionHeader
            title="How It Works"
            subtitle="Three simple steps to start earning with time-locked bonds."
          />

          {/* Editorial Stepper Flow */}
          <div ref={howItWorksRef} className="space-y-16 layout-container-small">
            <FeatureStep
              icon={Coins}
              title="1. Mint Bonds"
              description="Create time-locked bonds with your preferred duration and yield parameters using our intuitive interface."
              color="from-cyan-400 to-blue-500"
            />

            <FeatureStep
              icon={ShoppingCart}
              title="2. Trade on Marketplace"
              description="Buy and sell bonds on our decentralized marketplace for maximum liquidity and competitive pricing."
              color="from-purple-400 to-pink-500"
            />

            <FeatureStep
              icon={Shield}
              title="3. Redeem & Earn"
              description="Redeem matured bonds and earn guaranteed yields with full transparency and smart contract security."
              color="from-green-400 to-emerald-500"
              className="layout-flex-feature-large"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageMain;
