# ChronoBond Frontend 🚀

A revolutionary decentralized finance (DeFi) application built on the Flow blockchain, featuring an immersive editorial-style experience with advanced animations and professional frosted glass design.

## 🌟 Features

### ✨ Reinvestment Status Tracking (Recently Completed) 🎯
Comprehensive auto-reinvestment system with full frontend integration:

**Core Capabilities**:
- ✅ **Query Scheduled Bonds** - Real-time blockchain queries via ReinvestmentRegistry contract
- ✅ **Schedule Auto-Reinvestment** - Enable automatic reinvestment with custom duration & yield strategy
- ✅ **Cancel Scheduled Reinvestment** - Disable auto-reinvestment anytime before execution
- ✅ **Track Reinvestment Status** - Display which bonds are scheduled for auto-reinvestment
- ✅ **Compound Interest Projections** - Calculate multi-period compound returns
- ✅ **Per-Bond Loading States** - Granular state management to prevent duplicate transactions
- ✅ **Real-time Countdown Timers** - Show time remaining until reinvestment execution
- ✅ **Dedicated Dashboard Tab** - "Auto-Reinvesting" tab shows all scheduled bonds with configurations
- ✅ **Custom Reinvestment Parameters** - Choose new duration, yield rate, and strategy after maturity
- ✅ **Portfolio Analytics** - Count and filter bonds by reinvestment status

**Technical Implementation**:
- FCL transaction integration with proper authorization blocks
- Sequential transaction handling (prevents FCL multiple frames error)
- Persistent UI state management with useReducer
- Smart contract integration: `ReinvestmentRegistry` at `0x45722594009505d7` (Flow testnet)

### Core Functionality
- **🔥 Bond Minting**: Create time-locked bonds with customizable durations and yield strategies
- **📊 Portfolio Management**: View and manage your bond holdings with real-time data
- **🛒 Marketplace**: Buy and sell bonds before maturity in a decentralized marketplace
- **💰 Bond Redemption**: Redeem matured bonds and track upcoming maturities with persistent tab state
  - ✨ Persistent tab navigation - tab selection saves via URL query parameters
  - 🔒 Protected redemption - loading states prevent duplicate submissions
  - 🎯 Optimized state management - single useReducer for cleaner logic
- **🔄 Auto-Reinvestment**: Schedule automatic reinvestment of matured bonds with flexible configuration
  - ✅ Schedule auto-reinvestment on pending bonds
  - ⏰ Real-time countdown to reinvestment execution
  - 🔧 Customize duration and yield strategy for reinvestment
  - ❌ Cancel scheduled reinvestment anytime
  - 📊 View reinvestment projections and compound returns
- **🔄 ChronoSplit (Coming Soon)**: Split bonds into Principal Tokens (cPT) and Yield Tokens (cYT)

### Yield Strategies
- **FlowStaking**: Low-risk staking with consistent 5% yields
- **DeFiYield**: Medium-risk DeFi strategies with 8.5% yields  
- **HighYield**: High-risk strategies for maximum 15% returns

### User Experience
- **🎨 Immersive Editorial Design**: Typography-led layout with cinematic animations
- **🪟 Frosted Glass UI**: Professional glassmorphism with adjustable opacity
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **⚡ Smooth Scrolling**: Section-based navigation with scroll snapping
- **🎬 Advanced Animations**: GSAP-powered scroll reveals and typewriter effects
- **🔗 Wallet Integration**: Seamless Flow wallet connection

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Blockchain**: Flow Network
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: GSAP with ScrollTrigger
- **Smooth Scrolling**: Lenis
- **UI Components**: Custom glassmorphism components
- **Flow Integration**: @onflow/fcl, @onflow/kit
- **State Management**: React Hooks + useReducer for consolidated state
- **Linting**: ESLint with core-web-vitals configuration

## � Flow Actions Integration Features

### 1. **One-Click Multi-Asset Minting**
Mint FLOW bonds while paying with alternative tokens like USDC for maximum flexibility.

**Location**: Minting Page / Component

**UI Features**:
- **Dual Input System**: Enter the amount of FLOW you want to bond (e.g., "1000 FLOW")
- **"Pay with" Dropdown**: Select between FLOW (default) and other supported tokens (USDC, etc.)
- **Real-time Quote Fetching**: When selecting USDC, the UI fetches a quote from the backend using `Swapper`'s `quoteIn` function
- **Clear Conversion Display**: Shows exact rate - `"You will pay: ~150.50 USDC for a 1000 FLOW Bond"`
- **Dynamic Button Text**: Button updates to `"Mint with USDC"` when alternative token selected

