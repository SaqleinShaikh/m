"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface PageTransitionContextType {
  startTransition: () => void
  endTransition: () => void
  isNavigating: boolean
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  startTransition: () => {},
  endTransition: () => {},
  isNavigating: false,
})

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)

  const startTransition = useCallback(() => {
    setIsNavigating(true)
  }, [])

  const endTransition = useCallback(() => {
    setIsNavigating(false)
  }, [])

  return (
    <PageTransitionContext.Provider value={{ startTransition, endTransition, isNavigating }}>
      {children}
      {isNavigating && <PageTransitionOverlay />}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

function PageTransitionOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      aria-label="Loading page..."
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner ring */}
        <div className="relative w-16 h-16">
          <svg
            className="w-full h-full"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Track */}
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="5"
            />
            {/* Spinning arc */}
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="url(#spin-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="60 104"
              style={{
                transformOrigin: "center",
                animation: "page-spin 0.8s linear infinite",
              }}
            />
            <defs>
              <linearGradient id="spin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent, #8B5CF6)" />
                <stop offset="100%" stopColor="var(--color-primary, #6D28D9)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Loading text */}
        <p
          className="text-white/90 text-sm font-medium tracking-wide"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        >
          Opening page...
        </p>
      </div>

      <style>{`
        @keyframes page-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
