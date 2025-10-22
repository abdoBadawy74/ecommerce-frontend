// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

    // simple validation
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

      // Supabase v2 signUp with optional user metadata
      // (options.data will be stored in auth.users.user_metadata and can be used by triggers)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || null }
        }
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
        return;
      }

      // 성공: depending on your Supabase settings, an email confirmation may be required.
      // show friendly message and redirect to login (or homepage)
      setMessage({
        type: "success",
        text:
          data?.user
            ? "تم إنشاء الحساب بنجاح! إذا كان التأكيد عبر البريد مفعلًا، افحص بريدك الإلكتروني."
            : "تم إرسال رابط التفعيل إلى بريدك الإلكتروني، افحصه لإكمال التسجيل."
      });

      setLoading(false);

      // نروح لصفحة الدخول بعد ثانيتين عشان المستخدم يلحق يشوف الرسالة
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "حدث خطأ غير معروف" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 text-center">
          إنشاء حساب جديد
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6 text-center">
          سجل حسابك وابدأ التسوق الآن
        </p>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-md text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <label className="block mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-200">الاسم الكامل (اختياري)</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="مثلًا: أحمد علي"
            className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 focus:outline-none"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-700 dark:text-gray-200">البريد الإلكتروني</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 focus:outline-none"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-700 dark:text-gray-200">كلمة المرور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mt-1 block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full mb-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
        </button>

        <p className="text-sm text-center text-gray-500 dark:text-gray-300">
          لديك حساب؟{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
}
