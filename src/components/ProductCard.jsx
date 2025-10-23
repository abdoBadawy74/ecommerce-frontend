import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProductCard({ product }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = async () => {
        if (!user) return navigate("/login");

        try {
            const { error } = await supabase
                .from("cart")
                .insert({
                    user_id: user.id,
                    product_id: product.id,
                    quantity: 1,
                });

            if (error) throw error;

            alert(`🛒 تمت إضافة ${product.name} إلى العربة بنجاح!`);
        } catch (err) {
            console.error(err.message);
            alert("حدث خطأ أثناء إضافة المنتج إلى العربة ❌");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition">
            <img
                src={product.image_url}
                alt={product.name}
                className="rounded-lg w-full h-48 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                {product.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{product.price} جنيه</p>
            <button
                onClick={handleAddToCart}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                أضف إلى العربة
            </button>
        </div>
    );
}
