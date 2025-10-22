import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else navigate("/")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">تسجيل الدخول</h2>
        <input type="email" placeholder="البريد الإلكتروني" className="mb-3 p-2 w-64 rounded-md border" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" className="mb-3 p-2 w-64 rounded-md border" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">دخول</button>
      </form>
    </div>
  )
}
