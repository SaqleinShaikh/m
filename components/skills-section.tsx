"use client"

import { useEffect, useState } from "react"
import { Code, Wrench, Database, Laptop, Cpu } from "lucide-react"

interface Skill {
  id: string
  name: string
  proficiency: number
  category: string
  subcategory: string
}

/* ── Proficiency config ─────────────────────────────────────────── */
function getProfConfig(p: number) {
  if (p >= 90) return { label: "Expert",       color: "#10b981", shadow: "0 0 16px rgba(16,185,129,0.35)"  }
  if (p >= 75) return { label: "Advanced",     color: "#3b82f6", shadow: "0 0 16px rgba(59,130,246,0.35)"  }
  if (p >= 55) return { label: "Intermediate", color: "#8b5cf6", shadow: "0 0 16px rgba(139,92,246,0.35)" }
  return            { label: "Beginner",       color: "#f59e0b", shadow: "0 0 16px rgba(245,158,11,0.35)"  }
}

/* ── SVG Ring Progress ──────────────────────────────────────────── */
function RingProgress({ value, color }: { value: number; color: string }) {
  const size = 56, sw = 4, r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const dash  = (value / 100) * circ
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <span className="text-[11px] font-extrabold" style={{ color }}>{value}%</span>
    </div>
  )
}

/* ── Skill Card (Technology) ───────────────────────────────────── */
function SkillCard({ skill }: { skill: Skill }) {
  const prof = getProfConfig(skill.proficiency)
  return (
    <div
      className="group relative flex items-center gap-3.5 p-3.5 rounded-2xl border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default"
      style={{ borderColor: prof.color + "30" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = prof.shadow)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Glow background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 10% 50%, ${prof.color}14 0%, transparent 70%)` }}
      />
      {/* Left accent strip */}
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: prof.color }} />

      <RingProgress value={skill.proficiency} color={prof.color} />

      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm text-foreground leading-tight truncate">{skill.name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-md" style={{ background: prof.color + "20", color: prof.color }}>
            {prof.label}
          </span>
          <span className="text-[10px] text-muted-foreground truncate">{skill.subcategory}</span>
        </div>
      </div>
    </div>
  )
}



/* ── Legend ────────────────────────────────────────────────────── */
const LEGEND = [
  { label: "Expert",       color: "#10b981" },
  { label: "Advanced",     color: "#3b82f6" },
  { label: "Intermediate", color: "#8b5cf6" },
  { label: "Beginner",     color: "#f59e0b" },
]

/* ── Main Section ──────────────────────────────────────────────── */
export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => { setSkills(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setSkills([]); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <section id="skills" className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </section>
    )
  }

  const languages = skills.filter(s => s.category === 'language')
  const tools     = skills.filter(s => s.category === 'tool')

  return (
    <section id="skills" className="py-12 sm:py-16 bg-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif gradient-text mb-3">Skills</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Technical expertise across technologies and development tools
          </p>
        </div>

        {/* ── Technology Section ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30">
              <Code className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Technology</h3>
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">{languages.length} skills</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {languages.map(skill => <SkillCard key={skill.id} skill={skill} />)}
          </div>
        </div>

        {/* ── Tools & Platforms Section ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30">
              <Wrench className="h-4 w-4 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Tools & Platforms</h3>
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">{tools.length} tools</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map(skill => <SkillCard key={skill.id} skill={skill} />)}
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
          {LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}88` }} />
              {label}
            </div>
          ))}
        </div>

        {/* ── Highlight Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Database className="h-5 w-5" />, color: "#10b981", title: "Database Management",  desc: "PostgreSQL, DB design & optimization" },
            { icon: <Laptop   className="h-5 w-5" />, color: "#3b82f6", title: "Full-Stack Dev",       desc: "End-to-end apps with modern frameworks" },
            { icon: <Cpu      className="h-5 w-5" />, color: "#8b5cf6", title: "API Integration",      desc: "REST APIs, microservices & integrations" },
          ].map(({ icon, color, title, desc }) => (
            <div
              key={title}
              className="group relative flex items-start gap-4 px-5 py-4 rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
              style={{ borderColor: color + "25" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px ${color}25`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 0% 50%, ${color}12 0%, transparent 70%)` }} />
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: color + "18", color }}>
                {icon}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
