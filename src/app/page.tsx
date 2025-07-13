"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FloatingNavbar } from "@/components/floating-navbar"
import BondMinting from "@/components/bond-minting"
import HoldingsView from "@/components/holdings-view"
import Marketplace from "@/components/marketplace"
import BondRedemption from "@/components/bond-redemption"
import ChronoSplitComingSoon from "@/components/chronosplit-coming-soon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundGrid, BackgroundDots } from "@/components/ui/background-grid"
import { 
  Coins, 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  Shield, 
  Zap,
  ArrowRight,
  Sparkles,
  Split
} from "lucide-react"

type TabType = "overview" | "mint" | "holdings" | "marketplace" | "redeem" | "split"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: TrendingUp },
    { id: "mint" as TabType, label: "Mint Bonds", icon: Coins },
    { id: "holdings" as TabType, label: "My Holdings", icon: Clock },
    { id: "marketplace" as TabType, label: "Marketplace", icon: ShoppingCart },
    { id: "redeem" as TabType, label: "Redeem Bonds", icon: Shield },
    { id: "split" as TabType, label: "Split", icon: Split },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab setActiveTab={setActiveTab} />
      case "mint":
        return <BondMinting />
      case "holdings":
        return <HoldingsView />
      case "marketplace":
        return <Marketplace />
      case "redeem":
        return <BondRedemption />
      case "split":
        return <ChronoSplitComingSoon />
      default:
        return <OverviewTab setActiveTab={setActiveTab} />
    }
  }

  return (
    <BackgroundDots className="min-h-screen bg-black text-white">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Main Content */}
      <div className="relative pt-20">
        <BackgroundGrid className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        </BackgroundGrid>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <nav className="flex items-center justify-center">
              <div className="flex space-x-1 rounded-full border border-border/40 bg-background/5 backdrop-blur-xl p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className={`
                        relative flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
                        ${activeTab === tab.id 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-full bg-primary"
                          style={{ zIndex: -1 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  )
                })}
              </div>
            </nav>
          </motion.div>

          {/* Tab Content */}
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderTabContent()}
          </motion.main>
        </div>
      </div>
    </BackgroundDots>
  )
}

function OverviewTab({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) {
  const features = [
    {
      icon: Coins,
      title: "Mint Time-Locked Bonds",
      description: "Create bonds with guaranteed yields and customizable lock periods",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      icon: Shield,
      title: "Secure Yield Strategies",
      description: "Choose from low-risk staking to high-yield DeFi strategies",
      color: "from-green-500 to-emerald-500",
      delay: 0.2
    },
    {
      icon: ShoppingCart,
      title: "Trade on Marketplace",
      description: "Buy and sell bonds before maturity in our decentralized marketplace",
      color: "from-purple-500 to-pink-500",
      delay: 0.3
    },
    {
      icon: Zap,
      title: "Automated Compounding",
      description: "Bonds automatically compound yields using smart yield strategies",
      color: "from-orange-500 to-red-500",
      delay: 0.4
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
          <CardContent className="relative z-10 p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                Built on Flow Blockchain
              </div>
              
              <h1 className="mb-6 bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                Welcome to ChronoBond
              </h1>
              
              <p className="mb-8 text-xl text-muted-foreground">
                Create time-locked bonds with guaranteed yields on Flow blockchain. 
                Mint bonds, earn yield through automated strategies, and trade on our marketplace.
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  onClick={() => setActiveTab("mint")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Start Minting Bonds
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group rounded-full border-border/40 bg-background/5 px-8 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-background/10 hover:scale-105"
                  onClick={() => setActiveTab("marketplace")}
                >
                  <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Explore Marketplace
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
            >
              <Card className="group relative h-full overflow-hidden border-border/40 bg-background/20 backdrop-blur-xl transition-all duration-300 hover:border-border/60 hover:bg-background/30">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 rounded-full bg-gradient-to-br ${feature.color} p-3 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Platform Statistics</CardTitle>
            <CardDescription className="text-center">
              Real-time metrics from the ChronoBond protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { label: "Total Bonds", value: "0", color: "from-blue-500 to-cyan-500" },
                { label: "Total Value Locked", value: "0.00 FLOW", color: "from-green-500 to-emerald-500" },
                { label: "Active Listings", value: "0", color: "from-purple-500 to-pink-500" },
                { label: "Yield Range", value: "5-15%", color: "from-orange-500 to-red-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="rounded-lg bg-muted/20 p-6">
                    <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-3xl font-bold text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="border-border/40 bg-background/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Getting Started</CardTitle>
            <CardDescription>
              Follow these simple steps to start earning with ChronoBond
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Connect Your Wallet",
                  description: "Connect your Flow wallet to start interacting with ChronoBond",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  step: "2", 
                  title: "Mint Your First Bond",
                  description: "Choose your principal amount, duration, and yield strategy",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  step: "3",
                  title: "Earn Yield & Trade",
                  description: "Watch your bonds generate yield or trade them on the marketplace",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${item.color} text-white font-bold shadow-lg`}>
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
