"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
import { authenticateWithFlow, logoutFromFlow } from "@/lib/flow-auth-utils";
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

  const handleConnect = async () => {
    try {
      await authenticateWithFlow();
    } catch (error: any) {
      console.error("Authentication error:", error);
      // Error handling is done in the utility function
    }
  };

  const handleDisconnect = async () => {
    try {
      await logoutFromFlow();
      unauthenticate();
      setShowUserMenu(false);
    } catch (error: any) {
      console.error("Logout error:", error);
      // Still try to disconnect even if logout fails
      unauthenticate();
      setShowUserMenu(false);
    }
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
      className={cn("nav-container", className)}
    >
      <motion.nav
        layout
        className={cn(
          "nav-bar",
          isScrolled ? "py-2 sm:py-3 shadow-2xl" : "py-3 sm:py-4"
        )}
      >
        {/* Logo */}
        <div className="nav-logo-container">
          <Image
            src="/logo.png"
            alt="ChronoBond Logo"
            width={32}
            height={32}
            className="object-cover rounded-full shadow-lg sm:w-10 sm:h-10 flex-shrink-0"
          />
          <Link href="/" className="nav-logo-text">
            ChronoBond
          </Link>
        </div>

        {/* Right side - Connect Button + Menu */}
        <div className="nav-actions">
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
                  className="btn-user-menu"
                >
                  <Avatar className="avatar-user">
                    <AvatarFallback className="avatar-fallback">
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
                        className="menu-dropdown"
                      >
                        <div className="menu-dropdown-content">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                              <Avatar className="avatar-user-large">
                                <AvatarFallback className="avatar-fallback">
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
                                className="menu-item"
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
                                className="menu-item"
                              >
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View on Explorer
                              </Button>

                              <div className="pt-2 border-t border-border/40">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleDisconnect}
                                  className="menu-item-danger"
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
                  className="btn-connect"
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
