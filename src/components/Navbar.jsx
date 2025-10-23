import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import DarkModeToggle from "./DarkModeToggle"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { supabase } from "../lib/supabaseClient"

export default function Navbar() {
    const { user } = useAuth()
    const [cartCount, setCartCount] = useState(0)
    const [role, setRole] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)

    // 🛒 جلب عدد المنتجات في السلة
    useEffect(() => {
        const fetchCartCount = async () => {
            if (!user) return setCartCount(0)
            const { count, error } = await supabase
                .from("cart")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
            if (!error) setCartCount(count || 0)
        }
        fetchCartCount()
    }, [user])

    // 🧠 جلب دور المستخدم
    useEffect(() => {
        const fetchRole = async () => {
            if (!user) return setRole(null)
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
        <nav className="bg-white dark:bg-gray-900 shadow px-4 py-3 md:px-8 sticky top-0 z-50">
            <div className="flex justify-between items-center">
                {/* ===== Logo ===== */}
                <Link to="/" className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">🛒 ShopEase</h1>
                </Link>

                {/* ===== Desktop Section ===== */}
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

                    {role === "admin" && (
                        <Link
                            to="/admin"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            لوحة التحكم
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link
                                to="/orders"
                                className="flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-600 hover:text-white transition"
                            >
                                <User size={18} />
                                {user.identities?.[0]?.identity_data?.full_name || user.email}
                            </Link>
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut()
                                    window.location.pathname = "/"
                                }}
                                className="ml-2 text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition"
                            >
                                تسجيل خروج
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-blue-600 dark:text-gray-200 border border-blue-600 dark:border-gray-200 hover:bg-blue-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            تسجيل الدخول
                        </Link>
                    )}
                </div>

                {/* ===== Mobile Menu Button ===== */}
                <button
                    className="md:hidden p-2 rounded-lg border border-gray-300 dark:border-gray-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* ===== Mobile Dropdown ===== */}
            {menuOpen && (
                <div className="flex flex-col gap-4 mt-4 md:hidden bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">

                    <Link to="/cart" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                        <ShoppingCart size={20} />
                        <span>السلة ({cartCount})</span>
                    </Link>

                    {role === "admin" && (
                        <Link
                            to="/admin"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold px-4 py-2 rounded-lg transition"
                            onClick={() => setMenuOpen(false)}
                        >
                            لوحة التحكم
                        </Link>
                    )}

                    {user ? (
                        <>
                            <Link
                                to="/orders"
                                className="flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-600 hover:text-white transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                <User size={18} />
                                {user.identities?.[0]?.identity_data?.full_name || user.email}
                            </Link>
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut()
                                    window.location.pathname = "/"
                                }}
                                className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition"
                            >
                                تسجيل خروج
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-blue-600 dark:text-gray-200 border border-blue-600 dark:border-gray-200 hover:bg-blue-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition"
                            onClick={() => setMenuOpen(false)}
                        >
                            تسجيل الدخول
                        </Link>
                    )}

                    <DarkModeToggle />
                </div>
            )}
        </nav>
    )
}