**Technical Integration**:
- Calls new `mintWithSwap` Flow transaction
- Transaction handles atomic `Source -> Swapper -> Sink` logic
- Integrates with Flow Actions for seamless user experience

---

### 2. **Redeem-to-Any-Token**
Redeem mature FLOW bonds and receive payment in USDC or other supported tokens directly to your wallet.

**Location**: Portfolio Page / "Redeem" Modal

**UI Features**:
- **Redemption Confirmation Modal**: Displays total redemption amount `"You will receive: 1080 FLOW (Principal + Yield)"`
- **"Receive as" Dropdown**: Default FLOW, with options for USDC and other tokens
- **Real-time Quote Fetching**: When selecting USDC, fetches quote using `Swapper`'s `quoteOut` function
- **Final Amount Display**: Shows exact conversion - `"You will receive: ~162.75 USDC"`
- **Smart Button Text**: Updates to `"Redeem to USDC"` based on selected token
- **Loading Protection**: Previous implementation with spinner and disabled buttons prevents double-submission

**Technical Integration**:
- Calls new `redeemAndSwap` Flow transaction
- Supports all mature bonds across different yield strategies
- Atomic swap execution on Flow blockchain

---

### 3. **Cross-Asset Marketplace Trading**
Purchase bonds listed in FLOW by paying with USDC or other supported tokens.

**Location**: Marketplace / "Buy" Modal

**UI Features**:
- **Listing View**: Shows seller's price (e.g., `"Price: 950 FLOW"`) with standard marketplace layout
- **"Buy Now" Confirmation Modal**: Opens when user initiates purchase
- **"Pay with" Dropdown**: Displays user's available token balances (FLOW, USDC, etc.)
- **Exact Quote Calculation**: When selecting USDC, fetches quote using `Swapper`'s `quoteIn` for the *exact* FLOW amount listed
- **Final Cost Display**: Shows conversion - `"You will pay: ~142.00 USDC"`
- **Contextual Button**: Updates to `"Buy with USDC"` when alternative token selected

**Technical Integration**:
- Calls new `buyWithSwap` Flow transaction
- Atomically handles payment, swap, and NFT transfer
- Maintains marketplace integrity with proper escrow and settlement

---

## 🎯 Unified UX Patterns

All three features share consistent design patterns:
- **Real-time Quote Fetching**: All features fetch live quotes from the backend Swapper service
- **Dynamic UI Updates**: Button text and display values update based on selected token
- **Clear User Feedback**: Conversion rates always displayed to prevent surprises
- **Loading States**: Spinner animations and disabled buttons prevent duplicate submissions
- **Token Flexibility**: Users can choose between FLOW and alternative tokens (USDC, etc.)
- **Flow Actions Integration**: All transactions use new Flow Actions-based implementations for atomic operations

---

### 4. **Auto-Reinvestment Status Tracking** (FULLY IMPLEMENTED)
Complete reinvestment management system with blockchain integration.

**Location**: Transactions Page / Redeem Section / "Auto-Reinvesting" Tab

**Backend Integration (10 FCL Methods)**:
1. **checkBondMaturity()** - Query bond maturity status from blockchain
2. **redeemBond()** - Redeem single mature bond
3. **redeemAndSwap()** - Redeem to alternative tokens (FLOW → USDC)
4. **reinvestBond()** - Redeem + immediately reinvest in new bond (atomic)
5. **getRedeemableBonds()** - Query all bonds ready for redemption
6. **getBondsNearingMaturity()** - Get bonds maturing soon (dashboard notifications)
7. **getTotalRedeemableValue()** - Calculate total redemption amount
8. **checkReinvestmentStatus()** - Query ReinvestmentRegistry for scheduled bonds
9. **scheduleReinvestment()** - Enable auto-reinvestment with custom parameters
10. **cancelReinvestment()** - Disable auto-reinvestment for a bond

