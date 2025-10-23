import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeProvider"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./pages/HomePage"
import Login from "./pages/Login"
import Register from "./pages/Register"

import CartPage from "./pages/CartPage"



export default function App() {
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
            </Routes>
          </div>
        </BrowserRouter>

      </AuthProvider>
    </ThemeProvider>
  )
}
