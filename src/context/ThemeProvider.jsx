import { useEffect, useState } from "react"
import { ThemeContext } from "./ThemeContext"

export const ThemeProvider = ({ children }) => {
  // بنقرأ من localStorage أول مرة
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") return true
    if (saved === "light") return false
    // الافتراضي = light
    return false
  })

  // نضبط الكلاس فورًا أول تحميل قبل أي رسم
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark])

  // إصلاح لحالة الكاش بعد أول render
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  )
}
