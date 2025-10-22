import { Link } from "react-router-dom"
import DarkModeToggle from "./DarkModeToggle"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart } from "lucide-react"

export default function Navbar() {
    const { user } = useAuth()

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow">
            <Link to="/">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer">
                    🛒 ShopEase
                </h1>
            </Link>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                />


                <DarkModeToggle />

                <button className="relative p-2">
                    <ShoppingCart size={22} className="text-gray-800 dark:text-gray-200" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        3
                    </span>
                </button>
            </div>
        </nav>
    )
}
