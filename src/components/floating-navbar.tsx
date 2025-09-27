"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowCurrentUser } from "@onflow/kit";
import {
  Clock,
  Wallet,
  LogOut,
  ChevronDown,
  Copy,
  ExternalLink,
  Coins,
  Split,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StaggeredMenu } from "@/components/ui/staggered-menu";
import { formatAddress } from "@/lib/utils";
import Image from "next/image";

interface FloatingNavbarProps {
  className?: string;
}

export function FloatingNavbar({ className }: FloatingNavbarProps) {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    {
      label: "Transactions",
      ariaLabel: "View transactions",
      link: "/transactions",
    },
    { label: "Split", ariaLabel: "ChronoSplit features", link: "/split" },
  ];

  const socialItems = [
    { label: "Twitter", link: "https://twitter.com" },
    { label: "GitHub", link: "https://github.com" },
    { label: "Discord", link: "https://discord.gg" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConnect = () => {
    authenticate();
  };

  const handleDisconnect = () => {
    unauthenticate();
    setShowUserMenu(false);
  };

  const copyAddress = () => {
    if (user?.addr) {
      navigator.clipboard.writeText(user.addr);
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        className
      )}
    >
      <motion.nav
        layout
        className={cn(
          "flex items-center justify-between gap-2 sm:gap-4 border-b border-border/40 bg-background/95 backdrop-blur-xl px-3 sm:px-6 py-3 sm:py-4 shadow-lg transition-all duration-300 w-full max-w-none",
          "bg-card/80 backdrop-blur-xl border-border/30 shadow-xl",
          isScrolled ? "py-2 sm:py-3 shadow-2xl" : "py-3 sm:py-4"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Image
            src="/logo.png"
            alt="ChronoBond Logo"
            width={32}
            height={32}
            className="object-cover rounded-full shadow-lg sm:w-10 sm:h-10 flex-shrink-0"
          />
          <a
            href="/"
            className="hidden sm:block text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent truncate hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
          >
            ChronoBond
          </a>
        </div>

        {/* Right side - Connect Button + Menu */}
        <div className="flex items-center gap-2">
          {/* Wallet Connection */}
          <AnimatePresence mode="wait">
            {user?.loggedIn ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Button
                  variant="outline"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 sm:gap-3 rounded-full bg-background/50 px-2 sm:px-4 py-2 backdrop-blur-sm border-border/40 hover:border-border/60 transition-all duration-200 hover:shadow-lg min-w-0 max-w-[200px] sm:max-w-none"
                >
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0">
                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                      {user.addr ? user.addr.slice(2, 4).toUpperCase() : "??"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-xs sm:text-sm font-medium truncate">
                    {user.addr ? formatAddress(user.addr) : "Connected"}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50 flex-shrink-0" />
                </Button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 sm:w-72 z-50 mx-2 sm:mx-0"
                      >
                        <div className="rounded-lg border border-border/40 bg-card/95 backdrop-blur-xl p-4 shadow-xl">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                  {user.addr
                                    ? user.addr.slice(2, 4).toUpperCase()
                                    : "??"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">
                                  Connected Wallet
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Flow Mainnet
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyAddress}
                                className="w-full justify-start text-left h-8 px-2"
                              >
                                <Copy className="mr-2 h-3 w-3" />
                                Copy Address
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `https://flowscan.org/account/${user.addr}`,
                                    "_blank"
                                  )
                                }
                                className="w-full justify-start text-left h-8 px-2"
                              >
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View on Explorer
                              </Button>

                              <div className="pt-2 border-t border-border/40">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleDisconnect}
                                  className="w-full justify-start text-left h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <LogOut className="mr-2 h-3 w-3" />
                                  Disconnect
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="disconnected"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={handleConnect}
                  variant="outline"
                  size="sm"
                  className="sm-toggle relative inline-flex items-center gap-1 sm:gap-2 rounded-full bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 px-2 sm:px-4 sm:py-4 cursor-pointer text-white font-medium leading-none overflow-visible pointer-events-auto"
                >
                  <span className="hidden sm:inline text-xs sm:text-sm">
                    Connect
                  </span>
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Staggered Menu */}
          <div className="relative">
            <StaggeredMenu
              position="right"
              items={menuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={true}
              menuButtonColor="#fff"
              openMenuButtonColor="#00d4ff"
              changeMenuColorOnOpen={true}
              colors={["#1a1a1a", "#2a2a2a", "#3a3a3a"]}
              logoUrl="/logo.png"
              accentColor="#00d4ff"
              onMenuOpen={() => { /* console.log("Menu opened"); */ }}
              onMenuClose={() => { /* console.log("Menu closed"); */ }}
            />
          </div>
        </div>
      </motion.nav>
    </motion.div>
  );
}
