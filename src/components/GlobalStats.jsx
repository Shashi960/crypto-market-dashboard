import { Globe, BarChart3, PieChart } from "lucide-react";
import { getCurrencySymbol } from "../utils/formatters";
import { motion } from "framer-motion";

const ActiveCoinsLogo = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 -ml-1">
    {/* Orbit Ring */}
    <ellipse cx="50" cy="50" rx="45" ry="18" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
    {/* Planets on Orbit */}
    <circle cx="8" cy="48" r="3" fill="#a78bfa" />
    <circle cx="90" cy="45" r="4" fill="#c4b5fd" />
    
    {/* Bottom Purple Coin */}
    <path d="M22 55 v15 c0 8 56 8 56 0 v-15 Z" fill="#3b0764" />
    <ellipse cx="50" cy="55" rx="28" ry="10" fill="#4c1d95" />
    
    {/* Top Gold Coin */}
    <path d="M22 40 v15 c0 8 56 8 56 0 v-15 Z" fill="#92400e" />
    <ellipse cx="50" cy="40" rx="28" ry="10" fill="#f59e0b" />
    
    {/* Inner Gold detail */}
    <ellipse cx="50" cy="40" rx="20" ry="6" fill="none" stroke="#fef3c7" strokeWidth="1" opacity="0.6" />
    
    {/* Star/Sparkle */}
    <path d="M50 33 L51.5 38.5 L57 40 L51.5 41.5 L50 47 L48.5 41.5 L43 40 L48.5 38.5 Z" fill="#fef3c7" />
  </svg>
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function GlobalStats({ globalData, currency = "USD" }) {
  const sym = getCurrencySymbol(currency);
  const mcap = globalData ? globalData.total_market_cap?.[currency.toLowerCase()] : 2680000000000;
  const vol = globalData ? globalData.total_volume?.[currency.toLowerCase()] : 74280000000;
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-8 mb-8 border-b border-gray-200 dark:border-gray-800"
    >
      {/* Total Market Cap */}
      <motion.div variants={item} className="bg-white dark:bg-[#131722] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:border-blue-400 dark:hover:border-gray-700 transition-all group">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 relative transition-transform group-hover:scale-110">
          <Globe className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            {sym}
          </div>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">{sym}{mcap ? (mcap / 1e12).toFixed(2) + 'T' : 'N/A'}</h3>
          <p className="font-semibold text-gray-900 dark:text-white mb-0.5">Total market cap</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Global value</p>
        </div>
      </motion.div>

      {/* 24H Volume */}
      <motion.div variants={item} className="bg-white dark:bg-[#131722] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:border-green-400 dark:hover:border-gray-700 transition-all group">
        <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 mb-4 relative transition-transform group-hover:scale-110">
          <BarChart3 className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">{sym}{vol ? (vol / 1e9).toFixed(2) + 'B' : 'N/A'}</h3>
          <p className="font-semibold text-gray-900 dark:text-white mb-0.5">24H volume</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Trading activity</p>
        </div>
      </motion.div>

      {/* BTC Dominance */}
      <motion.div variants={item} className="bg-white dark:bg-[#131722] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:border-orange-400 dark:hover:border-gray-700 transition-all group">
        <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 relative transition-transform group-hover:scale-110">
          <PieChart className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">
            {globalData ? globalData.market_cap_percentage?.btc?.toFixed(1) + '%' : '58.1%'}
          </h3>
          <p className="font-semibold text-gray-900 dark:text-white mb-0.5">BTC dominance</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">ETH {globalData ? globalData.market_cap_percentage?.eth?.toFixed(1) + '%' : '10.5%'}</p>
        </div>
      </motion.div>

      {/* Active Coins */}
      <motion.div variants={item} className="bg-white dark:bg-[#131722] p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:border-purple-400 dark:hover:border-gray-700 transition-all group">
        <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 relative transition-transform group-hover:scale-110">
          <ActiveCoinsLogo />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full border-2 border-white dark:border-[#131722]"></div>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">
            {globalData ? globalData.active_cryptocurrencies.toLocaleString() : '17,509'}
          </h3>
          <p className="font-semibold text-gray-900 dark:text-white mb-0.5">Active coins</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Live assets</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
