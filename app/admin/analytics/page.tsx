"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Users, 
  Eye, 
  Clock, 
  MapPin, 
  RefreshCw, 
  Globe, 
  Compass, 
  Laptop, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Copy,
  Smartphone,
  Tablet as TabletIcon,
  Monitor
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import { toast } from "sonner"

interface PageFlowItem {
  path: string
  title: string
  duration: number
  visitedAt: string
}

interface VisitorLog {
  id: string
  sessionId: string
  country: string
  region: string
  city: string
  userAgent: string
  referrer: string
  createdAt: string
  deviceType: string
  browser: string
  os: string
  screenSize: string
  pageFlow: PageFlowItem[]
  totalTime: number
}

interface AnalyticsStats {
  totalVisits: number
  totalPageViews: number
  avgDuration: number
  uniqueLocations: number
  liveActiveUsers: number
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("7d")
  const [stats, setStats] = useState<AnalyticsStats>({
    totalVisits: 0,
    totalPageViews: 0,
    avgDuration: 0,
    uniqueLocations: 0,
    liveActiveUsers: 0
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [topPages, setTopPages] = useState<any[]>([])
  const [countryStats, setCountryStats] = useState<any[]>([])
  const [deviceStats, setDeviceStats] = useState<any[]>([])
  const [browserStats, setBrowserStats] = useState<any[]>([])
  const [osStats, setOsStats] = useState<any[]>([])
  const [screenStats, setScreenStats] = useState<any[]>([])
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([])
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn")
    if (!auth) {
      router.push("/loginlocal")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const fetchAnalytics = async () => {
    setLoading(true)
    setDbError(null)
    try {
      const resp = await fetch(`/api/analytics/stats?timeframe=${timeframe}`)
      const data = await resp.json()
      if (data.tablesMissing) {
        setDbError(data.message || "Analytics database tables not initialized.")
      } else if (data.success) {
        setStats(data.stats)
        setChartData(data.chartData)
        setTopPages(data.topPages)
        setCountryStats(data.countryStats)
        setDeviceStats(data.deviceStats || [])
        setBrowserStats(data.browserStats || [])
        setOsStats(data.osStats || [])
        setScreenStats(data.screenStats || [])
        setVisitorLogs(data.visitorLogs)
      } else {
        toast.error("Failed to load analytics data")
      }
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to connect to analytics API")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics()
    }
  }, [isAuthenticated, timeframe])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading auth status...</p>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const toggleExpandLog = (id: string) => {
    setExpandedLogId(prev => prev === id ? null : id)
  }

  const copySqlToClipboard = () => {
    const sql = `-- Create analytics_sessions table
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    user_agent TEXT,
    referrer TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create analytics_page_views table
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL REFERENCES public.analytics_sessions(session_id) ON DELETE CASCADE,
    path VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    duration INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert to analytics_sessions" ON public.analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to analytics_page_views" ON public.analytics_page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to analytics_page_views" ON public.analytics_page_views FOR UPDATE USING (true);
CREATE POLICY "Allow admin read analytics_sessions" ON public.analytics_sessions FOR SELECT USING (true);
CREATE POLICY "Allow admin read analytics_page_views" ON public.analytics_page_views FOR SELECT USING (true);`

    navigator.clipboard.writeText(sql)
    toast.success("SQL copied to clipboard!")
  }

  const getDeviceIcon = (device: string) => {
    switch (device?.toLowerCase()) {
      case "mobile": return <Smartphone className="h-4 w-4 text-emerald-500" />
      case "tablet": return <TabletIcon className="h-4 w-4 text-amber-500" />
      default: return <Monitor className="h-4 w-4 text-indigo-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push("/admin/dashboard")} size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold font-serif text-primary">Visitor Analytics</h1>
                <p className="text-sm text-muted-foreground">Privacy-focused, cookie-less website logs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <Tabs value={timeframe} onValueChange={setTimeframe} className="w-auto">
                <TabsList>
                  <TabsTrigger value="24h">24h</TabsTrigger>
                  <TabsTrigger value="7d">7d</TabsTrigger>
                  <TabsTrigger value="30d">30d</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" onClick={fetchAnalytics} disabled={loading} size="icon">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dbError ? (
          <Card className="border-amber-500/20 bg-amber-500/5 max-w-2xl mx-auto shadow-lg">
            <CardHeader className="flex flex-row items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div>
                <CardTitle className="text-lg">Database Upgrade/Setup Required</CardTitle>
                <CardDescription>Analytics tables are missing or need updating in your Supabase database.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To start tracking device types, screens, locations, and sessions, please execute the SQL definition script. Copy the SQL code below and paste/run it inside your Supabase project's SQL editor.
              </p>
              <div className="flex items-center justify-between gap-2 p-3 bg-muted rounded-md border text-xs font-mono select-all overflow-x-auto max-h-40">
                <pre className="text-left">
                  {`ALTER TABLE public.analytics_sessions 
ADD COLUMN IF NOT EXISTS device_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS browser VARCHAR(100),
ADD COLUMN IF NOT EXISTS os VARCHAR(100),
ADD COLUMN IF NOT EXISTS screen_size VARCHAR(50);`}
                </pre>
                <Button variant="outline" size="sm" onClick={copySqlToClipboard} className="shrink-0 gap-1 h-8">
                  <Copy className="h-3 w-3" />
                  Copy SQL
                </Button>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={fetchAnalytics}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verify Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">Visits</p>
                    <Users className="h-4 w-4 text-indigo-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{stats.totalVisits}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">Page Views</p>
                    <Eye className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{stats.totalPageViews}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">Avg. Time Spent</p>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{formatDuration(stats.avgDuration)}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">Locations</p>
                    <MapPin className="h-4 w-4 text-rose-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{stats.uniqueLocations}</p>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1 border-emerald-500/20 bg-emerald-500/5 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">Active Now</p>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                  <p className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
                    {stats.liveActiveUsers}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Users in last 5m</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="traffic" className="space-y-6">
              <TabsList className="bg-muted/50 border border-border">
                <TabsTrigger value="traffic">Traffic & Pages</TabsTrigger>
                <TabsTrigger value="systems">Devices & Systems</TabsTrigger>
                <TabsTrigger value="logs">Visitor Logs ({visitorLogs.length})</TabsTrigger>
              </TabsList>

              {/* Traffic Tab */}
              <TabsContent value="traffic" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Traffic Overview</CardTitle>
                      <CardDescription>Visits and page views over selected timeframe</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <ChartTooltip />
                          <Legend verticalAlign="top" height={36} />
                          <Area type="monotone" name="Visits" dataKey="visits" stroke="#8884d8" fillOpacity={1} fill="url(#colorVisits)" />
                          <Area type="monotone" name="Page Views" dataKey="pageviews" stroke="#82ca9d" fillOpacity={1} fill="url(#colorViews)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Countries</CardTitle>
                      <CardDescription>Visitor distribution by country</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-80 pb-6">
                      {countryStats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                          <Globe className="h-8 w-8 mb-2 opacity-40" />
                          No location data available
                        </div>
                      ) : (
                        <>
                          <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={countryStats}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={70}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {countryStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <ChartTooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="space-y-2 overflow-y-auto max-h-28 pr-1 scrollbar-thin">
                            {countryStats.map((item, idx) => (
                              <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                  <span className="font-medium truncate max-w-[150px]">{item.name}</span>
                                </div>
                                <span className="text-muted-foreground">{item.value} ({Math.round(item.value / stats.totalVisits * 100) || 0}%)</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Popular Pages</CardTitle>
                      <CardDescription>Most viewed paths and time spent on each</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topPages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No pages logged yet</div>
                      ) : (
                        <div className="space-y-4">
                          {topPages.map((page, idx) => (
                            <div key={page.path} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 truncate">
                                  <span className="font-semibold text-muted-foreground">#{idx + 1}</span>
                                  <span className="font-medium truncate max-w-[250px] sm:max-w-md" title={page.title}>{page.path}</span>
                                  <span className="text-xs text-muted-foreground truncate opacity-70">({page.title})</span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-semibold">{page.views} views</span>
                                  <span className="text-xs text-muted-foreground ml-2">({formatDuration(Math.round(page.totalTime / page.views))} avg)</span>
                                </div>
                              </div>
                              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-indigo-500 h-full rounded-full" 
                                  style={{ width: `${(page.views / topPages[0].views) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Referrers</CardTitle>
                      <CardDescription>Where your visitors came from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {visitorLogs.filter(log => log.referrer).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
                          <Compass className="h-8 w-8 mb-2 opacity-40" />
                          Direct or organic navigation only
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Array.from(new Set(visitorLogs.map(l => l.referrer).filter(Boolean))).map((ref, idx) => {
                            const count = visitorLogs.filter(l => l.referrer === ref).length
                            let name = ref
                            try {
                              const url = new URL(ref)
                              name = url.hostname
                            } catch {}
                            return (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="font-medium truncate max-w-[200px]" title={ref}>{name}</span>
                                <span className="text-muted-foreground shrink-0">{count} visit{count > 1 ? 's' : ''}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* System & Devices Tab */}
              <TabsContent value="systems" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Device types */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Devices</CardTitle>
                      <CardDescription>Visitor device form factors</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex flex-col justify-between">
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={deviceStats} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                              {deviceStats.map((e, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2">
                        {deviceStats.map((item, idx) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(item.name)}
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="text-muted-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Browser */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Browsers</CardTitle>
                      <CardDescription>Web browser versions used</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex flex-col justify-between">
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={browserStats} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                              {browserStats.map((e, i) => (
                                <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-1.5 overflow-y-auto max-h-24 pr-1">
                        {browserStats.map((item, idx) => (
                          <div key={item.name} className="flex items-center justify-between text-xs">
                            <span className="font-medium truncate max-w-[120px]">{item.name}</span>
                            <span className="text-muted-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Operating Systems */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Operating Systems</CardTitle>
                      <CardDescription>OS platforms detected</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex flex-col justify-between">
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={osStats} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                              {osStats.map((e, i) => (
                                <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-1.5 overflow-y-auto max-h-24 pr-1">
                        {osStats.map((item, idx) => (
                          <div key={item.name} className="flex items-center justify-between text-xs">
                            <span className="font-medium truncate max-w-[120px]">{item.name}</span>
                            <span className="text-muted-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Screen Sizes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Screen Resolutions</CardTitle>
                      <CardDescription>Top monitor & mobile viewport dimensions</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 overflow-y-auto pr-1">
                      {screenStats.length === 0 ? (
                        <p className="text-center text-xs text-muted-foreground py-12">No viewport stats yet</p>
                      ) : (
                        <div className="space-y-2 mt-2">
                          {screenStats.map((item, idx) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                              <span className="font-mono text-muted-foreground">{item.name}</span>
                              <span className="font-semibold">{item.value} visit{item.value > 1 ? 's' : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Visitor Logs Tab */}
              <TabsContent value="logs" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Visitor Logs & Flows</CardTitle>
                    <CardDescription>Live session tracking, entry times, locations, and page-by-page paths</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {visitorLogs.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No visitor sessions recorded yet</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="border border-border rounded-lg overflow-x-auto">
                          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                            <thead>
                              <tr className="bg-muted border-b border-border text-muted-foreground font-semibold">
                                <th className="p-3">Time</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Device / System</th>
                                <th className="p-3">Referrer</th>
                                <th className="p-3">Total Time</th>
                                <th className="p-3">Pages</th>
                                <th className="p-3 text-right">Flow</th>
                              </tr>
                            </thead>
                            <tbody>
                              {visitorLogs.map((log) => (
                                <React.Fragment key={log.id}>
                                  <tr className={`border-b border-border hover:bg-muted/30 cursor-pointer ${expandedLogId === log.id ? 'bg-muted/20' : ''}`} onClick={() => toggleExpandLog(log.id)}>
                                    <td className="p-3 whitespace-nowrap">
                                      {new Date(log.createdAt).toLocaleString(undefined, { 
                                        month: 'short', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </td>
                                    <td className="p-3">
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                        <span className="font-medium">{log.city || "Unknown"}, {log.country}</span>
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        {getDeviceIcon(log.deviceType)}
                                        <span>{log.browser} on {log.os}</span>
                                      </div>
                                    </td>
                                    <td className="p-3 truncate max-w-[150px]">
                                      {log.referrer ? (
                                        <span className="flex items-center gap-1 opacity-80" title={log.referrer}>
                                          <Compass className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                          {log.referrer.replace('https://', '').replace('http://', '').split('/')[0]}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-muted-foreground opacity-60">Direct / Organic</span>
                                      )}
                                    </td>
                                    <td className="p-3 font-medium text-amber-600 dark:text-amber-400">
                                      {formatDuration(log.totalTime)}
                                    </td>
                                    <td className="p-3">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        {log.pageFlow.length} page{log.pageFlow.length > 1 ? 's' : ''}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      <Button variant="ghost" size="icon" className="h-7 w-7">
                                        {expandedLogId === log.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                      </Button>
                                    </td>
                                  </tr>
                                  {expandedLogId === log.id && (
                                    <tr className="bg-muted/10 border-b border-border">
                                      <td colSpan={7} className="p-4 bg-card/40">
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs border-b pb-3 border-border/50">
                                            <div>
                                              <p className="text-muted-foreground font-semibold uppercase tracking-wider">Device User Agent</p>
                                              <p className="font-medium mt-1 text-muted-foreground">
                                                {log.userAgent}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground font-semibold uppercase tracking-wider">Screen Resolution</p>
                                              <p className="font-mono mt-1 text-muted-foreground">{log.screenSize || 'Unknown'}</p>
                                            </div>
                                            <div>
                                              <p className="text-muted-foreground font-semibold uppercase tracking-wider">Session Key</p>
                                              <p className="font-mono mt-1 text-muted-foreground truncate">{log.sessionId}</p>
                                            </div>
                                          </div>

                                          <div>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Detailed Page Flow & Durations</p>
                                            <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-4 py-2">
                                              {log.pageFlow.map((flow, index) => (
                                                <div key={index} className="relative">
                                                  <span className="absolute -left-[31px] top-0.5 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                                                    {index + 1}
                                                  </span>
                                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <div>
                                                      <span className="font-semibold text-sm text-foreground">{flow.path}</span>
                                                      <span className="text-xs text-muted-foreground ml-2 opacity-70">({flow.title})</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                                                      <span>Spent: <strong className="text-indigo-600 dark:text-indigo-400 font-medium">{formatDuration(flow.duration)}</strong></span>
                                                      <span>•</span>
                                                      <span>{new Date(flow.visitedAt).toLocaleTimeString()}</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  )
}
