import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error) setProducts(data);
  }

  return (
    <div className="py-16 px-6 bg-gray-50 dark:bg-gray-950 transition-colors">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        أحدث المنتجات
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <img src={p.image_url} alt={p.name} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{p.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{p.category}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">{p.price} EGP</span>
                <button className="bg-blue-600 text-white text-sm px-4 py-1 rounded-md hover:bg-blue-700">
                  أضف للسلة
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
