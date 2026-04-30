import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import CoinRow from "./CoinRow";

const SortHeader = ({ label, sortKey, align = "left", sortConfig, handleSort }) => {
  const isActive = sortConfig && sortConfig.key === sortKey;
  return (
    <th 
      className={`p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors select-none whitespace-nowrap ${align === "right" ? "text-right" : "text-left"}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : ""}`}>
        {label}
        {!isActive ? (
          <ArrowUpDown className="w-3 h-3 text-gray-400" />
        ) : sortConfig.direction === "asc" ? (
          <ArrowUp className="w-3 h-3 text-blue-500" />
        ) : (
          <ArrowDown className="w-3 h-3 text-blue-500" />
        )}
      </div>
    </th>
  );
};

export default function CoinTable({
  paginatedCoins,
  sortConfig,
  handleSort,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCoins,
  itemsPerPage,
  setItemsPerPage,
  selectedCoin,
  setSelectedCoin,
  favorites,
  toggleFavorite,
  currency
}) {
  if (totalCoins === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 py-8 text-center">
        No matching coins found
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-[#131722] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto overflow-y-auto h-[75vh] min-h-[600px]">
        <table className="w-full relative">
          <thead className="bg-gray-50 dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 shadow-sm backdrop-blur">
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
              <th className="p-3 w-10"></th>
              <SortHeader label="#" sortKey="market_cap_rank" sortConfig={sortConfig} handleSort={handleSort} />
              <SortHeader label="Coin" sortKey="name" sortConfig={sortConfig} handleSort={handleSort} />
              <SortHeader label="Price" sortKey="current_price" align="right" sortConfig={sortConfig} handleSort={handleSort} />
              <SortHeader label="24H" sortKey="price_change_percentage_24h" align="right" sortConfig={sortConfig} handleSort={handleSort} />
              <SortHeader label="24H Volume" sortKey="total_volume" align="right" sortConfig={sortConfig} handleSort={handleSort} />
              <SortHeader label="Market Cap" sortKey="market_cap" align="right" sortConfig={sortConfig} handleSort={handleSort} />
              <th className="p-3 text-right whitespace-nowrap">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedCoins.map((coin, index) => (
                <CoinRow 
                  key={coin.id}
                  coin={coin}
                  index={index}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  selectedCoin={selectedCoin}
                  setSelectedCoin={setSelectedCoin}
                  isFavorite={favorites.includes(coin.id)}
                  toggleFavorite={toggleFavorite}
                  currency={currency}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Rows</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white dark:bg-[#0B0E14] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-1 pl-3 pr-8 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                >
                  {[10, 20, 50, 100].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowDown className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCoins)} of {totalCoins} results
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="text-gray-500 dark:text-gray-400 px-1">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