**UI Components Implemented**:
- **RedeemMain.tsx** - Main container with tab navigation
- **RedeemHeader.tsx** - Statistics showing redeemable value & auto-reinvesting count
- **RedeemTabNavigation.tsx** - Tab switcher with conditional "Auto-Reinvesting" tab (only shows when count > 0)
- **RedeemableBonds.tsx** - Lists bonds ready for redemption with "Redeem" buttons
- **PendingBonds.tsx** - Lists bonds not yet matured with "Schedule Auto-Reinvest" & "Cancel" buttons
- **ScheduledBonds.tsx** (NEW) - Dedicated component for scheduled reinvestment display
- **NotificationsTab.tsx** - Alerts for bonds nearing maturity

**UI Features**:
- 🟢 Green "🔄 Auto-Reinvest Scheduled" badge on scheduled bonds
- ⏰ Real-time countdown timers showing time until reinvestment
- 📊 Configuration display (duration, yield rate, strategy) for scheduled bonds
- 🎯 One-click schedule/cancel buttons with per-bond loading states
- 📈 Compound interest projections (e.g., "In 5 years: 156 FLOW")
- 📱 Mobile responsive with condensed labels
- 🔔 Notification tab for bonds maturing within 24 hours

**Smart Contract Integration**:
- Contract: **ReinvestmentRegistry** at `0x45722594009505d7` (Flow testnet)
- Methods: `getScheduledBondsByOwner()`, `scheduleBond()`, `cancelSchedule()`, `getConfig()`
- Authorization Pattern: Proper Cadence prepare/execute blocks

**State Management**:
- Hook: `useRedeem.ts` with comprehensive reducer
- State properties: `scheduledBonds`, `loadingReinvestStatus`, `schedulingReinvestment`, `cancelingReinvestment`
- Action types for all state mutations
- Per-bond granular loading to prevent duplicate transactions

**Key Technical Achievements**:
- ✅ Sequential transaction handling (solves FCL multiple frames issue)
- ✅ Proper authorization patterns with `prepare` blocks
- ✅ Real-time blockchain queries cached appropriately
- ✅ Error handling with user-friendly toast notifications
- ✅ Type-safe TypeScript implementation (no `any` types)
- ✅ Robust data validation and error recovery

---

## 🔧 Implemented Features Deep Dive

### Service Layer Architecture

**bond-redemption-service.ts** - Complete Redemption & Reinvestment Management (710 lines):

#### Core Redemption Methods
1. **checkBondMaturity(userAddress, bondID)** - Query single bond maturity status
   - Returns: BondMaturityInfo with maturity date, yield, expected total
   - Validates blockchain state before operations
   
2. **redeemBond(bondID)** - Redeem mature bond for principal + yield
   - Validates maturity before transaction
   - Returns transactionId on success
   - Handles errors with user-friendly toast notifications
   
3. **redeemAndSwap(bondID, receiveAsToken)** - Redeem and convert to other tokens
   - Supports FLOW → USDC conversion
   - Atomic transaction execution
   - Real-time quote validation
   
4. **getRedeemableBonds(userAddress)** - Query all bonds ready for redemption
   - Returns: Array of BondMaturityInfo for matured bonds only
   - Filters by maturity status
   - Handles empty collections gracefully
   
5. **getBondsNearingMaturity(userAddress, hoursThreshold)** - Dashboard notifications
   - Returns bonds maturing within specified hours (default 24)
   - Used for alert system
   - Configurable threshold
   
6. **getTotalRedeemableValue(userAddress)** - Portfolio analytics
   - Calculates sum of all expectedTotal for redeemable bonds
   - Used in header statistics
   - Returns 0 on error

#### Reinvestment Management Methods
7. **checkReinvestmentStatus(userAddress)** - Query ReinvestmentRegistry
   - Returns: Dictionary of bondID → ReinvestmentConfig
   - Queries `0x45722594009505d7` contract
   - Handles registry errors gracefully
   
8. **scheduleReinvestment(bondID, duration, yieldRate, strategyID)** - Enable auto-reinvest
   - FCL transaction with proper authorization
   - Prepares transaction with bond maturity validation
   - Supports custom strategy selection (FlowStaking, DeFiYield, HighYield)
   - Returns transactionId on success
   
9. **cancelReinvestment(bondID)** - Disable auto-reinvest
   - FCL transaction with auth checks
   - Calls `cancelSchedule()` on registry contract
   - Prevents transaction errors with prepare block
   
10. **calculateCompoundReturns(principal, yieldRate, periods)** - Projections
    - Projects multi-period compound growth
    - Returns array of {period, value, gain, percentGain}
    - Used in UI to show compound interest

