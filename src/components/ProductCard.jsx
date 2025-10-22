import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function ProductCard({ product }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleAddToCart = () => {
        if (!user) return navigate("/login")
        alert(`تمت إضافة ${product.name} إلى العربة ✅`)
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition">
            <img src={product.image_url} alt={product.name} className="rounded-lg w-full h-48 object-cover" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{product.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{product.price} جنيه</p>
            <button onClick={handleAddToCart} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                أضف إلى العربة
            </button>
        </div>
    )
}
