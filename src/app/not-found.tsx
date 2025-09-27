"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BackgroundGrid,
  BackgroundDots,
} from "@/components/ui/background-grid";
import {
  Home,
  ArrowLeft,
  Search,
  AlertTriangle,
  Sparkles,
  Coins,
  TrendingUp,
  ShoppingCart,
  Clock,
  Shield,
  Split,
} from "lucide-react";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const quickLinks = [
    { id: "overview", label: "Overview", icon: TrendingUp, href: "/" },
    { id: "mint", label: "Mint Bonds", icon: Coins, href: "/#mint" },
    { id: "holdings", label: "My Holdings", icon: Clock, href: "/#holdings" },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart, href: "/#marketplace" },
    { id: "redeem", label: "Redeem Bonds", icon: Shield, href: "/#redeem" },
    { id: "split", label: "Split", icon: Split, href: "/#split" },
  ];

  useEffect(() => {
    if (containerRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(containerRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
      
      if (heroRef.current) {
        tl.fromTo(heroRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8 },
          "-=0.4"
        );
      }
      
      if (numberRef.current) {
        tl.fromTo(numberRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.6"
        );
      }
      
      if (messageRef.current) {
        tl.fromTo(messageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );
      }
      
      if (buttonsRef.current) {
        tl.fromTo(buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2"
        );
      }
      
      if (linksRef.current) {
        tl.fromTo(linksRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.1"
        );
      }
      
      if (helpRef.current) {
        tl.fromTo(helpRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.1"
        );
      }
    }
  }, []);

  return (
    <BackgroundDots className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="relative pt-16 sm:pt-20">
        <BackgroundGrid className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        </BackgroundGrid>

        <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div ref={containerRef} className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-4xl">
              {/* 404 Hero Section */}
              <div ref={heroRef} className="text-center mb-12">
                <Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10" />
                  <CardContent className="relative z-10 p-6 sm:p-8 md:p-12">
                    {/* 404 Number */}
                    <div ref={numberRef} className="mb-6">
                      <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Page Not Found</span>
                      </div>
                      
                      <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
                        404
                      </h1>
                    </div>

                    {/* Error Message */}
                    <div ref={messageRef} className="mb-8">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                        Oops! Page Not Found
                      </h2>
                      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
                        Let&apos;s get you back on track with ChronoBond.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        asChild
                        size="lg"
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      >
                        <Link href="/">
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                            Go Home
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="group rounded-full border-border/40 bg-background/5 px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-sm transition-all duration-300 hover:bg-background/10 hover:scale-105"
                      >
                        <Link href="javascript:history.back()">
                          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
                          Go Back
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Links Section */}
              <div ref={linksRef} className="mb-12">
                <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Quick Navigation
                    </CardTitle>
                    <CardDescription>
                      Explore these popular sections of ChronoBond
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {quickLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                          <div key={link.id}>
                            <Button
                              asChild
                              variant="ghost"
                              className="w-full h-auto p-4 justify-start hover:bg-muted/50 transition-all duration-200"
                            >
                              <Link href={link.href}>
                                <div className="flex items-center gap-3">
                                  <div className="rounded-full bg-primary/10 p-2">
                                    <Icon className="h-4 w-4 text-primary" />
                                  </div>
                                  <span className="font-medium">{link.label}</span>
                                </div>
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Help Section */}
              <div ref={helpRef}>
                <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Search className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Still can&apos;t find what you&apos;re looking for?</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Try searching for the page you need or contact our support team for assistance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-border/40 bg-background/5 backdrop-blur-sm"
                      >
                        <Link href="/">
                          <Search className="mr-2 h-4 w-4" />
                          Search ChronoBond
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-border/40 bg-background/5 backdrop-blur-sm"
                      >
                        <Link href="mailto:support@chronobond.com">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Contact Support
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundDots>
  );
}
