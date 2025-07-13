"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Layers
} from "lucide-react"

export default function ChronoSplitComingSoon() {
  return (
    <div className="app-container space-y-12">
      {/* Main Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Card className="card-professional">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Split className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold gradient-text mb-4">
              Yield Trading is Evolving
            </CardTitle>
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-primary bg-clip-text text-transparent mb-6">
              ChronoSplit is Coming Soon
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionary DeFi innovation that splits your ChronoBond NFTs into tradeable Principal and Yield tokens, 
              unlocking unprecedented liquidity and yield optimization strategies.
            </CardDescription>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Badge variant="info" className="text-lg px-6 py-2">
                <Timer className="w-4 h-4 mr-2" />
                Launch Q2 2025
              </Badge>
              <Badge variant="success" className="text-lg px-6 py-2">
                <Target className="w-4 h-4 mr-2" />
                Beta Access Available
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Split Process Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text text-center mb-2">
              How ChronoSplit Works
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Transform your single ChronoBond into two powerful financial instruments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
              {/* Original ChronoBond */}
              <div className="lg:col-span-2">
                <Card className="relative bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-xl">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl text-primary">ChronoBond NFT #1337</CardTitle>
                    <CardDescription>Original Bond Token</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-background/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Principal:</span>
                        <span className="font-semibold">10,000 FLOW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Expected Yield:</span>
                        <span className="font-semibold text-success">1,200 FLOW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Maturity:</span>
                        <span className="font-semibold">365 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Strategy:</span>
                        <span className="font-semibold">FlowStaking</span>
                      </div>
                    </div>
                    <Button disabled className="w-full" variant="outline">
                      Select Bond to Split
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Split Arrow */}
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-center">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      SPLIT
                    </span>
                  </div>
                </div>
              </div>

              {/* Split Results */}
              <div className="lg:col-span-2 space-y-4">
                {/* Principal Token */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-blue-600">Principal Token (cPT)</CardTitle>
                        <CardDescription className="text-sm">Zero-coupon bond token</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-background/50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="font-semibold text-blue-600">10,000 cPT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Redeemable:</span>
                        <span className="font-semibold">10,000 FLOW</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Yield Token */}
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 border-green-500/20 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-green-600">Yield Token (cYT)</CardTitle>
                        <CardDescription className="text-sm">Future yield claim token</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-background/50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="font-semibold text-green-600">1,200 cYT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Yield Claim:</span>
                        <span className="font-semibold">1,200 FLOW</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button disabled size="lg" className="px-8 py-6 text-lg">
                <Split className="w-5 h-5 mr-2" />
                Execute Split (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">Unlock New DeFi Strategies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ChronoSplit revolutionizes how you interact with time-locked assets, creating liquid markets for both principal and yield
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="card-professional h-full hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-green-600">Sell Your Yield</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-4">
                  Split your bond and sell the Yield Token (cYT) on our upcoming AMM to lock in profits today.
                </CardDescription>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Instant liquidity for future yields</li>
                  <li>✓ Lock in current yield rates</li>
                  <li>✓ Diversify your portfolio</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="card-professional h-full hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-blue-600">Buy Fixed-Rate Principal</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-4">
                  Purchase Principal Tokens (cPT) at a discount to create a zero-coupon bond strategy.
                </CardDescription>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Guaranteed principal return</li>
                  <li>✓ No yield risk exposure</li>
                  <li>✓ Predictable returns</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="card-professional h-full hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Speculate & Hedge
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base mb-4">
                  Trade cYT to speculate on the future of FLOW staking rewards and hedge your positions.
                </CardDescription>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Leverage yield expectations</li>
                  <li>✓ Hedge against rate changes</li>
                  <li>✓ Active trading strategies</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Future of ChronoSplit Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">The Future of ChronoSplit</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building a comprehensive ecosystem for yield optimization and principal/yield trading
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AMM / Liquidity Pools Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="card-professional relative">
              <div className="absolute -top-3 -right-3 z-10">
                <Badge variant="info" className="text-sm px-3 py-1 shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Shuffle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AMM & Liquidity Pools</CardTitle>
                    <CardDescription>Seamless token swapping and liquidity provision</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Swap Tokens</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">From</label>
                        <div className="flex gap-2">
                          <Input disabled placeholder="100.0" className="flex-1" />
                          <Button disabled variant="outline" size="sm">
                            cYT
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">To</label>
                        <div className="flex gap-2">
                          <Input disabled placeholder="95.2" className="flex-1" />
                          <Button disabled variant="outline" size="sm">
                            FLOW
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button disabled className="w-full mt-4">
                      Swap Tokens
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="text-muted-foreground">Liquidity Pool</div>
                      <div className="font-semibold">cYT/FLOW</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="text-muted-foreground">APY</div>
                      <div className="font-semibold text-success">12.5%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics & Portfolio Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card className="card-professional relative">
              <div className="absolute -top-3 -right-3 z-10">
                <Badge variant="warning" className="text-sm px-3 py-1 shadow-lg">
                  <Activity className="w-3 h-3 mr-1" />
                  In Development
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Analytics & Portfolio</CardTitle>
                    <CardDescription>Advanced portfolio tracking and yield analytics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock Chart */}
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Yield Performance</h4>
                    <div className="h-32 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg flex items-end justify-around p-4">
                      <div className="w-8 bg-gradient-to-t from-primary to-primary/80 rounded-t" style={{height: '60%'}}></div>
                      <div className="w-8 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t" style={{height: '80%'}}></div>
                      <div className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t" style={{height: '70%'}}></div>
                      <div className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '90%'}}></div>
                      <div className="w-8 bg-gradient-to-t from-pink-500 to-pink-400 rounded-t" style={{height: '65%'}}></div>
                    </div>
                  </div>
                  
                  {/* Portfolio Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <PieChart className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Total Portfolio</span>
                      </div>
                      <div className="text-lg font-bold">$45,230</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <LineChart className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">Yield Earned</span>
                      </div>
                      <div className="text-lg font-bold text-success">+$2,340</div>
                    </div>
                  </div>

                  {/* Strategy Allocation */}
                  <div className="bg-background/50 rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Strategy Allocation</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-sm">Principal Tokens</span>
                        </div>
                        <span className="text-sm font-semibold">60%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Yield Tokens</span>
                        </div>
                        <span className="text-sm font-semibold">40%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <Card className="card-professional">
          <CardContent className="py-12">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold gradient-text">
                Be the First to Experience ChronoSplit
              </h3>
              <p className="text-lg text-muted-foreground">
                Join our waitlist to get early access to beta testing and be notified when ChronoSplit launches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button disabled size="lg" className="px-8 py-6">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Join Beta Waitlist
                </Button>
                <Button disabled variant="outline" size="lg" className="px-8 py-6">
                  <Target className="w-5 h-5 mr-2" />
                  Get Notified
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 