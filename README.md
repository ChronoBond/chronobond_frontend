# ChronoBond Frontend 🚀

A revolutionary decentralized finance (DeFi) application built on the Flow blockchain, featuring an immersive editorial-style experience with advanced animations and professional frosted glass design.

## 🌟 Features

### Core Functionality
- **🔥 Bond Minting**: Create time-locked bonds with customizable durations and yield strategies
- **📊 Portfolio Management**: View and manage your bond holdings with real-time data
- **🛒 Marketplace**: Buy and sell bonds before maturity in a decentralized marketplace
- **💰 Bond Redemption**: Redeem matured bonds and track upcoming maturities with persistent tab state
  - ✨ Persistent tab navigation - tab selection saves via URL query parameters
  - 🔒 Protected redemption - loading states prevent duplicate submissions
  - 🎯 Optimized state management - single useReducer for cleaner logic
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
│   │   ├── redeem/               # Redeem components
│   │   └── split/                # Split components
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
│   ├── bond-redemption-service.ts # Redemption logic
│   ├── flow-config.ts          # Flow blockchain configuration
│   └── utils.ts                # Utility functions
├── scripts/                     # Cadence scripts
│   ├── transactions/            # Transaction scripts
│   └── bonds/                   # Bond query scripts
└── types/                       # TypeScript definitions
    └── chronobond.ts            # App type definitions
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

## 🔄 ChronoSplit (Coming Q2 2025)

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
