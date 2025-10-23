import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import DarkModeToggle from "./DarkModeToggle"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart, Menu, X } from "lucide-react"
import { supabase } from "../lib/supabaseClient"
import { User } from "lucide-react"

export default function Navbar() {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // 🧩 جلب عدد المنتجات في السلة عند تسجيل الدخول
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0)
        return
      }

      const { count, error } = await supabase
        .from("cart")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (error) console.error("Error fetching cart count:", error)
      else setCartCount(count || 0)
    }

    fetchCartCount()
  }, [user])

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow relative">
      {/* ===== Logo ===== */}
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer">
          🛒 ShopEase
        </h1>
      </Link>

      {/* ===== زر القائمة للموبايل ===== */}
      <button
        className="md:hidden text-gray-800 dark:text-gray-200"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* ===== العناصر الأساسية ===== */}
      <div className="hidden md:flex items-center gap-4">


        <DarkModeToggle />

        <Link to="/cart" className="relative p-2">
          <ShoppingCart size={22} className="text-gray-800 dark:text-gray-200" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link
              to="/orders"
              className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-1 border border-gray-300 hover:border-gray-600 dark:hover:border-blue-400 px-2 py-1 rounded transition-colors duration-300"
            >
                <User />
            {user.identities?.[0]?.identity_data?.full_name || user.email}
            </Link>

            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.reload()
              }}
              className="ml-2 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 px-2 py-1 rounded transition-colors duration-300 cursor-pointer"
            >
              تسجيل خروج
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-gray-800 dark:text-gray-200 border border-gray-300 hover:border-gray-600 dark:hover:border-blue-400 px-2 py-1 rounded transition-colors duration-300"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>

      {/* ===== قائمة الموبايل ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50"
          >

            <div className="flex items-center gap-3">
              <DarkModeToggle />
              <Link to="/cart" className="relative p-2">
                <ShoppingCart size={22} className="text-gray-800 dark:text-gray-200" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {user ? (
              <>
                <Link
                  to="/orders"
                  className="text-gray-800 dark:text-gray-200 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  طلباتي
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.reload()
                  }}
                  className="text-red-600 hover:underline"
                >
                  تسجيل خروج
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 dark:text-gray-200 hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
