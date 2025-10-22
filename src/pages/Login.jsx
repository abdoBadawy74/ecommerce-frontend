import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError("بيانات الدخول غير صحيحة");
        } else {
            navigate("/");
        }
    };

    return (
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white py-20 text-center relative overflow-hidden min-h-screen flex items-center justify-center">
            <motion.div
                className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-lg w-[90%] max-w-md"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-3xl font-extrabold mb-6 text-yellow-300">تسجيل الدخول</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        className="p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        className="p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-300 text-sm">{error}</p>}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="mt-4 bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-500"
                    >
                        تسجيل الدخول
                    </motion.button>
                </form>
                <p className="mt-4 text-sm">
                    ليس لديك حساب؟{" "}
                    <button
                        onClick={() => navigate("/register")}
                        className="text-yellow-300 underline hover:text-yellow-400"
                    >
                        إنشاء حساب
                    </button>
                </p>
            </motion.div>
        </section>
    );
}
