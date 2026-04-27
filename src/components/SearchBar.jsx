import { Search, RefreshCcw } from "lucide-react";

export default function SearchBar({ search, setSearch, timeUntilUpdate, onRefresh }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by coin name or symbol..."
          className="w-full bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-800 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-3 bg-white dark:bg-[#1A1F2E] rounded-full px-4 py-2 border border-gray-300 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">Next update in {timeUntilUpdate}s</span>
          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear" style={{ width: `${(timeUntilUpdate / 60) * 100}%` }} />
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}
