import { Activity, Sun, Moon, ChevronDown, BarChart2, Star, Wrench, Menu, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Header({ darkMode, setDarkMode, currency, setCurrency, currentTab, setCurrentTab, favoritesCount }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#0B0E14]/95 backdrop-blur px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center w-full">
      <div className="flex items-center gap-8 lg:gap-12">
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setCurrentTab?.("market")}
        >
          <Activity className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">CoinVoyage</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 mt-1">
          <button 
            onClick={() => setCurrentTab?.("market")}
            className={`flex items-center gap-2 font-medium pb-1.5 border-b-2 transition-colors ${currentTab === "market" ? "text-blue-500 border-blue-500" : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"}`}
          >
            <BarChart2 className="w-4 h-4" /> Market
          </button>
          <button 
            onClick={() => setCurrentTab?.("watchlist")}
            className={`flex items-center gap-2 font-medium pb-1.5 border-b-2 transition-colors ${currentTab === "watchlist" ? "text-blue-500 border-blue-500" : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Star className="w-4 h-4" /> Watchlist
            {favoritesCount > 0 && (
              <span className={`text-[10px] rounded-full px-2 py-0.5 ml-0.5 ${currentTab === "watchlist" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                {favoritesCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setCurrentTab?.("trending")}
            className={`flex items-center gap-2 font-medium pb-1.5 border-b-2 transition-colors ${currentTab === "trending" ? "text-blue-500 border-blue-500" : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"}`}
          >
            <TrendingUp className="w-4 h-4" /> Trending
          </button>
          <button 
            onClick={() => setCurrentTab?.("tools")}
            className={`flex items-center gap-2 font-medium pb-1.5 border-b-2 transition-colors ${currentTab === "tools" ? "text-blue-500 border-blue-500" : "text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Wrench className="w-4 h-4" /> Tools
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative group hidden sm:block">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-1.5 pl-3 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-sm transition-colors"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-500 dark:text-gray-400 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0B0E14] border-b border-gray-200 dark:border-gray-800 shadow-lg py-4 px-4 flex flex-col gap-2 md:hidden">
          <button 
            onClick={() => { setCurrentTab?.("market"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 font-medium px-3 py-2.5 rounded-lg transition-colors ${currentTab === "market" ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          >
            <BarChart2 className="w-5 h-5" /> Market
          </button>
          <button 
            onClick={() => { setCurrentTab?.("watchlist"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 font-medium px-3 py-2.5 rounded-lg transition-colors ${currentTab === "watchlist" ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          >
            <Star className="w-5 h-5" /> Watchlist
            {favoritesCount > 0 && (
              <span className={`text-[10px] rounded-full px-2 py-0.5 ml-auto ${currentTab === "watchlist" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                {favoritesCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setCurrentTab?.("trending"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 font-medium px-3 py-2.5 rounded-lg transition-colors ${currentTab === "trending" ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          >
            <TrendingUp className="w-5 h-5" /> Trending
          </button>
          <button 
            onClick={() => { setCurrentTab?.("tools"); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 font-medium px-3 py-2.5 rounded-lg transition-colors ${currentTab === "tools" ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          >
            <Wrench className="w-5 h-5" /> Tools
          </button>

          <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block px-1">Currency</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => { setCurrency(e.target.value); setIsMobileMenuOpen(false); }}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-3 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium text-sm transition-colors"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
