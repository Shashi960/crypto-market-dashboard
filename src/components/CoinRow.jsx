import { formatMarketCap } from "../utils/formatters";

export default function CoinRow({ coin, index, currentPage, itemsPerPage, selectedCoin, setSelectedCoin }) {
  const price = coin.current_price ?? 0;
  const marketCap = coin.market_cap ?? 0;
  const volume = coin.total_volume ?? 0;
  const rawChange = coin.price_change_percentage_24h;
  const change = Number.isFinite(rawChange) ? rawChange : null;
  const rank = coin.market_cap_rank || ((currentPage - 1) * itemsPerPage + index + 1);

  return (
    <tr
      onClick={() => setSelectedCoin(coin)}
      className={`border-t border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 ${
        selectedCoin?.id === coin.id
          ? "bg-gray-200 dark:bg-gray-700"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/70"
      }`}
    >
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
        ${price.toLocaleString()}
      </td>
      <td className="p-3 text-right whitespace-nowrap">
        <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold w-16 text-center ${
          change == null
            ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            : change >= 0
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {change == null ? "N/A" : <>{change > 0 ? "+" : ""}{change.toFixed(2)}%</>}
        </div>
      </td>
      <td className="p-3 text-gray-700 dark:text-gray-300 text-right whitespace-nowrap">
        {formatMarketCap(marketCap)}
      </td>
      <td className="p-3 text-gray-700 dark:text-gray-300 text-right whitespace-nowrap">
        {formatMarketCap(volume)}
      </td>
    </tr>
  );
}
