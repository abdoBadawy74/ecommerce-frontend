import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching orders:", error);
      else setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        جاري التحميل...
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white py-20 px-6 text-center relative overflow-hidden">
      {/* ===== Hero-style user info section ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto mb-12"
      >
        <h1 className="text-4xl font-extrabold mb-3">
          👋 مرحبًا <span className="text-yellow-300">{user?.email?.split("@")[0]}</span>
        </h1>
        <p className="text-gray-100 text-lg mb-2">بريدك الإلكتروني: {user?.email}</p>
        <p className="text-gray-100 text-lg">
          عدد الطلبات السابقة:{" "}
          <span className="font-semibold text-yellow-300">{orders.length}</span>
        </p>
      </motion.div>

      {/* ===== Decorative background glow ===== */}
      <motion.div
        className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-2/3 h-40 bg-white/10 blur-3xl rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />

      {/* ===== Orders List Section ===== */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {orders.length === 0 ? (
          <div className="bg-white/10 dark:bg-gray-800/50 rounded-xl p-8 shadow-lg">
            <p className="text-gray-100 mb-4 text-lg">ما عندكش طلبات سابقة 📭</p>
            <button
              onClick={() => navigate("/")}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg"
            >
              تسوق الآن
            </button>
          </div>
        ) : (
          orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-xl shadow-md text-left hover:shadow-lg transition backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-yellow-300">
                  الطلب رقم #{order.id.slice(0, 8)}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "paid"
                      ? "bg-green-100/20 text-green-300"
                      : "bg-yellow-100/20 text-yellow-300"
                  }`}
                >
                  {order.status === "paid" ? "مدفوع" : "قيد الانتظار"}
                </span>
              </div>

              <p className="text-gray-100">
                <span className="font-semibold">الإجمالي:</span> {order.total_price} جنيه
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {new Date(order.created_at).toLocaleString("ar-EG")}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
