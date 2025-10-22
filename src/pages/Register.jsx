// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!email || !password) {
            setMessage({ type: "error", text: "فضلاً املأ البريد الإلكتروني وكلمة المرور" });
            return;
        }
        if (password.length < 6) {
            setMessage({ type: "error", text: "كلمة المرور لازم تكون 6 أحرف على الأقل" });
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName || null } },
            });

            if (error) throw error;

            setMessage({
                type: "success",
                text:
                    data?.user
                        ? "تم إنشاء الحساب بنجاح! افحص بريدك الإلكتروني لتأكيد الحساب."
                        : "تم إرسال رابط التفعيل إلى بريدك الإلكتروني.",
            });

            setTimeout(() => navigate("/login"), 1800);
        } catch (err) {
            setMessage({ type: "error", text: err.message || "حدث خطأ غير معروف" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white py-20 text-center relative overflow-hidden min-h-screen flex items-center justify-center">
            {/* خلفية بلور جميلة */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[90%] max-w-md"
            >
                <h1 className="text-3xl font-extrabold mb-2 text-yellow-300">إنشاء حساب جديد</h1>
                <p className="text-sm text-gray-100 mb-6">سجّل حسابك وابدأ التسوق الآن 🎉</p>

                {message && (
                    <div
                        className={`mb-4 px-4 py-2 rounded-md text-sm font-medium ${message.type === "error"
                                ? "bg-red-500/20 text-red-200"
                                : "bg-green-500/20 text-green-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4 text-right">
                    <input
                        type="text"
                        placeholder="الاسم الكامل (اختياري)"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-3 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        disabled={loading}
                        className="mt-4 bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-500 disabled:opacity-50"
                    >
                        {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                    </motion.button>
                </form>

                <p className="mt-4 text-sm text-gray-100">
                    لديك حساب بالفعل؟{" "}
                    <Link to="/login" className="text-yellow-300 underline hover:text-yellow-400">
                        تسجيل الدخول
                    </Link>
                </p>
            </motion.div>

            {/* لمسة ضوء خلفية */}
            <motion.div
                className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-2/3 h-40 bg-white/10 blur-3xl rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            />
        </section>
    );
}
