import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeProvider"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./pages/HomePage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Footer from "./components/Footer"
import CartPage from "./pages/CartPage"
import OrdersPage from "./pages/OrdersPage"
import { useEffect } from "react"
import AdminDashboard from "./pages/AdminDashboard"



export default function App() {

  useEffect(() => {
    document.title = "ShopEase - تسوق بسهولة"
    window.scrollTo(0, 0)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-500">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin" element={<AdminDashboard/>} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
