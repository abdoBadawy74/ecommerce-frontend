import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) return navigate("/login");
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
        if (!error) setOrders(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">📦 طلباتك السابقة</h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">لا توجد طلبات بعد.</p>
            ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                            <p>رقم الطلب: {order.id}</p>
                            <p>الإجمالي: {order.total_price} جنيه</p>
                            <p>الحالة: {order.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
