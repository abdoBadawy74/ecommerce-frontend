import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!user) return navigate("/login");
        fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data, error } = await supabase
                .from("cart")
                .select("id, quantity, product:product_id (id, name, price, image_url)")
                .eq("user_id", user.id);

            if (error) throw error;
            setCartItems(data);
        } catch (err) {
            console.error(err.message);
            alert("حدث خطأ أثناء تحميل العربة ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        await supabase.from("cart").delete().eq("id", id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const total = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (cartItems.length === 0) return alert("🛒 لا توجد منتجات في العربة!");
        setProcessing(true);

        try {
            // 1️⃣ إنشاء الطلب في جدول orders
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert([
                    {
                        user_id: user.id,
                        total_price: total,
                        status: "pending",
                        // service_role: "user"
                    },
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2️⃣ إضافة العناصر في order_items
            const orderItemsData = cartItems.map((item) => ({
                order_id: order.id,
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
            }));

            const { error: orderItemsError } = await supabase
                .from("order_items")
                .insert(orderItemsData);

            if (orderItemsError) throw orderItemsError;

            // 3️⃣ حذف محتوى العربة
            await supabase.from("cart").delete().eq("user_id", user.id);

            // 4️⃣ تحديث الواجهة
            setCartItems([]);
            alert("✅ تم إنشاء الطلب بنجاح!");
            navigate("/orders");
        } catch (err) {
            console.error(err.message);
            alert("❌ حدث خطأ أثناء إتمام الطلب!");
        } finally {
            setProcessing(false);
        }
    };

    if (loading)
        return <p className="text-center text-gray-600 dark:text-gray-300 mt-10">جاري التحميل...</p>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">🛒 عربة التسوق</h2>

            {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    لا توجد منتجات في العربة حالياً.
                </p>
            ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.product.price} جنيه × {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                إزالة
                            </button>
                        </div>
                    ))}

                    <div className="text-right mt-6">
                        <p className="text-xl font-semibold">
                            الإجمالي: {total.toFixed(2)} جنيه
                        </p>
                        <button
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                            onClick={handleCheckout}
                            disabled={processing}
                        >
                            {processing ? "جاري إنشاء الطلب..." : "إتمام الطلب"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
