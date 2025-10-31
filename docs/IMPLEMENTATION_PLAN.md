# ChronoBond - Implementation Plan
## Status: Poin 1 & 3 ✅ DONE | Poin 2, 4, 5 ⏳ TODO

---

## 📊 Current Status

| Poin | Fitur | Status | Progress |
|------|-------|--------|----------|
| 1 | Mint Bond (FLOW only) | ✅ IMPLEMENTED | 100% |
| 3 | View User Bonds | ✅ IMPLEMENTED | 100% |
| 2 | Reinvest Mature Bond | ⏳ TODO | 0% |
| 4 | Mint Bond with MockUSDC | ⏳ TODO | 20% |
| 5 | Flow Actions Integration | ⏳ TODO | 10% |

---

## 🗂️ File-File Yang Perlu Di-Update/Dibuat

### **KATEGORI A: Cadence Transactions (Backend Logic)**

#### 1️⃣ **Poin 2: Reinvest Mature Bond**

**File yang butuh di-create/update:**
```
src/scripts/transactions/
├── reinvest_bond_simple.cdc          ❌ PERLU DIBUAT
└── flow_actions/
    ├── reinvestBond.cdc              ❌ PERLU DIBUAT
    └── scheduled_reinvestBond.cdc    ❌ OPTIONAL (Phase 2)
```

**Keterangan:**
- `reinvest_bond_simple.cdc` - Simple flow without Flow Actions
- `flow_actions/reinvestBond.cdc` - Advanced: dengan Flow Actions pattern
- Keduanya akan dijalankan dari `src/lib/bond-redemption-service.ts`

---

#### 2️⃣ **Poin 4: Mint with MockUSDC**

**File yang butuh di-create:**
```
src/scripts/transactions/
├── mint_bond_with_usdc.cdc           ❌ PERLU DIBUAT
├── setup_mock_usdc.cdc               ❌ PERLU DIBUAT
├── init_swap_pool.cdc                ❌ PERLU DIBUAT
└── add_swap_liquidity.cdc            ❌ PERLU DIBUAT
```

**Keterangan:**
- `mint_bond_with_usdc.cdc` - Main transaction (dari FRONTEND_BRIEF.md sudah ada template)
- `setup_mock_usdc.cdc` - Setup user account untuk MockUSDC vault
- `init_swap_pool.cdc` - Initialize liquidity pool (jalankan 1x saja)
- `add_swap_liquidity.cdc` - Top-up liquidity pool

---

#### 3️⃣ **Poin 5: Flow Actions Integration**

**File yang butuh di-create:**
```
src/scripts/transactions/
└── flow_actions/
    ├── reinvestBond.cdc              ❌ PERLU DIBUAT (Related to Poin 2)
    ├── mintBondViaActions.cdc        ❌ OPTIONAL
    └── scheduled_reinvestBond.cdc    ❌ OPTIONAL (Phase 2)
```

---

### **KATEGORI B: TypeScript Service Classes (Frontend Logic)**

#### 1️⃣ **Poin 2: Reinvest Mature Bond**

**File yang butuh di-update:**
```
src/lib/bond-redemption-service.ts    🔄 PARTIAL UPDATE
```

**Yang perlu ditambahin:**
- ✅ Method `reinvestBond()` - sudah ada structure, cuma perlu Cadence code
- ✅ Method `reinvestBondWithFlowActions()` - untuk advanced pattern
- ✅ Helper untuk tracking operation status

**Fungsi yang sudah ada (cuma perlu di-fill):**
```typescript
async redeemBond(bondID: string): Promise<RedemptionResult>
async reinvestBond(bondID: string, duration: number, yieldRate: number): Promise<RedemptionResult>
async reinvestBondWithFlowActions(bondID: string, ...): Promise<RedemptionResult>
```

---

#### 2️⃣ **Poin 4: Mint with MockUSDC**

**File yang butuh di-update:**
```
src/lib/chronobond-service.ts          🔄 UPDATE
src/lib/swap-service.ts                🔄 UPDATE
```

**Yang perlu ditambahin di `chronobond-service.ts`:**
- ✅ Update method `mintWithSwap()` - fill the Cadence transaction code
- ✅ Add method untuk validate token balance sebelum swap

**Yang perlu ditambahin di `swap-service.ts`:**
- ✅ Implement `quoteIn()` dan `quoteOut()` untuk MockUSDC ↔ FLOW
- ✅ Add liquidity pool management methods

---

#### 3️⃣ **Poin 5: Flow Actions Integration**

**File yang butuh di-create/update:**
```
src/lib/flow-actions-service.ts        ❌ PERLU DIBUAT
src/lib/bond-redemption-service.ts     🔄 UPDATE
```

