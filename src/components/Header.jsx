import { Activity, Sun, Moon } from "lucide-react";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#0B0E14]/95 backdrop-blur px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-500" />
        <span className="text-xl font-bold tracking-tight">CoinVoyage</span>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}
