import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ===== Logo + Description ===== */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            🛒 ShopEase
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            استمتع بتجربة تسوق سهلة وسريعة مع أفضل العروض والمنتجات.
          </p>
        </div>

        {/* ===== Quick Links ===== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            روابط سريعة
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                الصفحة الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                طلباتي
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                العربة
              </Link>
            </li>
            {/* <li>
              <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                تسجيل الدخول
              </Link>
            </li> */}
          </ul>
        </div>

        {/* ===== Social Media ===== */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            تابعنا
          </h3>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <Facebook size={22} />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-500">
              <Instagram size={22} />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-sky-500">
              <Twitter size={22} />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <Github size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600 dark:text-blue-400">ShopEase</span> — جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}
