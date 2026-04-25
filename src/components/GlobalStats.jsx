import { Activity, BarChart2, PieChart, Link2 } from "lucide-react";

export default function GlobalStats({ globalData }) {
  return (
    <div className="flex flex-col md:flex-row border-b border-gray-200 dark:border-gray-800 pb-8 mb-8 gap-8 md:gap-0">
      <div className="flex-1 md:border-r border-gray-200 dark:border-gray-800 px-4 first:pl-0">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">TOTAL MARKET CAP</span>
          <Activity className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold">${globalData ? (globalData.total_market_cap?.usd / 1e12).toFixed(2) + 'T' : '2.68T'}</span>
          <span className={`text-sm font-medium mb-1 ${globalData && globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {globalData ? `${globalData.market_cap_change_percentage_24h_usd > 0 ? '+' : ''}${globalData.market_cap_change_percentage_24h_usd?.toFixed(2) || '0.00'}%` : '+0.11%'}
          </span>
        </div>
      </div>
      <div className="flex-1 md:border-r border-gray-200 dark:border-gray-800 px-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">24H VOLUME</span>
          <BarChart2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="text-2xl font-bold">${globalData ? (globalData.total_volume?.usd / 1e9).toFixed(2) + 'B' : '74.28B'}</div>
      </div>
      <div className="flex-1 md:border-r border-gray-200 dark:border-gray-800 px-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">BTC DOMINANCE</span>
          <PieChart className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold">{globalData ? globalData.market_cap_percentage?.btc?.toFixed(1) + '%' : '58.1%'}</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ETH {globalData ? globalData.market_cap_percentage?.eth?.toFixed(1) + '%' : '10.5%'}</span>
        </div>
      </div>
      <div className="flex-1 px-4 last:pr-0">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">ACTIVE COINS</span>
          <Link2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="text-2xl font-bold">{globalData ? globalData.active_cryptocurrencies.toLocaleString() : '17,537'}</div>
      </div>
    </div>
  );
}