#### Utility Methods
- **formatTimeRemaining(seconds)** - Convert seconds to "2d 5h" format
- **formatCurrency(amount)** - Format to "XXX.XX FLOW"
- **formatDate(timestamp)** - Convert Unix timestamp to readable date

**State Management (useRedeem.ts Hook)**:
- Comprehensive reducer with 20+ action types
- Per-bond loading states to prevent duplicate transactions
- Integrated error handling with auto-clear
- Async actions that update multiple state properties atomically

### State Flow Architecture
```
User clicks "Schedule Auto-Reinvest"
    ↓
schedulingReinvestment[bondID] = true (UI shows loading)
    ↓
FCL transaction sent (proper authorization)
    ↓
Blockchain validates and executes
    ↓
schedulingReinvestment[bondID] = false
    ↓
Refresh reinvestment status
    ↓
UI updates with scheduled badge
```

---

## � Complete Feature Matrix

### Reinvestment Features (Auto-Compound) ✅
- [x] Schedule auto-reinvestment on pending bonds
- [x] Query scheduled bonds from blockchain (ReinvestmentRegistry)
- [x] Cancel scheduled reinvestment anytime
- [x] Display reinvestment configuration (duration, yield, strategy)
- [x] Real-time countdown timers to execution
- [x] Per-bond loading states (prevent duplicate transactions)
- [x] Compound interest projections (multi-period growth)
- [x] Dedicated "Auto-Reinvesting" tab in dashboard
- [x] Auto-reinvesting count in portfolio statistics
- [x] Filter bonds by reinvestment status
- [x] Error handling with transaction status checks

### Redemption Features ✅
- [x] Query bond maturity status from blockchain
- [x] Redeem single mature bond
- [x] Redeem all mature bonds (sequential transactions)
- [x] Redeem to alternative tokens (FLOW → USDC swap)
- [x] Real-time quote fetching for token swaps
- [x] Persistent tab state via URL query parameters
- [x] Total redeemable value calculation
- [x] Bonds nearing maturity notifications (24h threshold)
- [x] Protected redemption (loading states prevent duplicate submissions)
- [x] Yield rate display for each bond
- [x] Expected yield + principal calculations

### Portfolio Management ✅
- [x] View all user bonds
- [x] Filter bonds by maturity status
- [x] Portfolio value aggregation
- [x] Bond lifecycle tracking
- [x] Maturity date display (formatted)
- [x] Time remaining countdown format
- [x] Strategy identification per bond
- [x] Status badges (Redeemable, Pending, Auto-Reinvesting)

### State Management ✅
- [x] useReducer for centralized state
- [x] Per-bond granular loading states
- [x] Error handling and toast notifications
- [x] Success feedback system
- [x] Async action handlers
- [x] Optimistic UI updates
- [x] State persistence via URL params

### UI/UX Components ✅
- [x] RedeemMain master container
- [x] RedeemHeader statistics display
- [x] RedeemTabNavigation tab switcher
- [x] RedeemableBonds component
- [x] PendingBonds component
- [x] ScheduledBonds dedicated display (NEW)
- [x] BondRedemptionCard individual card
- [x] NotificationsTab maturity alerts
- [x] Loading states and spinners
- [x] Mobile responsive design
- [x] Green success state styling
- [x] Accessible UI patterns

### Backend Service Integration ✅
- [x] FCL (Flow Client Library) integration
- [x] Cadence script execution
- [x] Transaction signing and broadcasting
- [x] Query script execution for data fetching
- [x] Error handling with specific messages
- [x] Proper authorization patterns
- [x] Transaction status monitoring
- [x] ReinvestmentRegistry contract (0x45722594009505d7)

### Data Validation & Error Handling ✅
- [x] Bond maturity validation
- [x] Balance checks before operations
- [x] Transaction status verification
- [x] User authorization checks
- [x] Error recovery mechanisms
- [x] Toast notifications for all operations
- [x] Graceful fallbacks on errors
- [x] Type-safe error handling

