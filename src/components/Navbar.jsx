import { useState, useEffect } from "react";
import { ShoppingCart, Sun, Moon } from "lucide-react";

export default function Navbar({ onToggleTheme, theme }) {
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer">
        🛒 ShopEase
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
        />

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2">
          <ShoppingCart size={22} className="text-gray-800 dark:text-gray-200" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </nav>
  );
}
