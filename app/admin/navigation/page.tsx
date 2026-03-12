"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Eye, EyeOff, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NavigationSetting {
  id: string
  section_key: string
  section_name: string
  enabled: boolean
  display_order: number
}

export default function AdminNavigationPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [settings, setSettings] = useState<NavigationSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      fetchSettings()
    }
  }, [router])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/navigation-settings?admin=true')
      const data = await response.json()
      setSettings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch navigation settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (id: string, enabled: boolean) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled } : setting
    ))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newSettings = [...settings]
    const temp = newSettings[index]
    newSettings[index] = newSettings[index - 1]
    newSettings[index - 1] = temp
    
    // Update display_order
    newSettings.forEach((setting, idx) => {
      setting.display_order = idx + 1
    })
    
    setSettings(newSettings)
  }

  const moveDown = (index: number) => {
    if (index === settings.length - 1) return
    const newSettings = [...settings]
    const temp = newSettings[index]
    newSettings[index] = newSettings[index + 1]
    newSettings[index + 1] = temp
    
    // Update display_order
    newSettings.forEach((setting, idx) => {
      setting.display_order = idx + 1
    })
    
    setSettings(newSettings)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/navigation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })

      if (response.ok) {
        alert('Navigation settings saved successfully!')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  const enabledCount = settings.filter(s => s.enabled).length
  const disabledCount = settings.filter(s => !s.enabled).length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold font-serif text-primary">Navigation Settings</h1>
                <p className="text-sm text-muted-foreground">
                  {enabledCount} enabled • {disabledCount} disabled
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Website Navigation Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• <strong>Disable sections</strong> to hide them completely from your website</li>
                <li>• <strong>Reorder sections</strong> by moving them up or down</li>
                <li>• <strong>Changes apply to:</strong> Navigation menu, page sections, footer links</li>
                <li>• <strong>Save changes</strong> to update your live website</li>
              </ul>
            </div>

            <div className="space-y-3">
              {settings.map((setting, index) => (
                <div 
                  key={setting.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    setting.enabled 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                      : 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === settings.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                  </div>

                  {/* Order Number */}
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>

                  {/* Section Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{setting.section_name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {setting.section_key}
                      </Badge>
                      {setting.enabled ? (
                        <Badge className="bg-green-500 text-white">
                          <Eye className="h-3 w-3 mr-1" />
                          Visible
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`toggle-${setting.id}`} className="text-sm">
                      {setting.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Switch
                      id={`toggle-${setting.id}`}
                      checked={setting.enabled}
                      onCheckedChange={(enabled) => handleToggle(setting.id, enabled)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Navigation Menu Preview:</h4>
              <div className="flex flex-wrap gap-2">
                {settings
                  .filter(s => s.enabled)
                  .map(setting => (
                    <Badge key={setting.id} variant="outline" className="px-3 py-1">
                      {setting.section_name}
                    </Badge>
                  ))}
              </div>
              {settings.filter(s => s.enabled).length === 0 && (
                <p className="text-muted-foreground italic">No sections enabled</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}