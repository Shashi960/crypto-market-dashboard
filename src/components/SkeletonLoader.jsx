export default function SkeletonLoader({ darkMode }) {
  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0E14] px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-full w-full md:w-96"></div>
          <div className="bg-white dark:bg-[#131722] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-12 bg-gray-100 dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800"></div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-32 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1"></div>
                <div className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
