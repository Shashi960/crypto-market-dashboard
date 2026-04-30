import { useEffect, useMemo, useState } from "react";
import { fetchCoins, fetchGlobalStats, fetchTrendingMarketData } from "./services/api";
import { History, Link2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Header from "./components/Header";
import GlobalStats from "./components/GlobalStats";
import SearchBar from "./components/SearchBar";
import CoinTable from "./components/CoinTable";
import Modal from "./components/Modal";
import SkeletonLoader from "./components/SkeletonLoader";
import ToolsView from "./components/ToolsView";

function App() {
  const [coins, setCoins] = useState([]);
  const [trendingCoinsData, setTrendingCoinsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [sortConfig, setSortConfig] = useState({ key: "market_cap", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("market");
  const [currency, setCurrency] = useState("USD");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [globalData, setGlobalData] = useState(null);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(60);
  const [favorites, setFavorites] = useState(() => {
    try {
      const item = localStorage.getItem("favorites");
      return item ? JSON.parse(item) : [];
    } catch (e) {
      return [];
    }
  });

  const getData = async (isInitial = false) => {
    if (isInitial) setLoading(true);

    try {
      const [coinsData, globalStats, trendingData] = await Promise.all([
        fetchCoins(currency),
        fetchGlobalStats().catch(() => null),
        fetchTrendingMarketData(currency).catch(() => [])
      ]);
      setCoins(coinsData);
      setTrendingCoinsData(trendingData || []);
      if (globalStats && globalStats.data) {
        setGlobalData(globalStats.data);
      }
      setError(null);
      setLastUpdated(new Date());
      setTimeUntilUpdate(60);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    getData(true);

    const interval = setInterval(() => getData(false), 60000);
    const countdownInterval = setInterval(() => {
      setTimeUntilUpdate((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [currency]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentTab === "trending") {
      setSortConfig(null);
    } else {
      setSortConfig({ key: "market_cap", direction: "desc" });
    }
  }, [currentTab]);

  const toggleFavorite = (coinId, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const filteredCoins = useMemo(() => {
    let list = coins;
    if (currentTab === "watchlist") {
      list = list.filter(c => favorites.includes(c.id));
    } else if (currentTab === "trending") {
      list = trendingCoinsData.length > 0 ? trendingCoinsData : coins;
    }
    
    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((coin) =>
      coin.name?.toLowerCase().includes(q) ||
      coin.symbol?.toLowerCase().includes(q)
    );
  }, [coins, search, currentTab, favorites]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCoins = useMemo(() => {
    let sortableCoins = [...filteredCoins];
    if (sortConfig !== null) {
      sortableCoins.sort((a, b) => {
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        
        // Always show favorites on top
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCoins;
  }, [filteredCoins, sortConfig, favorites]);

  const totalPages = Math.ceil(sortedCoins.length / itemsPerPage);
  const paginatedCoins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCoins.slice(start, start + itemsPerPage);
  }, [sortedCoins, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, coins, currentTab, itemsPerPage]);

  if (loading && coins.length === 0) {
    return <SkeletonLoader darkMode={darkMode} />;
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "dark bg-[#0B0E14]" : "bg-gray-50"}`}>
        <p className="p-6 text-red-500 text-lg font-semibold">{error}</p>
        <button
          onClick={() => getData(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-[#0B0E14] dark:text-white font-sans">
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          currency={currency} 
          setCurrency={setCurrency} 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          favoritesCount={favorites.length}
        />

        <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
          {lastUpdated && currentTab === "market" && (
            <div className="flex justify-end mb-2 items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <History className="w-3.5 h-3.5" />
                <span>Last updated: {lastUpdated.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}</span>
              </div>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none">
                <Link2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {currentTab === "tools" ? (
              <motion.div
                key="tools"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ToolsView coins={coins} currency={currency} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {currentTab === "market" && (
                  <GlobalStats globalData={globalData} currency={currency} />
                )}

                <SearchBar 
                  search={search} 
                  setSearch={setSearch} 
                  timeUntilUpdate={timeUntilUpdate} 
                  onRefresh={() => getData(true)} 
                />

                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">
                    {currentTab === "watchlist" ? "Your Watchlist" : currentTab === "trending" ? "Trending Coins" : "Market Overview"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentTab === "watchlist" 
                      ? "Cryptocurrencies you are tracking" 
                      : currentTab === "trending" ? "Top cryptocurrencies gaining momentum" : "Top cryptocurrencies by market capitalization"}
                  </p>
                </div>

                <CoinTable 
                  paginatedCoins={paginatedCoins}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  totalCoins={sortedCoins.length}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  selectedCoin={selectedCoin}
                  setSelectedCoin={setSelectedCoin}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  currency={currency}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="w-full py-6 text-center border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0E14]">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            Data provided by 
            <a 
              href="https://www.coingecko.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              CoinGecko API
            </a>
          </p>
        </footer>
      </div>

      <Modal selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} currency={currency} />
    </div>
  );
}

export default App;