### Performance & Optimization ✅
- [x] Sequential transaction handling
- [x] Lazy loading for components
- [x] Optimized blockchain queries
- [x] Debounced state updates
- [x] Efficient re-renders

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Flow CLI (for blockchain interactions)
- Flow wallet (e.g., Blocto, Lilico)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd chronobond-frontend
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Start the development server**
```bash
npm run dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                           # Next.js app router
│   ├── (components)/             # Route components
│   │   ├── PageMain.tsx          # Landing page content
│   │   ├── holdings/             # Holdings components
│   │   ├── marketplace/          # Marketplace components
│   │   ├── mint/                 # Mint components
│   │   ├── overview/             # Overview components
│   │   ├── redeem/               # Redeem components with auto-reinvestment
│   │   │   ├── RedeemMain.tsx
│   │   │   ├── RedeemHeader.tsx  # Shows auto-reinvesting count
│   │   │   ├── RedeemTabNavigation.tsx # Conditional "Auto-Reinvesting" tab
│   │   │   ├── PendingBonds.tsx  # Schedule/cancel buttons
│   │   │   └── ScheduledBonds.tsx # NEW - displays scheduled bonds
│   ├── split/                    # Split page route
│   │   └── (components)/         # Split page components
│   │       └── ChronoSplitMain.tsx
│   ├── transactions/             # Transactions page route
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page wrapper
│   ├── globals.css              # Global styles with frosted glass
│   └── metadata.ts              # App metadata
├── components/                   # React components
│   ├── ui/                      # UI components
│   │   ├── glass-card.tsx      # Frosted glass cards
│   │   ├── glass-input.tsx      # Glass input fields
│   │   ├── squares.tsx          # Animated background squares
│   │   ├── ScrollReveal.tsx    # GSAP scroll animations
│   │   ├── TextType.tsx         # Typewriter effects
│   │   ├── stepper-item.tsx     # Editorial stepper
│   │   └── background-grid.tsx  # Animated backgrounds
│   ├── floating-navbar.tsx      # Main navigation
│   └── smooth-scroll-provider.tsx # Smooth scrolling
├── lib/                         # Utility libraries
│   ├── chronobond-service.ts    # Bond operations
│   ├── marketplace-service.ts   # Marketplace logic
│   ├── bond-redemption-service.ts # Redemption + auto-reinvestment
│   │   │                        # Methods: checkReinvestmentStatus(), 
│   │   │                        # scheduleReinvestment(), cancelReinvestment(),
│   │   │                        # calculateCompoundReturns()
│   ├── flow-config.ts          # Flow blockchain configuration
│   └── utils.ts                # Utility functions
├── scripts/                     # Cadence scripts
│   ├── transactions/            # Transaction scripts
│   └── bonds/                   # Bond query scripts
└── types/                       # TypeScript definitions
    ├── chronobond.ts            # App type definitions
    ├── redeem.types.ts          # Redemption types + ReinvestmentConfig
    ├── holding.types.ts
    ├── marketplace.types.ts
    ├── mint.types.ts
    ├── swap.types.ts
```

## 🎯 Key Components

### Landing Page (`PageMain.tsx`)
- **Hero Section**: Full-screen typography with typewriter effects
- **Value Propositions**: Professional copy-driven metrics
- **Features**: Editorial stepper flow with animated reveals
- **How It Works**: 3-step process with GSAP animations

### Split Page (`ChronoSplitMain.tsx`)
- **Hero Section**: Coming soon announcement with dual icons
- **How ChronoSplit Works**: 4-step stepper with detailed explanations
- **DeFi Strategies**: Editorial flow for advanced trading strategies
- **Call to Action**: Beta waitlist and notification signup

### Animation Components
- **ScrollReveal**: Word-by-word scroll animations with blur effects
- **TextType**: Typewriter effects for hero titles
- **SmoothScrollProvider**: Lenis integration with GSAP ScrollTrigger
- **Squares**: Animated background with interactive hover effects

### UI Components
- **GlassCard**: Frosted glass cards with adjustable opacity
- **StepperItem**: Editorial storytelling components
- **BackgroundGrid**: Animated squares with diagonal movement
- **FloatingNavbar**: Responsive navigation with wallet integration

### Transaction Components (Recently Updated)
- **RedeemModal**: Enhanced redemption interface with loading states and spinner animations
  - Prevents duplicate submissions with disabled buttons during processing
  - Shows "Processing..." feedback during async operations
  - Supports token selection (FLOW/USDC) with real-time quote fetching
- **RedeemableBonds**: Lists bonds available for redemption with real-time status
- **Transactions Page**: Tab-based layout with persistent state via URL query parameters
  - Tabs: Mint, Redeem, Marketplace, Holdings
  - State persists across page refreshes using `?tab=` query parameter
  - Smooth navigation with GSAP animations

