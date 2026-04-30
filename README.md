# CoinVoyage

**Live Demo:** [https://coinvoyage.vercel.app/](https://coinvoyage.vercel.app/)

A premium, high-performance cryptocurrency dashboard and financial utility suite built with React, Tailwind CSS, Framer Motion, and the CoinGecko API. Focused on real-time data handling, transparent algorithmic calculations, and a flawless, modern UI/UX design.

---

## 🚀 Features & Capabilities

This project delivers a state-of-the-art interface complete with rich analytics and professional financial tools:

- **Live Market Data:** Fetches the top cryptocurrencies and global market metrics (Total Market Cap, 24H Volume, BTC Dominance) directly from the CoinGecko API.
- **Advanced Crypto Tools Suite:**
  - **Coin Converter:** Live price conversion between any tracked cryptocurrency with a custom, searchable dropdown UI.
  - **Impermanent Loss Calculator:** Advanced AMM simulator (using the precise Constant Product AMM mathematical model `V_LP = 2 * √(x*y) * √(Pa*Pb)`) comparing HODL vs. Liquidity Provider values.
  - **Crypto ROI Calculator:** Intelligent return calculator with dynamic formatting for precision handling.
  - **Tax Estimator:** Configurable capital gains tax calculator computing Gross and Net Profits with built-in regional presets (e.g., India's 30% + 1% TDS).
  - **Credibility Tooltips:** High-impact, interactive tooltips providing transparent mathematical formulas ("How calculated?") for all financial outputs.
- **Trending & Watchlist Ecosystem:**
  - View the official top 15 trending coins natively sourced from CoinGecko.
  - Curate a localized Watchlist that persists across sessions via `localStorage`.
- **High-Performance Data Grids:** Client-side pagination and multi-directional sorting (Rank, Price, Market Cap, etc.) without re-rendering delays. Native scrolling allows the table header to remain stitched (sticky) for seamless data browsing.
- **Lightning Fast Search:** Real-time filtering powered by `useMemo` to ensure lag-free keystrokes.
- **Auto-Polling & Countdown Timer:** Data refreshes automatically every 60 seconds, visualized by a sleek countdown timer.
- **Deep Insights Modal:** A glassmorphism-styled drawer featuring animated `Recharts` data visualization for 7-day sparkline charts.
- **Responsive & Premium UI:** Fluid grid layouts, customized theme-dependent hover borders, and fluid animations using `Framer Motion` ensuring pixel-perfect display across Desktop, Tablet, and Mobile. Complete with a rich dark mode.

---

## 🏗️ Technical Decisions & Architecture

### 1. Component Modularity & Clean Folder Structures
The application is structured for scalability and maintainability:
- **`src/components/`**: UI logic is decoupled into highly reusable blocks (`Header`, `SearchBar`, `CoinTable`, `GlobalStats`, `ToolsView`, etc.).
- **`src/utils/`**: Pure logic and currency formatting functions are isolated from the UI, ensuring high testability.
- **`App.jsx`**: Acts purely as the orchestration layer, handling asynchronous state management, sorting algorithms, pagination slicing, and passing data down to pure UI components.

### 2. State Management & Performance Optimization
- **Memoization:** Complex sorting and filtering algorithms are wrapped in `useMemo` hooks. This ensures the 250+ coin array is only recalculated when dependencies (`search`, `sortConfig`, `currentTab`) change, drastically improving render speeds.
- **Animation Performance:** `Framer Motion` is utilized with `layout` props to recalculate DOM flow natively, preventing layout thrashing when accordions expand or collapse.

### 3. API Resilience & Error Handling
- **Graceful Degradation:** The UI uses extensive Optional Chaining (`?.`) and Nullish Coalescing (`??`) to guarantee the app will never crash if the API payload drops fields or alters structures.
- **Error Boundaries:** Rate limits (HTTP 429) from the CoinGecko API are caught and handled securely with a fallback Error UI and manual "Retry" triggers.

### 4. Advanced UI/UX Intuition
- **Skeleton Loaders:** The initial load triggers a full-page Skeleton Loader that identically mimics the structure of the dashboard to maintain structural continuity and reduce cognitive load.
- **Data Transparency:** Financial tools expose their exact backend formulas directly in the UI, building immediate trust with the user.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/coinvoyage.git
   ```
2. Navigate to the directory and install dependencies:
   ```bash
   cd coinvoyage
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the root directory and add your CoinGecko API key:
   ```env
   VITE_COINGECKO_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173/` to view it in the browser.

---

## 📦 Tech Stack

- **React** (Vite) - Core Framework
- **Tailwind CSS** - Utility-first styling & Dark Mode
- **Framer Motion** - Fluid animations & layout transitions
- **Recharts** - Dynamic data visualization
- **Lucide React** - SVG Iconography
- **CoinGecko API** - Real-time market data source
