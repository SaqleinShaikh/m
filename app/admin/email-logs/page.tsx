"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Inbox,
  AlertTriangle,
  Info,
  Shield,
  HelpCircle
} from "lucide-react"

interface EmailLog {
  id: string
  sender: string
  recipient: string
  subject: string
  email_type: 'contact_notification' | 'contact_auto_response' | 'endorsement_submission' | 'endorsement_approval' | 'password_reset' | 'unknown'
  status: 'sent' | 'fail'
  error_message: string | null
  created_at: string
}

interface Stats {
  total: number
  sent: number
  failed: number
  byType: {
    contact_notification: number
    contact_auto_response: number
    endorsement_submission: number
    endorsement_approval: number
    password_reset: number
    unknown: number
  }
}

export default function EmailLogsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    sent: 0,
    failed: 0,
    byType: {
      contact_notification: 0,
      contact_auto_response: 0,
      endorsement_submission: 0,
      endorsement_approval: 0,
      password_reset: 0,
      unknown: 0
    }
  })

  // Filters
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [emailType, setEmailType] = useState("")
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // UI States
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isClearingAll, setIsClearingAll] = useState(false)

  // Auth Guard check
  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (auth !== "true") {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // Fetch data
  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
        emailType,
        limit: String(limit),
        offset: String(offset)
      })

      const res = await fetch(`/api/admin/email-logs?${queryParams.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setLogs(data.logs)
        setTotalCount(data.totalCount)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        showNotification("error", data.error || "Failed to load logs")
      }
    } catch (err: any) {
      showNotification("error", err.message || "An unexpected error occurred while loading logs")
    } finally {
      setLoading(false)
    }
  }, [search, status, emailType, limit, offset])

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs()
    }
  }, [isAuthenticated, fetchLogs])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  // Delete handlers
  const handleDeleteLog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) return

    try {
      const res = await fetch(`/api/admin/email-logs?id=${id}`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (res.ok) {
        showNotification("success", "Log deleted successfully")
        // Refresh logs
        fetchLogs()
      } else {
        showNotification("error", data.error || "Failed to delete log")
      }
    } catch (err: any) {
      showNotification("error", err.message || "Error deleting log")
    }
  }

  const handleClearAllLogs = async () => {
    if (!confirm("⚠️ WARNING: This will permanently delete ALL email outbox logs from the database. Are you absolutely sure?")) return

    setIsClearingAll(true)
    try {
      const res = await fetch(`/api/admin/email-logs?clearAll=true`, {
        method: "DELETE"
      })
      const data = await res.json()

      if (res.ok) {
        showNotification("success", "All email logs have been successfully cleared")
        setOffset(0)
        fetchLogs()
      } else {
        showNotification("error", data.error || "Failed to clear logs")
      }
    } catch (err: any) {
      showNotification("error", err.message || "Error clearing logs")
    } finally {
      setIsClearingAll(false)
    }
  }

  const formatEmailType = (type: string) => {
    switch (type) {
      case "contact_notification":
        return "Contact Admin Alert"
      case "contact_auto_response":
        return "Contact Confirmation"
      case "endorsement_submission":
        return "Endorsement Admin Alert"
      case "endorsement_approval":
        return "Endorsement Live Confirmation"
      case "password_reset":
        return "Password Reset Link"
      default:
        return type.replace(/_/g, " ")
    }
  }

  const getEmailTypeIcon = (type: string) => {
    switch (type) {
      case "contact_notification":
      case "contact_auto_response":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "endorsement_submission":
      case "endorsement_approval":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "password_reset":
        return <Shield className="h-4 w-4 text-orange-500" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return isoString
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-medium">Verifying admin credentials...</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(totalCount / limit)
  const currentPage = Math.floor(offset / limit) + 1

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/dashboard")}
              className="hover:bg-accent border-border/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary tracking-tight">System Email Trigger Logs</h1>
              <p className="text-sm text-muted-foreground">Monitor outbox metrics, delivery logs, and delivery statuses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLogs()}
              disabled={loading}
              className="h-9 hover:border-primary transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAllLogs}
              disabled={loading || isClearingAll || logs.length === 0}
              className="h-9 font-medium shadow-sm hover:shadow-destructive/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Logs
            </Button>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-lg border flex items-center gap-3 backdrop-blur-md max-w-md ${
            notification.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}>
            {notification.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Supabase & BCC Notice Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary">Global BCC Routing & Supabase Integration Enabled</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All outgoing transactional emails automatically BCC your portfolio sender email address in real-time, 
                and compile database logs asynchronously for absolute delivery visibility.
              </p>
            </div>
          </div>
          <div className="bg-background/80 border border-border/80 px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground select-all">
            BCC Routing: ENABLED
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-border/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Triggers</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-serif text-blue-500">{stats.total}</span>
                <span className="text-xs text-muted-foreground">sent out of system</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Real-time outbox logs
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-border/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Successfully Sent</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-serif text-emerald-500">{stats.sent}</span>
                <span className="text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> SMTP delivery complete
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-border/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Failed Delivery</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold font-serif ${stats.failed > 0 ? 'text-rose-500 animate-pulse' : 'text-muted-foreground/60'}`}>
                  {stats.failed}
                </span>
                {stats.failed > 0 && (
                  <span className="text-xs text-rose-500 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded animate-bounce">
                    Action Required
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                {stats.failed > 0 ? (
                  <>
                    <AlertTriangle className="h-3 w-3 text-rose-500" />
                    SMTP connection errors detected
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    No delivery errors found
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-border/60">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Form Submissions</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-serif text-purple-500">
                  {stats.byType.contact_notification + stats.byType.endorsement_submission}
                </span>
                <span className="text-xs text-muted-foreground">inbox events</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-purple-500" /> Contact forms + Endorsements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls & Search Panel */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by recipient, subject, error stack..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setOffset(0) // reset offset on search
                  }}
                  className="pl-9 pr-8"
                />
                {search && (
                  <button 
                    onClick={() => { setSearch(""); setOffset(0); }} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value)
                    setOffset(0)
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                >
                  <option value="">All Statuses</option>
                  <option value="sent">Sent Successfully</option>
                  <option value="fail">Delivery Failed</option>
                </select>
              </div>

              {/* Email Type Filter */}
              <div>
                <select
                  value={emailType}
                  onChange={(e) => {
                    setEmailType(e.target.value)
                    setOffset(0)
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                >
                  <option value="">All Types</option>
                  <option value="contact_notification">Contact Admin Alert</option>
                  <option value="contact_auto_response">Contact Confirmation</option>
                  <option value="endorsement_submission">Endorsement Submitter Alert</option>
                  <option value="endorsement_approval">Endorsement Live Confirmation</option>
                  <option value="password_reset">Password Reset Link</option>
                </select>
              </div>
            </div>

            {/* Sub-Filters / Results info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
              <div>
                Showing <span className="font-semibold text-foreground">{logs.length}</span> out of{" "}
                <span className="font-semibold text-foreground">{totalCount}</span> total matches
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Sent: {stats.byType.contact_auto_response + stats.byType.endorsement_approval + stats.byType.password_reset} confirmations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                  <span>Alerts: {stats.byType.contact_notification + stats.byType.endorsement_submission} notifications</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table Area */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4 bg-card/10">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-semibold text-muted-foreground animate-pulse">Retrieving email audit history...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-card/10">
              <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                <Inbox className="h-8 w-8 text-primary/40" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground">No logs found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                {search || status || emailType
                  ? "We couldn't find any email trigger logs matching the active search parameters."
                  : "No emails have been logged by the SMTP server yet. Complete a contact form test or password reset to trigger a log."}
              </p>
              {(search || status || emailType) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setStatus("")
                    setEmailType("")
                    setOffset(0)
                  }}
                  className="mt-4"
                >
                  Reset Active Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-card border-b border-border/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">Trigger Time</th>
                    <th className="px-6 py-4">Email Type</th>
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 bg-card/30">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-accent/40 group transition-all duration-150 cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-6 py-4 text-sm font-medium font-mono text-muted-foreground whitespace-nowrap">
                        {formatTime(log.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-background border border-border/60">
                            {getEmailTypeIcon(log.email_type)}
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {formatEmailType(log.email_type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium whitespace-nowrap max-w-[200px] truncate select-all">
                        {log.recipient}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-[250px] truncate">
                        {log.subject}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <Badge
                          variant={log.status === "sent" ? "default" : "destructive"}
                          className={`rounded-full px-2.5 py-0.5 font-semibold text-xs border ${
                            log.status === "sent" 
                              ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20" 
                              : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/20 animate-pulse"
                          }`}
                        >
                          {log.status === "sent" ? "SUCCESS" : "FAILED"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedLog(log)}
                            className="h-8 w-8 p-0 hover:bg-accent hover:text-primary transition-all duration-300"
                            title="Inspect Detailed Log"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLog(log.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-all duration-300"
                            title="Delete Log"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="border-t border-border/40 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/10">
              <div className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span> ({totalCount} entries)
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0 || loading}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  className="h-8"
                >
                  Previous
                </Button>

                {/* Quick numbered page guides */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    // sliding window centering current page
                    let pageNum = idx + 1
                    if (currentPage > 3 && totalPages > 5) {
                      pageNum = currentPage - 3 + idx
                      if (pageNum + (4 - idx) > totalPages) {
                        pageNum = totalPages - 4 + idx
                      }
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOffset((pageNum - 1) * limit)}
                        disabled={loading}
                        className={`h-8 w-8 p-0 ${
                          currentPage === pageNum 
                            ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/95" 
                            : "hover:bg-accent"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset + limit >= totalCount || loading}
                  onClick={() => setOffset(offset + limit)}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>

      {/* Inspect Modal Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl border-border/80 shadow-2xl backdrop-blur-lg">
          <DialogHeader className="border-b border-border/40 pb-4">
            <DialogTitle className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              SMTP Log Inspector
            </DialogTitle>
            <DialogDescription>
              Detailed view of system-triggered transactional email payload
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6 pt-4">
              {/* Top Banner Status */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                selectedLog.status === "sent" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-500"
              }`}>
                <div className="flex items-center gap-2.5">
                  {selectedLog.status === "sent" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider">
                      Delivery {selectedLog.status === "sent" ? "Success" : "Failed"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedLog.status === "sent" ? "Email successfully accepted by SMTP server." : "SMTP protocol error occurred during transfer."}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={selectedLog.status === "sent" ? "default" : "destructive"}
                  className="font-bold uppercase rounded"
                >
                  {selectedLog.status}
                </Badge>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-accent/35 p-3 rounded-lg border border-border/30">
                  <p className="text-xs text-muted-foreground font-semibold">Sender (SMTP Transporter)</p>
                  <p className="text-sm font-medium text-foreground mt-1 truncate select-all">{selectedLog.sender}</p>
                </div>
                <div className="bg-accent/35 p-3 rounded-lg border border-border/30">
                  <p className="text-xs text-muted-foreground font-semibold">Recipient (To)</p>
                  <p className="text-sm font-medium text-foreground mt-1 truncate select-all">{selectedLog.recipient}</p>
                </div>
                <div className="bg-accent/35 p-3 rounded-lg border border-border/30">
                  <p className="text-xs text-muted-foreground font-semibold">Email Type</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {getEmailTypeIcon(selectedLog.email_type)}
                    <p className="text-sm font-bold text-foreground">
                      {formatEmailType(selectedLog.email_type)}
                    </p>
                  </div>
                </div>
                <div className="bg-accent/35 p-3 rounded-lg border border-border/30">
                  <p className="text-xs text-muted-foreground font-semibold">Trigger Timestamp</p>
                  <p className="text-sm font-medium text-foreground mt-1">{formatTime(selectedLog.created_at)}</p>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-accent/35 p-3.5 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground font-semibold">Email Subject</p>
                <p className="text-sm font-bold text-foreground mt-1 select-all">{selectedLog.subject}</p>
              </div>

              {/* Error stack trace / detailed message if failed */}
              {selectedLog.status === "fail" && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    SMTP Diagnostic Stack Trace
                  </p>
                  <div className="bg-rose-500/5 border border-rose-500/20 text-rose-500 font-mono text-xs p-4 rounded-xl max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
                    {selectedLog.error_message || "An unknown delivery error occurred (no stack trace provided by Nodemailer). Check SMTP credentials and port configuration."}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    ℹ️ You can test SMTP details inside `/admin/setup-check` page to verify environment configurations.
                  </p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="border-t border-border/40 pt-4 flex justify-between gap-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDeleteLog(selectedLog.id)
                    setSelectedLog(null)
                  }}
                  className="font-medium"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Log
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                  className="font-semibold"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
