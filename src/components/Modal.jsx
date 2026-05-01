import { X, Info, TrendingUp, TrendingDown } from "lucide-react";
import { formatMarketCap, getCurrencySymbol } from "../utils/formatters";
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { fetchCoinChart } from "../services/api";
import { AnimatePresence, motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {getCurrencySymbol(currency)}{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function Modal({ selectedCoin, setSelectedCoin, currency = "USD" }) {
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);

  useEffect(() => {
    if (!selectedCoin) return;
    
    let isMounted = true;
    const getChartData = async () => {
      setLoadingChart(true);
      try {
        const data = await fetchCoinChart(selectedCoin.id, days, currency);
        if (!isMounted) return;
        
        const formattedData = data.prices.map((item) => {
          const date = new Date(item[0]);
          return {
            date: days === 1 ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
            price: item[1]
          };
        });
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart", error);
      } finally {
        if (isMounted) setLoadingChart(false);
      }
    };
    
    getChartData();
    
    return () => { isMounted = false; };
  }, [selectedCoin, days, currency]);

  return (
    <AnimatePresence>
      {selectedCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 z-[100]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
            onClick={() => setSelectedCoin(null)} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full sm:h-auto max-w-2xl sm:max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-2xl rounded-t-2xl sm:rounded-2xl mt-auto sm:mt-0 border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => setSelectedCoin(null)}
              className="absolute z-10 top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
            </button>

            <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 p-2 border border-gray-200 dark:border-gray-600 shadow-inner">
              <img src={selectedCoin.image} alt={selectedCoin.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{selectedCoin.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                  {selectedCoin.symbol}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Rank #{selectedCoin.market_cap_rank || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                Current Price
                <Info className="w-3.5 h-3.5 opacity-50" />
              </p>
              <div className="text-3xl font-bold tracking-tight mb-2">
                {getCurrencySymbol(currency)}{selectedCoin.current_price?.toLocaleString()}
              </div>
              <div className={`flex items-center text-sm font-medium ${selectedCoin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {selectedCoin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1.5" /> : <TrendingDown className="w-4 h-4 mr-1.5" />}
                {selectedCoin.price_change_percentage_24h != null ? `${selectedCoin.price_change_percentage_24h > 0 ? "+" : ""}${selectedCoin.price_change_percentage_24h.toFixed(2)}%` : "N/A"} (24h)
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">24h High</span>
                <span className="font-semibold text-green-500">{getCurrencySymbol(currency)}{selectedCoin.high_24h?.toLocaleString() || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">24h Low</span>
                <span className="font-semibold text-red-500">{getCurrencySymbol(currency)}{selectedCoin.low_24h?.toLocaleString() || "N/A"}</span>
              </div>
            </div>

            <div className="sm:col-span-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Price Trend</p>
                <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                  {[7, 30, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`text-xs px-3 py-1 rounded-md transition-colors ${days === d ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-56 w-full">
                {loadingChart ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10, fill: '#9ca3af' }} 
                        minTickGap={30}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        hide 
                      />
                      <Tooltip 
                        content={<CustomTooltip currency={currency} />} 
                        cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={selectedCoin.price_change_percentage_24h >= 0 ? "#22c55e" : "#ef4444"} 
                        strokeWidth={2} 
                        dot={false} 
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-500">
                    No trend data available
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5">Market Cap</p>
                <p className="font-semibold text-sm sm:text-base">{formatMarketCap(selectedCoin.market_cap, currency)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5">Volume (24h)</p>
                <p className="font-semibold text-sm sm:text-base">{formatMarketCap(selectedCoin.total_volume, currency)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5">Circulating Supply</p>
                <p className="font-semibold text-sm sm:text-base">{selectedCoin.circulating_supply != null ? `${(selectedCoin.circulating_supply / 1e6).toFixed(2)}M ${selectedCoin.symbol?.toUpperCase()}` : "N/A"}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5">All-Time High</p>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-green-500">{getCurrencySymbol(currency)}{selectedCoin.ath?.toLocaleString() || "N/A"}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{selectedCoin.ath_date ? new Date(selectedCoin.ath_date).toLocaleDateString() : ""}</p>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1.5">All-Time Low</p>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-red-500">{getCurrencySymbol(currency)}{selectedCoin.atl?.toLocaleString() || "N/A"}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{selectedCoin.atl_date ? new Date(selectedCoin.atl_date).toLocaleDateString() : ""}</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
