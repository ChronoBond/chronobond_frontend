"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TextType } from "@/components/ui/text-type";
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
      color: "",
    },
    {
      icon: BarChart3,
      title: "Predictable Yields",
      description:
        "Fixed interest rates with transparent, auditable return calculations",
      color: "",
    },
    {
      icon: Globe,
      title: "Flow Blockchain",
      description:
        "Built on Flow's fast, secure, and environmentally friendly blockchain",
      color: "",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Decentralized marketplace for peer-to-peer bond trading",
      color: "",
    },
  ];

  const valuePropositions = [
    {
      headline: "Engineered for Trust",
      subtext:
        "Every bond is secured by smart contracts with guaranteed integrity.",
      icon: Shield,
      color: "",
    },
    {
      headline: "Built for People",
      subtext: "Empowering a new generation of investors through open finance.",
      icon: Users,
      color: "",
    },
    {
      headline: "Liquidity Without Limits",
      subtext:
        "Trade, split, and manage assets seamlessly in a decentralized marketplace.",
      icon: TrendingUp,
      color: "",
    },
    {
      headline: "Transparent Yields",
      subtext: "Predictable, auditable returns designed for long-term growth.",
      icon: BarChart3,
      color: "",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      {/* Enhanced Hero Section */}
      <section ref={heroRef} className="layout-hero py-20 lg:py-32">
        <div className="flex flex-col items-center justify-center gap-6 lg:gap-8">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-semantic-overlay border border-semantic-border text-sm font-medium text-semantic-text mb-4">
            <Zap className="w-4 h-4 text-semantic-accent" />
            <span>Built on Flow Blockchain</span>
          </div>

          {/* Main Icon */}
          <div className="card-hero-icon mb-6">
            <Zap className="w-12 h-12 text-white" />
          </div>

          {/* Hero Title */}
          <h1 className="text-hero-title text-center max-w-5xl">
            <TextType
              text={["ChronoBond", "Revolutionary DeFi", "Time-Locked Bonds"]}
              typingSpeed={100}
              pauseDuration={2000}
              loop={true}
              showCursor={true}
              className="inline-block"
            />
          </h1>

          {/* Hero Subtitle */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-hero-subtitle text-center text-section-md sm:text-xl  leading-relaxed">
              Revolutionary time-locked DeFi bonds on Flow blockchain. Mint,
              trade, and redeem bonds with{" "}
              <span className="font-semibold text-semantic-accent">
                guaranteed yields
              </span>
              .
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              variant="default"
              className="!h-12 sm:!h-14 !text-base sm:!text-lg !font-semibold !px-8 sm:!px-12 !py-0 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-brand-500 hover:!bg-brand-600 !text-white !border-0 !ring-0 focus-visible:!ring-0"
              onClick={() => router.push("/transactions")}
            >
              Start Trading
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="default"
              className="!h-12 sm:!h-14 !text-base sm:!text-lg !font-semibold !px-8 sm:!px-12 !py-0 !rounded-lg !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-semantic-surface hover:!bg-semantic-overlay !text-semantic-text !border-2 !border-semantic-border hover:!border-semantic-accent !ring-0 focus-visible:!ring-0"
              onClick={() => router.push("/transactions?tab=marketplace")}
            >
              Explore Marketplace
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-4xl mt-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-semantic-text mb-1">
                100%
              </div>
              <div className="text-xs sm:text-sm text-semantic-muted">
                Guaranteed Yields
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-semantic-text mb-1">
                $0
              </div>
              <div className="text-xs sm:text-sm text-semantic-muted">
                Hidden Fees
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-semantic-text mb-1">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-semantic-muted">
                Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section - Enhanced Grid */}
      <section className="layout-section py-16 lg:py-24">
        <div className="layout-container">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-section-2xl font-bold text-semantic-text mb-4">
              Why Choose ChronoBond?
            </h2>
            <p className="text-body-lg text-semantic-muted max-w-2xl mx-auto">
              Built for the future of DeFi with Security, Transparency, and
              Innovation at its core.
            </p>
          </div>
          <div
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {valuePropositions.map((proposition, index) => (
              <GlassCard
                key={index}
                className="group hover:scale-105 transition-transform duration-300 p-6 lg:p-8"
              >
                <GlassCardContent className="p-0 text-center">
                  <div className="card-feature-icon mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <proposition.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-subheading-lg font-bold text-semantic-text mb-3">
                    {proposition.headline}
                  </h3>
                  <p className="text-body-md text-semantic-muted leading-relaxed">
                    {proposition.subtext}
                  </p>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced Layout */}
      <section className="layout-section py-16 lg:py-24 bg-semantic-overlay/30 rounded-3xl my-12">
        <div className="layout-container">
          <SectionHeader
            title="Powerful Features"
            subtitle="Everything you need to succeed in decentralized finance."
          />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-12">
            <FeatureStep
              icon={Lock}
              title="Time-Locked Security"
              description="Bonds are secured by smart contracts with guaranteed time-locked returns and transparent execution."
              color=""
            />

            <FeatureStep
              icon={BarChart3}
              title="Predictable Yields"
              description="Fixed interest rates with transparent, auditable return calculations and guaranteed payouts."
              color=""
            />

            <FeatureStep
              icon={Globe}
              title="Flow Blockchain"
              description="Built on Flow's fast, secure, and environmentally friendly blockchain infrastructure."
              color=""
            />

            <FeatureStep
              icon={Users}
              title="Community Driven"
              description="Decentralized marketplace for peer-to-peer bond trading with full community governance."
              color=""
            />
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="layout-section-large py-16 lg:py-24">
        <div className="layout-container">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-section-2xl font-bold text-semantic-text mb-4">
              How It Works
            </h2>
            <p className="text-body-lg text-semantic-muted max-w-2xl mx-auto">
              Three simple steps to start earning with time-locked bonds.
            </p>
          </div>

          <div
            ref={howItWorksRef}
            className="space-y-12 lg:space-y-16 max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8 p-6 lg:p-8 rounded-2xl bg-semantic-surface border-2 border-semantic-border hover:border-semantic-accent transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-semantic-accent flex items-center justify-center shadow-lg flex-shrink-0">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-semantic-accent text-white font-bold text-sm shadow-md">
                      1
                    </span>
                    <h3 className="text-subheading-xl font-bold text-semantic-text">
                      Mint Bonds
                    </h3>
                  </div>
                  <p className="text-body-lg text-semantic-text/90 leading-relaxed">
                    Create time-locked bonds with your preferred duration and
                    yield parameters using our intuitive interface.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8 p-6 lg:p-8 rounded-2xl bg-semantic-surface border-2 border-semantic-border hover:border-semantic-accent transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-semantic-accent flex items-center justify-center shadow-lg flex-shrink-0">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-semantic-accent text-white font-bold text-sm shadow-md">
                      2
                    </span>
                    <h3 className="text-subheading-xl font-bold text-semantic-text">
                      Trade on Marketplace
                    </h3>
                  </div>
                  <p className="text-body-lg text-semantic-text/90 leading-relaxed">
                    Buy and sell bonds on our decentralized marketplace for
                    maximum liquidity and competitive pricing.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8 p-6 lg:p-8 rounded-2xl bg-semantic-surface border-2 border-semantic-border hover:border-semantic-accent transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-semantic-accent flex items-center justify-center shadow-lg flex-shrink-0">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-semantic-accent text-white font-bold text-sm shadow-md">
                      3
                    </span>
                    <h3 className="text-subheading-xl font-bold text-semantic-text">
                      Redeem & Earn
                    </h3>
                  </div>
                  <p className="text-body-lg text-semantic-text/90 leading-relaxed">
                    Redeem matured bonds and earn guaranteed yields with full
                    transparency and smart contract security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16 lg:mt-20">
            <Button
              variant="primary"
              size="lg"
              className="btn-primary-cta text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5"
              onClick={() => router.push("/transactions")}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageMain;
