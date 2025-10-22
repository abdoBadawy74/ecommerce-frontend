import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function DarkModeToggle() {
  const { dark, setDark } = useContext(ThemeContext)
  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
      {dark ? <Sun /> : <Moon />}
    </button>
  )
}
