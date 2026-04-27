import { useEffect, useMemo, useState } from "react";
import { fetchCoins, fetchGlobalStats } from "./services/api";

import Header from "./components/Header";
import GlobalStats from "./components/GlobalStats";
import SearchBar from "./components/SearchBar";
import CoinTable from "./components/CoinTable";
import Modal from "./components/Modal";
import SkeletonLoader from "./components/SkeletonLoader";

function App() {
  const [coins, setCoins] = useState([]);
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
  const itemsPerPage = 10;
  const [globalData, setGlobalData] = useState(null);
  const [nextUpdateProgress, setNextUpdateProgress] = useState(0);

  const getData = async (isInitial = false) => {
    if (isInitial) setLoading(true);

    try {
      const [coinsData, globalStats] = await Promise.all([
        fetchCoins(),
        fetchGlobalStats().catch(() => null)
      ]);
      setCoins(coinsData);
      if (globalStats && globalStats.data) {
        setGlobalData(globalStats.data);
      }
      setError(null);
      setLastUpdated(new Date());
      setNextUpdateProgress(0);
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
    const progressInterval = setInterval(() => {
      setNextUpdateProgress((prev) => Math.min(prev + (100 / 60), 100));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const filteredCoins = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coins;

    return coins.filter((coin) =>
      coin.name?.toLowerCase().includes(q) ||
      coin.symbol?.toLowerCase().includes(q)
    );
  }, [coins, search]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCoins = useMemo(() => {
    let sortableCoins = [...filteredCoins];
    if (sortConfig !== null) {
      sortableCoins.sort((a, b) => {
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
  }, [filteredCoins, sortConfig]);

  const totalPages = Math.ceil(sortedCoins.length / itemsPerPage);
  const paginatedCoins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCoins.slice(start, start + itemsPerPage);
  }, [sortedCoins, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, coins]);

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
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0B0E14] dark:text-white font-sans">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {lastUpdated && (
            <div className="flex justify-end mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          )}

          <GlobalStats globalData={globalData} />

          <SearchBar 
            search={search} 
            setSearch={setSearch} 
            nextUpdateProgress={nextUpdateProgress} 
            onRefresh={() => getData(true)} 
          />

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Market Overview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top cryptocurrencies by market capitalization</p>
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
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
          />
        </main>
      </div>

      <Modal selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
    </div>
  );
}

export default App;
