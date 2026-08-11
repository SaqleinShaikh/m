"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const sessionIdRef = useRef<string | null>(null)
  const lastPathRef = useRef<string | null>(null)

  // Initialize session once - delayed to prevent competing with page load assets
  useEffect(() => {
    if (typeof window === "undefined") return

    // Delay initialization until page load completes or after a 1.5s timeout (totally non-blocking)
    const initSessionDelayed = () => {
      let sessionId = sessionStorage.getItem("analytics_session_id")
      if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
        sessionStorage.setItem("analytics_session_id", sessionId)
      }
      sessionIdRef.current = sessionId

      const screenSize = `${window.screen.width}x${window.screen.height}`

      // Register session details with server (location, IP hash, user agent, screen size)
      const initSession = async () => {
        try {
          await fetch("/api/analytics/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              referrer: document.referrer || null,
              screenSize,
            }),
            priority: "low", // Low priority request
          } as any)
        } catch (err) {
          console.warn("Analytics initialization failed:", err)
        }
      }

      initSession()
    }

    let delayTimer: NodeJS.Timeout
    if (document.readyState === "complete") {
      delayTimer = setTimeout(initSessionDelayed, 1500)
    } else {
      const handleLoad = () => {
        delayTimer = setTimeout(initSessionDelayed, 1000)
      }
      window.addEventListener("load", handleLoad)
      return () => {
        window.removeEventListener("load", handleLoad)
        clearTimeout(delayTimer)
      }
    }

    return () => {
      clearTimeout(delayTimer)
    }
  }, [])

  // Track page views and handle duration heartbeats
  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return

    const trackDelayed = setTimeout(() => {
      const sessionId = sessionIdRef.current || sessionStorage.getItem("analytics_session_id")
      if (!sessionId) return

      // If pathname didn't change (e.g. search params query update), skip
      if (lastPathRef.current === pathname) return
      lastPathRef.current = pathname

      // Register page view
      const trackPageView = async () => {
        try {
          await fetch("/api/analytics/pageview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              path: pathname,
              title: document.title || pathname,
            }),
            priority: "low",
          } as any)
        } catch (err) {
          console.warn("Page view tracking failed:", err)
        }
      }

      trackPageView()
    }, 1000) // 1 second delay to ensure page view logging runs after page renders

    // Send a heartbeat every 15 seconds (reduced frequency to save server resources)
    const heartbeatInterval = setInterval(async () => {
      const sessionId = sessionIdRef.current || sessionStorage.getItem("analytics_session_id")
      if (!sessionId) return
      if (document.visibilityState !== "visible") return

      try {
        await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            path: pathname,
            title: document.title || pathname,
            heartbeat: true,
          }),
          priority: "low",
        } as any)
      } catch (err) {
        // Silently catch heartbeat errors
      }
    }, 15000)

    return () => {
      clearTimeout(trackDelayed)
      clearInterval(heartbeatInterval)
    }
  }, [pathname])

  return null
}
