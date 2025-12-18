# Fraction: The Social Finance Layer for Students 🎓💸

> "College students are constantly splitting costs—Ubers, groceries, takeout, rent, utilities—but the current process is a friendship-killing nightmare... Students need something that works like texting: snap a photo of any receipt, it intelligently splits based on who ordered what, auto-settles debts periodically... and handles the emotional labor of reminding people without making it weird."

## 📱 Mobile-First Philosophy

**Strict Mobile Constraint:** This application is designed **exclusively** for mobile viewports.

-   On Desktop: The app should be centered in a mobile-simulator container (e.g., iPhone 15 Pro dimensions).
-   On Mobile: Standard full-screen PWA experience.
-   **Design Language:** "Fluid, Tactile, and Fast." Think Snapchat meets Apple Wallet. High usability, large touch targets, minimal typing.

---

## 🛠️ Master Development Checklist

This checklist is designed for a developer jumping into the codebase for the first time. Follow these steps sequentially to build the "Fraction" experience.

### Phase 1: Foundation & "The Shell" 🏗️

_Goal: Set up the mobile stage. The app should feel native immediately._

-   [ ] **Mobile Viewport Configuration**
    -   [ ] in `layout.tsx`, ensure viewport meta tag prevents zooming (`user-scalable=no`).
    -   [ ] Configure `body` entries to prevent "bounce" scrolling on iOS/Mobile unless intended.
    -   [ ] Create a `MobileContainer` component that wraps the entire app. On desktop, this limits width to `430px` (max-width) and centers it with a subtle border/shadow. On mobile, it's 100% width/height.
-   [ ] **Design System Setup (Tailwind)**
    -   [ ] Define **Colors**:
        -   `brand-primary`: A vibrant, trust-inducing color (e.g., Electric Blue or Mint Green).
        -   `surface-glass`: Translucent white/black for glassmorphism.
        -   `text-primary`, `text-secondary`: Standard, readable fonts (Inter or Outfit).
    -   [ ] Define **Typography**: Large headings for money, readable body for transactions.
    -   [ ] **Global CSS**: Add generic "reset" to remove browser default styles that look "webby" (e.g., remove specific connect highlights).
-   [ ] **Navigation Skeleton**
    -   [ ] Create a **Bottom Tab Bar**. It should _float_ slightly above the bottom edge.
        -   Tabs: `Home` (Recent Activity), `Scan` (Central Action Button), `Groups` (Friends), `Profile`.
    -   [ ] The `Scan` button should be prominent, possibly breaking the nav bar layout (larger, raised).

### Phase 2: The "Texting" Interface (Home Screen) 💬

_Goal: Make finances feel social, not administrative._

-   [ ] **Activity Feed Concept**
    -   [ ] Instead of a "Dashboard," build a "Thread List" (like iMessage or WhatsApp).
    -   [ ] Each "Thread" represents a Group (e.g., "Roommates") or a 1:1 Friendship.
    -   [ ] Display: Avatar(s), Last Activity ("Pizza: You owe $12"), and a timestamp.
    -   [ ] **Micro-interaction**: Swipe left on a thread to "Quick Settle" or "Nudge".
-   [ ] **Expense Stream Detail View**
    -   [ ] clicking a thread opens the "Chat".
    -   [ ] Events appear like chat bubbles.
        -   Regular text messages.
        -   **"Expense Bubbles"**: Distinct cards showing "Groceries - $54.20" with a breakdown of who paid.
    -   [ ] Add a "Reaction" system (e.g., liking a payment confirmation).

### Phase 3: The Camera & Receipt "Magic" 📸

_Goal: The frictionless entry point. The 'Snap'._

-   [ ] **Camera Interface**
    -   [ ] clicking the central `Scan` button opens a full-screen camera view (use `react-webcam` or HTML5 Media Capture API).
    -   [ ] **UI Overlay**: Add a glowing distinct frame guide for receipts.
-   [ ] **Mock OCR Processing (Simulation)**
    -   [ ] _Development Step_: Since real OCR is complex, build a "Simulator" first.
    -   [ ] User snaps photo -> Show a sleek scanning animation (scanning laser/line).
    -   [ ] After 1.5s, transition to the **Itemization Screen** with mock data (e.g., "Bananas", "Milk", "Beer").
-   [ ] **Itemization / Splitting UI** (Crucial UX Design)
    -   [ ] Show the scanned receipt items as a vertical list.
    -   [ ] **Interaction**: "Tap to Claim". The user taps items _they_ are responsible for.
    -   [ ] **Multi-Select**: Long press and drag to select multiple items.
    -   [ ] **Assign to Friend**: Tap an item, then tap a friend's avatar head floating at the bottom.

### Phase 4: The Smart Ledger & Logic 🧠

_Goal: Handle the math invisible._

-   [ ] **Data Model Implementation**
    -   [ ] `Expense` Object: Total amount, Payer (User ID), Splitters (Array of Users + amounts).
    -   [ ] `Group` Object: Aggregated balance.
-   [ ] **The "Auto-Settle" Algorithm**
    -   [ ] Create a utility function `calculateNetBalances(expenses)`.
    -   [ ] Logic: If Alice owes Bob $10 and Bob owes Alice $5, the system should simply show "Alice owes Bob $5". Minimize transactions.
-   [ ] **Debt Visualization**
    -   [ ] On the Home Screen/Profile: A simple "Net Position".
    -   [ ] Green text: "You are owed $45". Red text: "You owe $12".
    -   [ ] **Psychology**: Don't use scary red. Use a softer "coral" or "orange" for debt.

### Phase 5: Settlements & Social Features 🤝

_Goal: Closing the loop without awkwardness._

-   [ ] **The "Settle Up" Flow**
    -   [ ] When a user wants to pay, show a satisfying "Card" summary.
    -   [ ] **Integration**: Deep link to Venmo/CashApp (URL scheme) or use mock internal "Wallet".
    -   [ ] **Payment Nudges**: A "Nudge" button that sends a pre-written, polite notification ("Hey! Just wrapping up costs for the month 📅").
-   [ ] **Gamification / Delight**
    -   [ ] When a debt is 100% settled, trigger a confetti explosion or a "High Five" animation.
    -   [ ] Add "Streaks" for paying back friends within 24 hours.

### Technical Stack & Recommendations

-   **Framework**: Next.js 14+ (App Router).
-   **Styling**: Tailwind CSS (Critical for rapid layout).
-   **Icons**: Lucide React (Clean, modern).
-   **State Management**: Zustand (for holding the "Draft Receipt" state).
-   **Animation**: Framer Motion (Essential for the "Premium" feel - swipes, modals, layout transitions).

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