**Keterangan:**
- `flow-actions-service.ts` - New service untuk handle Flow Actions pattern
- Methods:
  - `executeActionWithTracking()` - Execute + track operation
  - `checkActionStatus()` - Check if action completed
  - `scheduleAction()` - Schedule action untuk kemudian hari

---

### **KATEGORI C: React Components (UI Layer)**

#### 1️⃣ **Poin 2: Reinvest Mature Bond**

**File yang butuh di-create/update:**
```
src/app/transactions/(section)/redeem/
├── useRedeem.ts                      🔄 PARTIAL UPDATE
├── RedeemModal.tsx                   🔄 PARTIAL UPDATE
└── ReinvestModal.tsx                 ❌ OPTIONAL (New)
```

**Yang perlu ditambahin:**
- ✅ "Reinvest" button di RedeemModal (currently hanya "Redeem")
- ✅ ReinvestModal - Form untuk input reinvest params
- ✅ Toast notification untuk reinvest success

---

#### 2️⃣ **Poin 4: Mint with MockUSDC**

**File yang butuh di-update:**
```
src/app/transactions/(section)/mint/
├── MintForm.tsx                      🔄 UPDATE (done structure, need cadence)
├── useMint.ts                        🔄 UPDATE (done structure, need cadence)
└── MintMain.tsx                      ✅ DONE
```

**Current status:**
- ✅ UI Structure sudah ada 100%
- ✅ State management sudah ada
- ✅ Quote fetching logic sudah ada
- ❌ Cadence transaction code masih placeholder

**Yang perlu di-fill:**
- Replace `TRANSACTION_CODE` placeholder di `chronobond-service.ts` dengan Cadence code dari FRONTEND_BRIEF.md
- Ensure swap quote logic match dengan actual MockSwapConnector contract

---

#### 3️⃣ **Poin 5: Flow Actions Integration**

**File yang butuh di-create:**
```
src/app/transactions/(section)/redeem/
├── FlowActionsStatus.tsx             ❌ PERLU DIBUAT (Optional)
└── useFlowActions.ts                 ❌ PERLU DIBUAT
```

**Keterangan:**
- UI untuk menampilkan status Flow Actions execution
- Hook untuk manage Flow Actions state

---

### **KATEGORI D: Types & Constants**

#### 1️⃣ **Poin 2, 4, 5: Update Types**

**File yang butuh di-update:**
```
src/types/redeem.types.ts             🔄 ADD reinvest types
src/types/swap.types.ts               🔄 ADD swap types
src/types/chronobond.ts               🔄 ADD flow actions types
```

**Contoh types yang perlu ditambah:**
```typescript
// Reinvest
interface ReinvestParams {
  bondID: string;
  duration: number;
  yieldRate: number;
}

// Swap Quote
interface SwapQuote {
  inputAmount: string;
  outputAmount: string;
  slippage: number;
  exchangeRate: string;
}

// Flow Actions
interface FlowActionOperation {
  operationID: string;
  status: "pending" | "completed" | "failed";
  timestamp: number;
}
```

---

## 📋 Detailed Implementation Plan

### **PHASE 1: Poin 4 - Mint with MockUSDC (EASIEST)**

**Why First?**
- UI 95% done (MintForm.tsx, useMint.ts)
- Only need Cadence code
- Self-contained feature
- No dependencies on other features

**Timeline:** 2-3 days

**Steps:**
1. ✅ Copy Cadence code dari FRONTEND_BRIEF.md → `flow-config.ts`
2. ✅ Update `chronobond-service.ts` `mintWithSwap()` method
3. ✅ Test with MockUSDC + MockSwapConnector on testnet
4. ✅ Update unit tests

**Files to change:**
- `src/lib/flow-config.ts` - Add MINT_WITH_USDC transaction
- `src/lib/chronobond-service.ts` - Fill `mintWithSwap()` Cadence code
- `src/lib/swap-service.ts` - Implement quote logic for MockUSDC
- Test files

---

### **PHASE 2: Poin 2 - Reinvest Mature Bond (MEDIUM)**

**Why Second?**
- Depends on redeem logic (already partially done)
- Need simple Cadence transaction
- Can work independent dari Poin 4

**Timeline:** 3-4 days

**Steps:**
1. ❌ Create `reinvest_bond_simple.cdc` - Basic version
2. ❌ Implement `reinvestBond()` di `bond-redemption-service.ts`
3. ❌ Add "Reinvest" button ke UI (RedeemModal.tsx)
4. ❌ Create ReinvestModal component (optional)
5. ❌ Test redeem → reinvest flow

**Files to change:**
- `src/scripts/transactions/reinvest_bond_simple.cdc` - CREATE
- `src/lib/bond-redemption-service.ts` - Update `reinvestBond()`
- `src/app/transactions/(section)/redeem/RedeemModal.tsx` - Add button
- `src/types/redeem.types.ts` - Add types

