"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="theme-toggle">
        <div className="theme-toggle-slider">
          <Sun className="w-3 h-3 text-background" />
        </div>
      </div>
    )
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="theme-toggle" onClick={toggleTheme} title={`Switch to ${isDark ? "light" : "dark"} theme`}>
      <div className="theme-toggle-slider">
        {isDark ? <Moon className="w-3 h-3 text-background" /> : <Sun className="w-3 h-3 text-background" />}
      </div>
    </div>
  )
}
