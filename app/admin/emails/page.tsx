"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, MessageSquare, Trash2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface EmailMessage {
  id: number
  type: "contact" | "endorsement"
  from: string
  email: string
  subject?: string
  message: string
  date: string
  read: boolean
}

export default function AdminEmailsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [emails, setEmails] = useState<EmailMessage[]>([
    {
      id: 1,
      type: "contact",
      from: "John Doe",
      email: "john@example.com",
      subject: "Project Inquiry",
      message: "Hi Saqlein, I'm interested in discussing a Mendix project...",
      date: "2024-03-01",
      read: false
    },
    {
      id: 2,
      type: "endorsement",
      from: "Jane Smith",
      email: "jane@company.com",
      message: "Saqlein is an excellent developer...",
      date: "2024-02-28",
      read: false
    }
  ])

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleViewEmail = (email: EmailMessage) => {
    setSelectedEmail(email)
    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e))
  }

  const handleDeleteEmail = (id: number) => {
    if (confirm("Are you sure you want to delete this email?")) {
      setEmails(emails.filter(e => e.id !== id))
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
              <h1 className="text-2xl font-bold font-serif text-primary">Email Messages</h1>
              <p className="text-sm text-muted-foreground">View all messages from contact form and endorsements</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {emails.map((email) => (
            <Card key={email.id} className={`${!email.read ? 'border-accent' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {email.type === "contact" ? (
                        <Mail className="h-5 w-5 text-blue-500" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-purple-500" />
                      )}
                      <h3 className="font-semibold text-lg">{email.from}</h3>
                      <Badge variant={email.type === "contact" ? "default" : "secondary"}>
                        {email.type}
                      </Badge>
                      {!email.read && <Badge variant="destructive">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{email.email}</p>
                    {email.subject && <p className="font-medium mb-2">{email.subject}</p>}
                    <p className="text-sm text-foreground line-clamp-2">{email.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{email.date}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleViewEmail(email)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteEmail(email.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">From</p>
                <p className="text-lg font-semibold">{selectedEmail.from}</p>
                <p className="text-sm text-muted-foreground">{selectedEmail.email}</p>
              </div>
              {selectedEmail.subject && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-lg">{selectedEmail.subject}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="text-base whitespace-pre-wrap">{selectedEmail.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-sm">{selectedEmail.date}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
