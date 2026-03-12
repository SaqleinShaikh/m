"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  LogOut, 
  Mail, 
  MessageSquare, 
  FileText, 
  Settings,
  Eye,
  Edit,
  Plus,
  Users
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem("adminLoggedIn")
    if (!auth) {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: "Email Messages",
      description: "View all emails from contact form and testimonials",
      icon: Mail,
      href: "/admin/emails",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Testimonials",
      description: "Manage and approve testimonials",
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Blog Posts",
      description: "Create, edit and manage blog posts",
      icon: FileText,
      href: "/admin/blogs",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Blog Comments & Likes",
      description: "Manage blog comments and view likes",
      icon: MessageSquare,
      href: "/admin/blog-comments",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Projects",
      description: "Manage portfolio projects",
      icon: Edit,
      href: "/admin/projects",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Certifications & Awards",
      description: "Manage certifications and awards",
      icon: Plus,
      href: "/admin/certifications",
      color: "from-yellow-500 to-amber-500"
    },
    {
      title: "Experience",
      description: "Manage work experience",
      icon: Users,
      href: "/admin/experience",
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Education",
      description: "Manage education entries",
      icon: FileText,
      href: "/admin/education",
      color: "from-teal-500 to-green-500"
    },
    {
      title: "Skills",
      description: "Manage technical skills",
      icon: Edit,
      href: "/admin/skills",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Navigation Settings",
      description: "Control website sections visibility",
      icon: Settings,
      href: "/admin/navigation",
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "Setup Check",
      description: "Verify system setup and configuration",
      icon: Settings,
      href: "/admin/setup-check",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Settings",
      description: "Update admin email and preferences",
      icon: Settings,
      href: "/admin/settings",
      color: "from-gray-500 to-slate-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Saqlein</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Card
              key={card.title}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => router.push(card.href)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground mt-1">Pending Emails</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground mt-1">Pending Testimonials</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">8</p>
                <p className="text-sm text-muted-foreground mt-1">Published Blogs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground mt-1">Draft Blogs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
