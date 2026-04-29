import { Star } from "lucide-react";
import { formatMarketCap, getCurrencySymbol } from "../utils/formatters";

const CoinSparkline = ({ data, isPositive }) => {
  if (!data || data.length === 0) return <div className="w-24 h-10 mx-auto"></div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 35 - ((d - min) / range) * 30; // Scale to fit 0-40 viewBox
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 40" className="w-24 h-10 overflow-visible mx-auto" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={isPositive ? "#22c55e" : "#ef4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default function CoinRow({ coin, index, currentPage, itemsPerPage, selectedCoin, setSelectedCoin, isFavorite, toggleFavorite, currency }) {
  const price = coin.current_price ?? 0;
  const marketCap = coin.market_cap ?? 0;
  const volume = coin.total_volume ?? 0;
  const change1h = coin.price_change_percentage_1h_in_currency;
  const change24h = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h;
  const change7d = coin.price_change_percentage_7d_in_currency;
  const sparklineData = coin.sparkline_in_7d?.price || [];
  const rank = coin.market_cap_rank || ((currentPage - 1) * itemsPerPage + index + 1);

  const renderChange = (change) => (
    <td className="p-3 text-right whitespace-nowrap">
      <div className={`text-sm font-medium ${
        change == null ? "text-gray-500" : change >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
      }`}>
        {change == null ? "N/A" : (
          <>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </>
        )}
      </div>
    </td>
  );

  return (
    <tr
      onClick={() => setSelectedCoin(coin)}
      className={`border-t border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 ${
        selectedCoin?.id === coin.id
          ? "bg-gray-200 dark:bg-gray-700"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/70"
      }`}
    >
      <td className="p-3">
        <button
          onClick={(e) => toggleFavorite(coin.id, e)}
          className="focus:outline-none hover:scale-110 transition-transform"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={`w-5 h-5 ${
              isFavorite
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400"
            }`}
          />
        </button>
      </td>
      <td className="p-3 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
        {rank}
      </td>
      <td className="p-3 flex items-center gap-3 min-w-[150px]">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-8 h-8"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">
            {coin.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {coin.symbol?.toUpperCase()}
          </p>
        </div>
      </td>
      <td className="p-3 font-medium text-gray-700 dark:text-gray-300 text-right whitespace-nowrap">
        {getCurrencySymbol(currency)}{price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
      </td>
      {renderChange(change24h)}
      <td className="p-3 text-gray-700 dark:text-gray-300 text-right whitespace-nowrap">
        {formatMarketCap(volume, currency)}
      </td>
      <td className="p-3 text-gray-700 dark:text-gray-300 text-right whitespace-nowrap">
        {formatMarketCap(marketCap, currency)}
      </td>
      <td className="p-3 text-right whitespace-nowrap">
        <CoinSparkline data={sparklineData} isPositive={change7d >= 0} />
      </td>
    </tr>
  );
}
