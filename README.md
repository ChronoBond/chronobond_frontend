# ChronoBond Frontend 🚀

A decentralized finance (DeFi) application built on the Flow blockchain for creating, trading, and managing time-locked bonds with guaranteed yields.

## 🌟 Features

### Core Functionality
- **🔥 Bond Minting**: Create time-locked bonds with customizable durations and yield strategies
- **📊 Portfolio Management**: View and manage your bond holdings with real-time data
- **🛒 Marketplace**: Buy and sell bonds before maturity in a decentralized marketplace
- **💰 Bond Redemption**: Redeem matured bonds and track upcoming maturities
- **🔄 ChronoSplit (Coming Soon)**: Split bonds into Principal Tokens (cPT) and Yield Tokens (cYT)

### Yield Strategies
- **FlowStaking**: Low-risk staking with consistent 5% yields
- **DeFiYield**: Medium-risk DeFi strategies with 8.5% yields  
- **HighYield**: High-risk strategies for maximum 15% returns

### User Experience
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **⚡ Real-time Updates**: Live blockchain data integration
- **🔗 Wallet Integration**: Seamless Flow wallet connection

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Blockchain**: Flow Network
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Flow Integration**: @onflow/fcl, @onflow/kit
- **State Management**: React Hooks

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
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page with navigation
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── bond-minting.tsx  # Bond creation interface
│   ├── marketplace.tsx   # Trading marketplace
│   ├── holdings-view.tsx # Portfolio management
│   ├── bond-redemption.tsx # Bond redemption center
│   ├── chronosplit-coming-soon.tsx # ChronoSplit preview
│   └── floating-navbar.tsx # Main navigation
├── lib/                  # Utility libraries
│   ├── chronobond-service.ts # Bond operations
│   ├── marketplace-service.ts # Marketplace logic
│   ├── bond-redemption-service.ts # Redemption logic
│   └── flow-config.ts    # Flow blockchain configuration
├── scripts/              # Cadence scripts
│   ├── transactions/     # Transaction scripts
│   └── bonds/           # Bond query scripts
└── types/               # TypeScript definitions
    └── chronobond.ts    # App type definitions
```

## 🎯 Key Components

### Bond Minting (`bond-minting.tsx`)
- Create time-locked bonds with customizable parameters
- Choose from multiple yield strategies
- Real-time yield calculations and projections

### Marketplace (`marketplace.tsx`)
- List bonds for sale with custom pricing
- Browse and purchase available bonds
- Real-time transaction processing

### Holdings View (`holdings-view.tsx`)
- Portfolio overview with total value calculations
- Individual bond details and performance
- Quick access to listing and redemption

### Bond Redemption (`bond-redemption.tsx`)
- Track matured bonds ready for redemption
- Monitor upcoming maturities
- Bulk redemption capabilities

### ChronoSplit (`chronosplit-coming-soon.tsx`)
- Preview of upcoming yield trading features
- Educational content about Principal/Yield token splitting
- Roadmap for AMM and analytics features

## 🔧 Configuration

### Flow Network Configuration
The app is configured to work with Flow blockchain. Update `src/lib/flow-config.ts` for different network environments.

### Environment Variables
```bash
# Add to .env.local if needed
NEXT_PUBLIC_FLOW_ACCESS_NODE_API=https://rest-testnet.onflow.org
NEXT_PUBLIC_FLOW_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn
```

## 🎨 UI Components

The app uses shadcn/ui components for consistent design:
- **Cards**: Professional containers with backdrop blur
- **Buttons**: Various variants with hover effects
- **Badges**: Status indicators and labels
- **Tables**: Data display with professional styling
- **Inputs**: Form controls with validation
- **Avatars**: User profile display

## 🔄 ChronoSplit (Upcoming)

The next major feature will allow users to split their bonds into:
- **Principal Tokens (cPT)**: Zero-coupon bond equivalent
- **Yield Tokens (cYT)**: Tradeable future yield claims

This enables advanced DeFi strategies like:
- Selling yield for immediate liquidity
- Buying discounted principal tokens
- Speculating on future yield rates

## 📝 Development

### Code Style
- TypeScript with strict type checking
- ESLint and Prettier for code formatting
- Modular component architecture
- Consistent naming conventions

### Testing
```bash
npm run build  # Type checking and build validation
npm run lint   # Code linting
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🔗 Links

- [Flow Blockchain](https://flow.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built with ❤️ for the Flow ecosystem**