## 🔧 Configuration

### Flow Network Configuration
The app is configured to work with Flow blockchain. Update `src/lib/flow-config.ts` for different network environments.

### Environment Variables
```bash
# Add to .env.local if needed
NEXT_PUBLIC_FLOW_ACCESS_NODE_API=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn
```

## 🎨 Design System

### Frosted Glass Components
- **GlassCard**: Professional glassmorphism with adjustable opacity
- **GlassInput**: Glass input fields with consistent styling
- **Frosted Glass Background**: CSS variables for opacity control

### Animation System
- **GSAP ScrollTrigger**: Scroll-based animations with one-time triggers
- **Lenis Smooth Scrolling**: Section-based navigation with scroll snapping
- **Typewriter Effects**: Hero title animations with customizable speed
- **Word-by-Word Reveals**: ScrollReveal with blur and rotation effects

### Typography System
- **Hero Headlines**: 64px-80px display fonts with gradient text
- **Section Titles**: 40px-48px with ScrollReveal animations
- **Body Text**: 18px-24px with proper line height and spacing
- **Captions**: 14px-16px for secondary information

### Background System
- **Animated Squares**: Canvas-based moving squares with hover interactions
- **Gradient Overlays**: Layered visual effects for depth
- **Scroll Snap**: Section-based navigation for immersive experience

## 🔄 ChronoSplit (Coming Q4 2025)

The next major feature will allow users to split their bonds into:
- **Principal Tokens (cPT)**: Zero-coupon bond equivalent
- **Yield Tokens (cYT)**: Tradeable future yield claims

### Advanced DeFi Strategies
- **Sell Your Yield**: Lock in profits by selling cYT tokens
- **Buy Fixed-Rate Principal**: Purchase cPT at discount for guaranteed returns
- **Speculate & Hedge**: Trade cYT to speculate on future yield rates

### Implementation Preview
- **4-Step Process**: ChronoBond NFT → Split Action → Principal Token → Yield Token
- **Interactive Demo**: Stepper interface with detailed explanations
- **Strategy Education**: Editorial flow explaining advanced trading concepts

## 📝 Development

### Code Style
- TypeScript with strict type checking
- ESLint with core-web-vitals and react-hooks rules
- Prettier for code formatting
- Modular component architecture with reusable animations
- Consistent naming conventions
- Editorial-first design approach
- React 19 best practices with functional components

### Animation Development
- **GSAP**: ScrollTrigger for scroll-based animations
- **Lenis**: Smooth scrolling with section snapping
- **Custom Components**: ScrollReveal and TextType for reusable effects
- **Performance**: 60fps animations with proper cleanup

### Testing
```bash
npm run build  # Type checking and build validation
npm run lint   # Code linting
npm run dev    # Development server with hot reload
```

### Dependencies
```bash
# Core dependencies
npm install gsap lenis

# Development dependencies
npm install -D @types/node
```

## � Development Best Practices

### State Management
- Use `useReducer` for complex state logic in transaction flows
- Prefer URL query parameters for UI state that should persist
- Keep component state minimal and focused

### Component Loading States
- Always provide loading/disabled states for async operations
- Show visual feedback (spinners, disabled buttons) during operations
- Prevent duplicate submissions with proper state management

### Code Organization
- Keep comments essential and meaningful
- Use descriptive function and variable names instead of relying on comments
- Group related functionality into custom hooks
- Separate business logic from presentation components

### Performance Considerations
- Avoid impure functions in render paths
- Use lazy loading for heavy sections with Suspense
- Optimize metadata and SEO utilities
- Monitor bundle size with tree-shaking optimization

## �🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the development best practices
4. Run `npm run lint` and `npm run build` to validate
5. Submit a pull request

## 🔗 Links

- [Flow Blockchain](https://flow.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Lenis Smooth Scrolling](https://github.com/studio-freight/lenis)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🎨 Design Inspiration

- **Editorial Design**: Typography-led immersive experience
- **Glassmorphism**: Modern frosted glass aesthetic
- **Smooth Scrolling**: Section-based navigation
- **Advanced Animations**: GSAP-powered cinematic effects

---

**Built with ❤️ for the Flow ecosystem**

*Featuring immersive editorial design, professional glassmorphism, and advanced GSAP animations for a truly modern DeFi experience.*
