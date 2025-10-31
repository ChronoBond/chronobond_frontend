# Frontend Integration Guide - Reinvestment Status Tracking

## ✅ Deployed & Working on Testnet!

**Contract Address:** `0x45722594009505d7`  
**Deployment TX:** `26bffcd1a05df2b0e053fd19cc016305f0bee65bf9f4d0e995a85670429d0c27`  
**Test TX (Schedule):** `0c5dc92775598deecb28e6019bf6c397151b6a037970fa1df4ed3c33d5e93785`  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [FCL Configuration](#fcl-configuration)
4. [Check Reinvestment Status](#check-reinvestment-status)
5. [Schedule Auto-Reinvestment](#schedule-auto-reinvestment)
6. [Cancel Scheduled Reinvestment](#cancel-scheduled-reinvestment)
7. [React Components](#react-components)
8. [Event Listening](#event-listening)
9. [UI/UX Examples](#ui-ux-examples)
10. [Complete Code Examples](#complete-code-examples)

---

## Overview

The `ReinvestmentRegistry` contract tracks which bonds are scheduled for automatic reinvestment. This allows your frontend to:

- ✅ Display "Auto-Reinvest Enabled" badges
- ✅ Show reinvestment configuration (duration, yield, strategy)
- ✅ Enable/disable auto-reinvest per bond
- ✅ Filter bonds by reinvestment status
- ✅ Calculate projected compound returns

---

## Quick Start

### Installation

```bash
npm install @onflow/fcl
```

### Configure FCL

```javascript
import * as fcl from "@onflow/fcl";

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xReinvestmentRegistry": "0x45722594009505d7",
  "0xChronoBond": "0x45722594009505d7",
  "0xNonFungibleToken": "0x631e88ae7f1d7c20"
});
```

---

## Check Reinvestment Status

### Script

```javascript
async function checkReinvestmentStatus(userAddress) {
  const code = `
    import ReinvestmentRegistry from 0x45722594009505d7
    
    access(all) fun main(userAddress: Address): {UInt64: ReinvestmentRegistry.ReinvestmentConfig} {
      let registry = ReinvestmentRegistry.getGlobalRegistry()
        ?? panic("Could not get registry")
      
      let scheduledBondIDs = registry.getScheduledBondsByOwner(owner: userAddress)
      let result: {UInt64: ReinvestmentRegistry.ReinvestmentConfig} = {}
      
      for bondID in scheduledBondIDs {
        if let config = registry.getConfig(bondID: bondID) {
          result[bondID] = config
        }
      }
      
      return result
    }
  `;
  
  const result = await fcl.query({
    cadence: code,
    args: (arg, t) => [arg(userAddress, t.Address)]
  });
  
  return result;
}
```

### Response Example

```javascript
{
  "44": {
    bondID: 44,
    owner: "0x45722594009505d7",
    scheduledAt: 1761947880,
    expectedMaturityDate: 1793472198,
    newDuration: 31536000,      // 1 year in seconds
    newYieldRate: 0.10,          // 10%
    newStrategyID: "FlowStaking"
  }
}
```

---

## Schedule Auto-Reinvestment

### Transaction

```javascript
async function scheduleReinvestment(bondID, newDuration, newYieldRate, newStrategyID) {
  const code = `
    import NonFungibleToken from 0x631e88ae7f1d7c20
    import ChronoBond from 0x45722594009505d7
    import ReinvestmentRegistry from 0x45722594009505d7
    
    transaction(bondID: UInt64, newDuration: UFix64, newYieldRate: UFix64, newStrategyID: String) {
      let signerAddress: Address
      let bondMaturityDate: UFix64
      
      prepare(signer: auth(Storage) &Account) {
        self.signerAddress = signer.address
        
        let collection = signer.storage.borrow<&ChronoBond.Collection>(
          from: ChronoBond.CollectionStoragePath
        ) ?? panic("Could not borrow collection")
        
        let bondRef = collection.borrowNFT(bondID) ?? panic("Bond not found")
        let chronoBondRef = bondRef as! &ChronoBond.NFT
        self.bondMaturityDate = chronoBondRef.maturityDate
        
        let currentTime = getCurrentBlock().timestamp
        assert(
          currentTime < self.bondMaturityDate,
          message: "Cannot schedule reinvestment for already mature bond"
        )
      }
      
      execute {
        let registryRef = ReinvestmentRegistry.getGlobalRegistry()
          ?? panic("Could not get registry")
        
        registryRef.scheduleBond(
          bondID: bondID,
          owner: self.signerAddress,
          expectedMaturityDate: self.bondMaturityDate,
          newDuration: newDuration,
          newYieldRate: newYieldRate,
          newStrategyID: newStrategyID
        )
      }
    }
  `;
  
  const txId = await fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(bondID, t.UInt64),
      arg(newDuration.toFixed(1), t.UFix64),
      arg(newYieldRate.toFixed(2), t.UFix64),
      arg(newStrategyID, t.String)
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    authorizations: [fcl.currentUser],
    limit: 9999
  });
  
  await fcl.tx(txId).onceSealed();
  return txId;
}

// Usage
await scheduleReinvestment(
  44,           // bondID
  31536000,     // 1 year
  0.10,         // 10%
  "FlowStaking"
);
```

---

## Cancel Scheduled Reinvestment

```javascript
async function cancelReinvestment(bondID) {
  const code = `
    import ReinvestmentRegistry from 0x45722594009505d7
    
    transaction(bondID: UInt64) {
      execute {
        let registryRef = ReinvestmentRegistry.getGlobalRegistry()
          ?? panic("Could not get registry")
        
        registryRef.cancelSchedule(bondID: bondID)
      }
    }
  `;
  
  const txId = await fcl.mutate({
    cadence: code,
    args: (arg, t) => [arg(bondID, t.UInt64)],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    authorizations: [fcl.currentUser],
    limit: 9999
  });
  
  await fcl.tx(txId).onceSealed();
  return txId;
}
```

---

## React Components

### BondCard Component with Reinvestment Status

```jsx
import { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

function BondCard({ bond, userAddress }) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [reinvestConfig, setReinvestConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    checkStatus();
  }, [bond.bondID]);
  
  async function checkStatus() {
    const scheduled = await checkReinvestmentStatus(userAddress);
    if (scheduled[bond.bondID]) {
      setIsScheduled(true);
      setReinvestConfig(scheduled[bond.bondID]);
    }
  }
  
  async function handleSchedule() {
    setLoading(true);
    try {
      await scheduleReinvestment(
        bond.bondID,
        31536000,  // 1 year
        0.10,      // 10%
        "FlowStaking"
      );
      await checkStatus();
      alert("Auto-reinvest enabled!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleCancel() {
    setLoading(true);
    try {
      await cancelReinvestment(bond.bondID);
      setIsScheduled(false);
      setReinvestConfig(null);
      alert("Auto-reinvest cancelled");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="bond-card">
      <div className="bond-header">
        <h3>Bond #{bond.bondID}</h3>
        {isScheduled && (
          <span className="badge badge-auto">
            🔄 Auto-Reinvest ON
          </span>
        )}
      </div>
      
      <div className="bond-info">
        <p>Principal: {bond.principal} FLOW</p>
        <p>Yield: {(bond.yieldRate * 100).toFixed(1)}%</p>
        <p>Status: {bond.isMatured ? "Mature ✅" : "Active"}</p>
      </div>
      
      {isScheduled && reinvestConfig && (
        <div className="reinvest-config">
          <h4>📅 Scheduled Reinvestment:</h4>
          <ul>
            <li>New Duration: {reinvestConfig.newDuration / 31536000} year(s)</li>
            <li>New Yield: {(reinvestConfig.newYieldRate * 100).toFixed(1)}%</li>
            <li>Strategy: {reinvestConfig.newStrategyID}</li>
          </ul>
        </div>
      )}
      
      <div className="bond-actions">
        {!bond.isMatured && !isScheduled && (
          <button 
            onClick={handleSchedule} 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Processing..." : "Enable Auto-Reinvest"}
          </button>
        )}
        
        {isScheduled && (
          <button 
            onClick={handleCancel} 
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? "Processing..." : "Cancel Auto-Reinvest"}
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Event Listening

### Listen for Reinvestment Events

```javascript
// Listen for bonds being scheduled
fcl.events("A.45722594009505d7.ReinvestmentRegistry.BondScheduledForReinvestment")
  .subscribe((event) => {
    console.log("Bond scheduled:", event);
    const { bondID, owner, newDuration, newYieldRate } = event.data;
    
    // Update UI
    showNotification(`Bond #${bondID} scheduled for auto-reinvest!`);
    refreshBondStatus(bondID);
  });

// Listen for reinvestment execution
fcl.events("A.45722594009505d7.ReinvestmentRegistry.ScheduledReinvestmentExecuted")
  .subscribe((event) => {
    console.log("Reinvestment executed:", event);
    const { oldBondID, newBondID, owner } = event.data;
    
    showNotification(`Bond #${oldBondID} auto-reinvested into Bond #${newBondID}!`);
    refreshPortfolio();
  });

// Listen for cancellations
fcl.events("A.45722594009505d7.ReinvestmentRegistry.ReinvestmentScheduleCancelled")
  .subscribe((event) => {
    console.log("Schedule cancelled:", event);
    const { bondID, owner } = event.data;
    
    showNotification(`Auto-reinvest cancelled for Bond #${bondID}`);
    refreshBondStatus(bondID);
  });
```

---

## UI/UX Examples

### Status Badge

```jsx
{isScheduled && (
  <div className="auto-badge">
    <span className="icon">🔄</span>
    <span className="label">Auto-Compound</span>
  </div>
)}
```

### Filter Controls

```jsx
function BondFilters({ onFilterChange }) {
  return (
    <div className="filters">
      <button onClick={() => onFilterChange('all')}>
        All Bonds
      </button>
      <button onClick={() => onFilterChange('scheduled')}>
        🔄 Auto-Reinvesting
      </button>
      <button onClick={() => onFilterChange('manual')}>
        Manual Only
      </button>
    </div>
  );
}
```

### Portfolio Stats

```jsx
function PortfolioStats({ bonds, scheduledBonds }) {
  const scheduledCount = Object.keys(scheduledBonds).length;
  const scheduledPercent = (scheduledCount / bonds.length * 100).toFixed(0);
  
  return (
    <div className="stats">
      <div className="stat-card">
        <h4>Total Bonds</h4>
        <p className="stat-value">{bonds.length}</p>
      </div>
      <div className="stat-card">
        <h4>Auto-Compounding</h4>
        <p className="stat-value">{scheduledCount} ({scheduledPercent}%)</p>
      </div>
    </div>
  );
}
```

---

## Complete Code Examples

### Full Portfolio Component

```jsx
import { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

function BondPortfolio() {
  const [user, setUser] = useState(null);
  const [bonds, setBonds] = useState([]);
  const [scheduledBonds, setScheduledBonds] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);
  
  useEffect(() => {
    if (user?.addr) {
      loadData();
    }
  }, [user]);
  
  async function loadData() {
    setLoading(true);
    try {
      // Load bonds
      const bondsData = await getUserBonds(user.addr);
      setBonds(bondsData);
      
      // Load scheduled status
      const scheduled = await checkReinvestmentStatus(user.addr);
      setScheduledBonds(scheduled);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }
  
  const filteredBonds = bonds.filter(bond => {
    if (filter === 'scheduled') return scheduledBonds[bond.bondID];
    if (filter === 'manual') return !scheduledBonds[bond.bondID];
    return true;
  });
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="portfolio">
      <h1>My Bonds</h1>
      
      <PortfolioStats 
        bonds={bonds} 
        scheduledBonds={scheduledBonds} 
      />
      
      <BondFilters onFilterChange={setFilter} />
      
      <div className="bond-grid">
        {filteredBonds.map(bond => (
          <BondCard 
            key={bond.bondID} 
            bond={bond} 
            userAddress={user.addr}
            isScheduled={!!scheduledBonds[bond.bondID]}
            reinvestConfig={scheduledBonds[bond.bondID]}
            onUpdate={loadData}
          />
        ))}
      </div>
      
      {filteredBonds.length === 0 && (
        <div className="empty-state">
          <p>No bonds match your filter</p>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Analytics & Calculations

### Calculate Compound Returns

```javascript
function calculateCompoundReturns(principal, yieldRate, periods) {
  const returns = [];
  let value = principal;
  
  for (let i = 1; i <= periods; i++) {
    value = value * (1 + yieldRate);
    returns.push({
      period: i,
      value: value,
      gain: value - principal,
      percentGain: ((value - principal) / principal * 100).toFixed(2)
    });
  }
  
  return returns;
}

// Usage
const projections = calculateCompoundReturns(110, 0.10, 5);
// [
//   { period: 1, value: 121, gain: 11, percentGain: "10.00" },
//   { period: 2, value: 133.1, gain: 23.1, percentGain: "21.00" },
//   ...
// ]
```

---

## ✅ Testing Checklist

- [ ] Can display reinvestment status badge
- [ ] Can enable auto-reinvest
- [ ] Can cancel auto-reinvest
- [ ] Can filter bonds by status
- [ ] Events update UI in real-time
- [ ] Error handling works
- [ ] Loading states show correctly
- [ ] Mobile responsive

---

## 🎉 Summary

**What You Can Build:**
- ✅ Status badges showing auto-reinvest enabled
- ✅ Enable/disable auto-reinvest per bond
- ✅ Filter portfolio by reinvestment status
- ✅ Real-time event updates
- ✅ Compound interest projections
- ✅ Portfolio analytics

**Contract Addresses (Testnet):**
- ReinvestmentRegistry: `0x45722594009505d7`
- ChronoBond: `0x45722594009505d7`

**Transaction Hashes:**
- Deploy: `26bffcd1a05df2b0e053fd19cc016305f0bee65bf9f4d0e995a85670429d0c27`
- Test Schedule: `0c5dc92775598deecb28e6019bf6c397151b6a037970fa1df4ed3c33d5e93785`

**Ready to integrate!** 🚀
