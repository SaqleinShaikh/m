"use client"

import { useState, useEffect } from 'react'

interface NavigationSetting {
  id: string
  section_key: string
  section_name: string
  enabled: boolean
  display_order: number
}

export function useNavigationSettings() {
  const [settings, setSettings] = useState<NavigationSetting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      console.log('Fetching navigation settings...')
      // Add cache busting to ensure fresh data
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/navigation-settings?t=${timestamp}`)
      const data = await response.json()
      console.log('Navigation settings response:', data)
      
      if (Array.isArray(data)) {
        setSettings(data)
        console.log('Settings loaded:', data.length, 'items')
        // Log each setting for debugging
        data.forEach(setting => {
          console.log(`Section "${setting.section_key}": ${setting.enabled ? 'ENABLED' : 'DISABLED'}`)
        })
      } else {
        console.error('Invalid settings data:', data)
        setSettings([])
      }
    } catch (error) {
      console.error('Failed to fetch navigation settings:', error)
      setSettings([])
    } finally {
      setLoading(false)
    }
  }

  const isEnabled = (sectionKey: string) => {
    // If still loading, don't render anything
    if (loading) {
      console.log(`Section "${sectionKey}": LOADING (not rendered)`)
      return false
    }
    
    // If no settings loaded (database not set up), show all sections except video by default
    if (settings.length === 0) {
      // Default enabled sections (video disabled by default)
      const defaultEnabled = ['home', 'experience', 'skills', 'projects', 'education', 'certifications', 'blogs', 'testimonials', 'contact']
      const enabled = defaultEnabled.includes(sectionKey)
      console.log(`Section "${sectionKey}": ${enabled ? 'ENABLED' : 'DISABLED'} (using defaults, no settings loaded)`)
      return enabled
    }
    
    const setting = settings.find(s => s.section_key === sectionKey)
    if (setting) {
      console.log(`Section "${sectionKey}": ${setting.enabled ? 'ENABLED' : 'DISABLED'} (from database)`)
      return setting.enabled
    } else {
      console.log(`Section "${sectionKey}": DISABLED (not found in settings)`)
      return false
    }
  }

  const getEnabledSections = () => {
    return settings
      .filter(s => s.enabled)
      .sort((a, b) => a.display_order - b.display_order)
  }

  return {
    settings,
    loading,
    isEnabled,
    getEnabledSections,
    refetch: fetchSettings
  }
}