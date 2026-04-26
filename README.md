# Crypto Market Dashboard
Live Demo: https://cryptocoininsight.vercel.app

A high-performance cryptocurrency dashboard built with React, Tailwind CSS, and the CoinGecko API, focusing on real-time data handling, clean architecture, and responsive UI.

## Features & Implementation

This project goes above and beyond the baseline requirements, delivering a production-ready interface with several premium features:

- **Live Market Data:** Fetches the top 50 cryptocurrencies via the CoinGecko API.
- **Global Market Overview:** Real-time metrics for Total Market Cap, 24H Volume, BTC Dominance, and Active Coins.
- **Client-Side Pagination & Sorting:** A highly optimized table that supports multi-directional sorting (Rank, Price, Market Cap, etc.) and page navigation without re-rendering delays.
- **Lightning Fast Search:** Real-time filtering powered by `useMemo` to ensure lag-free keystrokes.
- **Deep Insights Modal:** A glassmorphism-styled drawer that provides advanced metrics (24h High/Low, Circulating Supply, All-Time High) when clicking on any asset.
- **Auto-Polling & Progress:** Data refreshes automatically every 60 seconds, visualized by a sleek, animated progress bar.
- **State Persistence:** User's preferred theme (Dark/Light) is saved to `localStorage` and respected across sessions.
- **Responsive Design:** Completely fluid grid and table layouts ensuring pixel-perfect display across Desktop, Tablet, and Mobile.

## Technical Decisions & Architecture (Evaluation Criteria)

### 1. Component Modularity & Clean Folder Structures
The application is structured to mimic a large-scale production app rather than a beginner monolithic project:
- **`src/components/`**: UI logic is decoupled into highly reusable blocks (`Header`, `SearchBar`, `CoinTable`, `GlobalStats`, `SkeletonLoader`, etc.).
- **`src/utils/`**: Pure logic and formatting functions (like `formatMarketCap`) are completely isolated from the UI, ensuring high testability.
- **`App.jsx`**: Acts purely as the orchestration layer, handling asynchronous state management, sorting algorithms, and passing data down to pure UI components.

### 2. API Resilience & Error Handling
- **Graceful Degradation:** The UI uses extensive Optional Chaining (`?.`) and Nullish Coalescing (`??`) to guarantee the app will never crash if the API payload changes or drops fields.
- **Error Boundaries:** If the `fetchGlobalStats` promise fails, it is caught independently, allowing the main coin table to still render gracefully.

### 3. UI/UX Intuition
- **Skeleton Loaders:** Instead of blank screens or basic text, the initial load triggers a full-page Skeleton Loader that identically mimics the structure of the dashboard to maintain structural continuity and reduce cognitive load.
- **Aesthetic Edge:** Implemented a very deep, rich dark mode (`#0B0E14` and `#131722`) rather than standard grays to give a premium, "terminal-like" financial feel.
- **Micro-interactions:** Interactive hover states on table rows, smooth transitions on theme toggles, and modal entrance animations (`animate-in fade-in zoom-in`).
- **Responsive Tables:** Ensured financial data uses `whitespace-nowrap` so it is never awkwardly broken into multiple lines on mobile devices.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Built With
- **React** (Vite)
- **Tailwind CSS** (Styling & Dark Mode)
- **Lucide React** (Icons)
- **CoinGecko Public API** (Data Source)
