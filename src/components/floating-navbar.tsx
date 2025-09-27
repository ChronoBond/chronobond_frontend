"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFlowCurrentUser } from "@onflow/kit"
import { Clock, Wallet, LogOut, ChevronDown, Copy, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatAddress } from "@/lib/utils"
import Image from "next/image"

interface FloatingNavbarProps {
  className?: string
}

export function FloatingNavbar({ className }: FloatingNavbarProps) {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleConnect = () => {
    authenticate()
  }

  const handleDisconnect = () => {
    unauthenticate()
    setShowUserMenu(false)
  }

  const copyAddress = () => {
    if (user?.addr) {
      navigator.clipboard.writeText(user.addr)
    }
  }

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
          "flex items-center justify-between gap-4 border-b border-border/40 bg-background/95 backdrop-blur-xl px-6 py-4 shadow-lg transition-all duration-300 w-full",
          "bg-card/80 backdrop-blur-xl border-border/30 shadow-xl",
          isScrolled ? "py-3 shadow-2xl" : "py-4"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png"
            alt="ChronoBond Logo"
            width={40}
            height={40}
            className="object-cover rounded-full shadow-lg"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            ChronoBond
          </span>
        </div>

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
                className="flex items-center gap-3 rounded-full bg-background/50 px-4 py-2 backdrop-blur-sm border-border/40 hover:border-border/60 transition-all duration-200 hover:shadow-lg"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                    {user.addr ? user.addr.slice(2, 4).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {user.addr ? formatAddress(user.addr) : "Connected"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
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
                      className="absolute right-0 top-full mt-2 w-64 z-50"
                    >
                      <div className="rounded-lg border border-border/40 bg-card/95 backdrop-blur-xl p-4 shadow-xl">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                {user.addr ? user.addr.slice(2, 4).toUpperCase() : "??"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">Connected Wallet</div>
                              <div className="text-xs text-muted-foreground">Flow Mainnet</div>
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
                              onClick={() => window.open(`https://flowscan.org/account/${user.addr}`, '_blank')}
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
                className="rounded-full bg-background/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              >
                <Wallet className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Connect Wallet</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.div>
  )
} 