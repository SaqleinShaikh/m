"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, User, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Hardcoded credentials (in production, this should be server-side)
    if (username === "AppAdmin" && password === "S@qlein050505") {
      // Store session
      localStorage.setItem("adminLoggedIn", "true")
      router.push("/admin/dashboard")
    } else {
      setError("Invalid username or password")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-serif">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/loginlocal/forgot-password")}
                className="text-sm text-accent hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
