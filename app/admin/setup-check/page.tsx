"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function SetupCheckPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [dbStatus, setDbStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [apiStatus, setApiStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [settingsCount, setSettingsCount] = useState(0)

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
      checkSetup()
    }
  }, [router])

  const checkSetup = async () => {
    // Check API
    try {
      const response = await fetch('/api/navigation-settings?admin=true')
      if (response.ok) {
        const data = await response.json()
        setApiStatus('success')
        if (Array.isArray(data) && data.length > 0) {
          setDbStatus('success')
          setSettingsCount(data.length)
        } else {
          setDbStatus('error')
        }
      } else {
        setApiStatus('error')
        setDbStatus('error')
      }
    } catch (error) {
      setApiStatus('error')
      setDbStatus('error')
    }
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary">Setup Check</h1>
              <p className="text-sm text-muted-foreground">
                Verify navigation control system setup
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* API Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {apiStatus === 'checking' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                {apiStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {apiStatus === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                API Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {apiStatus === 'checking' && <p>Checking API...</p>}
              {apiStatus === 'success' && <p className="text-green-600">✅ API is working correctly</p>}
              {apiStatus === 'error' && <p className="text-red-600">❌ API is not responding</p>}
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {dbStatus === 'checking' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                {dbStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {dbStatus === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                Database Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dbStatus === 'checking' && <p>Checking database...</p>}
              {dbStatus === 'success' && (
                <div>
                  <p className="text-green-600">✅ Database is set up correctly</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Found {settingsCount} navigation settings
                  </p>
                </div>
              )}
              {dbStatus === 'error' && (
                <div>
                  <p className="text-red-600">❌ Database table not found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You need to run the database migration.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          {dbStatus === 'error' && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">Setup Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Step 1: Run Database Migration
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                    <li>Open Supabase Dashboard</li>
                    <li>Go to SQL Editor</li>
                    <li>Copy content from <code>supabase/navigation-settings.sql</code></li>
                    <li>Paste and run the SQL script</li>
                    <li>Refresh this page to verify</li>
                  </ol>
                </div>
                
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>File location:</strong> <code>supabase/navigation-settings.sql</code>
                  </p>
                </div>

                <Button onClick={checkSetup} variant="outline" className="mt-4">
                  Recheck Setup
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {dbStatus === 'success' && apiStatus === 'success' && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">✅ Setup Complete!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Navigation control system is working correctly. You can now:
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => router.push("/admin/navigation")}
                    className="mr-2"
                  >
                    Manage Navigation Settings
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open("/", "_blank")}
                  >
                    View Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}