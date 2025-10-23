import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import DarkModeToggle from "./DarkModeToggle"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart } from "lucide-react"
import { supabase } from "../lib/supabaseClient"

export default function Navbar() {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(0)
  const [role, setRole] = useState(null) // 🧩 لحفظ دور المستخدم

  // 🛒 جلب عدد المنتجات في السلة
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
      if (!error) setCartCount(count || 0)
    }
    fetchCartCount()
  }, [user])

  // 🧠 جلب دور المستخدم من جدول profiles
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!error && data) setRole(data.role)
    }

    fetchRole()
  }, [user])

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow">
      {/* ===== Logo ===== */}
      <Link to="/">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer">
          🛒 ShopEase
        </h1>
      </Link>

      {/* ===== Right Section ===== */}
      <div className="flex items-center gap-4">
        {/* ===== Search Box ===== */}
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          className="hidden md:block px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
        />

        {/* ===== Theme Toggle ===== */}
        <DarkModeToggle />

        {/* ===== Cart ===== */}
        <Link to="/cart" className="relative p-2">
          <ShoppingCart size={22} className="text-gray-800 dark:text-gray-200" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* ===== Admin Dashboard Link (only if admin) ===== */}
        {role === "admin" && (
          <Link
            to="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            لوحة التحكم
          </Link>
        )}

        {/* ===== Auth Section ===== */}
        {user ? (
          <>
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              مرحبًا، {user.identities?.[0]?.identity_data?.full_name || user.email}
            </span>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.reload()
              }}
              className="ml-2 text-red-600 hover:underline"
            >
              تسجيل خروج
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-gray-800 dark:text-gray-200 hover:underline"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  )
}
