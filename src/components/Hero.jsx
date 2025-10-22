import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white py-20 text-center relative overflow-hidden">
      <motion.h1
        className="text-5xl font-extrabold mb-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        مرحبًا بك في <span className="text-yellow-300">ShopEase</span>
      </motion.h1>
      <motion.p
        className="text-lg text-gray-100 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        اكتشف أحدث المنتجات بأفضل الأسعار — إلكترونيات، أزياء، كتب وأكثر.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        className="mt-8 bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-500"
      >
        تسوق الآن
      </motion.button>

      <motion.div
        className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-2/3 h-40 bg-white/10 blur-3xl rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </section>
  );
}