---

### **PHASE 3: Poin 5 - Flow Actions Integration (HARDEST)**

**Why Last?**
- Depends on Poin 2 & 4
- Advanced pattern (complex)
- Optional untuk MVP

**Timeline:** 4-5 days

**Steps:**
1. ❌ Create `flow-actions-service.ts`
2. ❌ Create `flow_actions/reinvestBond.cdc` - Advanced Cadence
3. ❌ Implement operation tracking logic
4. ❌ Add Flow Actions UI (optional)
5. ❌ Test atomic transactions

**Files to change:**
- `src/lib/flow-actions-service.ts` - CREATE
- `src/scripts/transactions/flow_actions/reinvestBond.cdc` - CREATE
- `src/lib/bond-redemption-service.ts` - Add `reinvestBondWithFlowActions()`
- `src/types/chronobond.ts` - Add Flow Actions types

---

## 🎯 Dependencies & Blockers

### **Poin 4 (Mint with MockUSDC)**
- ✅ No blockers
- ✅ Cadence code tersedia di FRONTEND_BRIEF.md
- ✅ UI 95% done
- ⏳ Only need to fill placeholders

### **Poin 2 (Reinvest)**
- ✅ Depends: Redeem logic (DONE)
- ✅ Need: Simple Cadence transaction
- ✅ UI mostly done
- ⏳ Need `reinvest_bond_simple.cdc`

### **Poin 5 (Flow Actions)**
- 🔄 Depends: Poin 2 & 4 (DONE/IN PROGRESS)
- 🔄 Need: Advanced Cadence + tracking logic
- ❌ Optional untuk Phase 1

---

## 📝 Summary of Changes by Phase

### **Phase 1 (Poin 4) - Files to Change:**
```
src/lib/flow-config.ts
  └─ Add: MINT_WITH_USDC transaction

src/lib/chronobond-service.ts
  └─ Update: mintWithSwap() method

src/lib/swap-service.ts
  └─ Update: quoteIn/quoteOut for MockUSDC

src/types/swap.types.ts
  └─ Add: MockUSDC types
```

### **Phase 2 (Poin 2) - Files to Change:**
```
src/scripts/transactions/
  └─ CREATE: reinvest_bond_simple.cdc

src/lib/bond-redemption-service.ts
  └─ Update: reinvestBond() method

src/app/transactions/(section)/redeem/RedeemModal.tsx
  └─ Add: Reinvest button/modal

src/types/redeem.types.ts
  └─ Add: ReinvestParams type
```

### **Phase 3 (Poin 5) - Files to Change:**
```
src/lib/
  ├─ CREATE: flow-actions-service.ts
  └─ UPDATE: bond-redemption-service.ts

src/scripts/transactions/flow_actions/
  └─ CREATE: reinvestBond.cdc

src/types/chronobond.ts
  └─ Add: FlowActionOperation types
```

---

## 🚀 Next Steps

### **Immediate (Today):**
1. ✅ Review this plan
2. ✅ Get approval dari team
3. ✅ Start Phase 1 (Mint with MockUSDC)

### **This Week:**
1. ❌ Complete Phase 1 (Mint with MockUSDC)
2. ❌ Start Phase 2 (Reinvest)
3. ❌ Testing & QA

### **Next Week:**
1. ❌ Complete Phase 2 (Reinvest)
2. ❌ Phase 3 (Flow Actions) - if needed
3. ❌ Integration testing
4. ❌ Deploy to testnet

---

## 📊 Effort Estimation

| Phase | Feature | Duration | Priority |
|-------|---------|----------|----------|
| 1 | Mint with MockUSDC | 2-3 days | 🔴 HIGH |
| 2 | Reinvest | 3-4 days | 🟡 MEDIUM |
| 3 | Flow Actions | 4-5 days | 🟢 LOW (Optional) |
| **TOTAL** | **All Features** | **9-12 days** | - |

---

## ✅ Success Criteria

### **Phase 1 Complete:**
- ✅ User can mint bond dengan MockUSDC
- ✅ Swap quote accurate (1 USDC = 10 FLOW)
- ✅ Transaction sealed on testnet
- ✅ Bond NFT created successfully

### **Phase 2 Complete:**
- ✅ User can click "Reinvest" pada mature bond
- ✅ Atomic redeem + mint dalam 1 tx
- ✅ Bond maturity correctly calculated
- ✅ Transaction sealed on testnet

### **Phase 3 Complete:**
- ✅ Flow Actions pattern working
- ✅ Operation tracking functional
- ✅ Multiple actions composable
- ✅ Scheduling capability (if implemented)

---

**Created:** November 1, 2025
**Status:** 📋 PLANNING
**Ready to start Phase 1:** ✅ YES
