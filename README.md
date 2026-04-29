# Coin Voyage

**Live Demo:** [https://coinvoyage.vercel.app/](https://coinvoyage.vercel.app/)

A premium, high-performance cryptocurrency dashboard and utility suite built with React, Tailwind CSS, and the CoinGecko API. Focused on real-time data handling, clean architecture, and responsive, modern UI/UX design.

## 🚀 Features & Implementation

This project delivers a state-of-the-art interface with a rich set of financial tools and features:

- **Live Market Data:** Fetches the top cryptocurrencies and global market metrics (Total Market Cap, 24H Volume, BTC Dominance) directly from the CoinGecko API.
- **Advanced Crypto Tools Suite:**
  - **Coin Converter:** Live price conversion between any tracked cryptocurrency with a fully custom, searchable dropdown UI.
  - **Impermanent Loss Calculator:** Advanced AMM loss simulator comparing HODL values vs. Liquidity Provider values.
  - **Crypto ROI Calculator:** Intelligent return calculator with precision handling for micro-cap tokens.
  - **Tax Estimator:** Configurable capital gains tax calculator with built-in regional presets (e.g., India's 30% + 1% TDS).
- **Trending & Watchlist:**
  - View the official top 15 trending coins natively sourced from CoinGecko.
  - Curate a localized Watchlist that persists across sessions via `localStorage`.
- **High-Performance Data Grids:** Client-side pagination and multi-directional sorting (Rank, Price, Market Cap, etc.) without re-rendering delays.
- **Lightning Fast Search:** Real-time filtering powered by `useMemo` to ensure lag-free keystrokes.
- **Auto-Polling & Countdown Timer:** Data refreshes automatically every 60 seconds, visualized by a sleek countdown timer.
- **7-Day Sparkline Visualization:** Integrated `Recharts` for dynamic 7-day sparkline charts for visual trend analysis.
- **Deep Insights Modal:** A glassmorphism-styled drawer that provides advanced metrics when clicking on any asset.
- **Responsive & Premium UI:** Fluid grid and table layouts ensuring pixel-perfect display across Desktop, Tablet, and Mobile. Complete with a rich dark mode.

## 🏗️ Technical Decisions & Architecture

### 1. Component Modularity & Clean Folder Structures
The application is structured for scalability:
- **`src/components/`**: UI logic is decoupled into highly reusable blocks (`Header`, `SearchBar`, `CoinTable`, `GlobalStats`, `ToolsView`, etc.).
- **`src/utils/`**: Pure logic and formatting functions are isolated from the UI, ensuring high testability.
- **`App.jsx`**: Acts purely as the orchestration layer, handling asynchronous state management, sorting algorithms, and passing data down to pure UI components.

### 2. API Resilience & Error Handling
- **Graceful Degradation:** The UI uses extensive Optional Chaining (`?.`) and Nullish Coalescing (`??`) to guarantee the app will never crash if the API payload changes or drops fields.
- **Error Boundaries:** If global stats or coin lists fail to fetch, independent visual fallbacks are provided.

### 3. UI/UX Intuition
- **Skeleton Loaders:** The initial load triggers a full-page Skeleton Loader that identically mimics the structure of the dashboard to maintain structural continuity and reduce cognitive load.
- **Mobile-First Modals & Drawers:** Implemented fully responsive touch-friendly menus and dropdowns.
- **Micro-interactions:** Interactive hover states on table rows, color-coded performance badges, smooth transitions on theme toggles, and modal entrance animations.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with your CoinGecko API key:
   ```env
   VITE_COINGECKO_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Built With
- **React** (Vite)
- **Tailwind CSS** (Styling & Dark Mode)
- **Lucide React** (Icons)
- **Recharts** (Data Visualization)
- **CoinGecko API** (Data Source)
