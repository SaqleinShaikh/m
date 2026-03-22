"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Code, Wrench, Database, Laptop, Cpu, Settings } from "lucide-react"

interface Skill {
  id: string
  name: string
  proficiency: number
  category: string
  subcategory: string
}

function SkillIcon({ label, className }: { label: string; className?: string }) {
  const l = label.toLowerCase()
  if (l.includes("react")) return <Cpu className={className} aria-hidden="true" />
  if (l.includes("postgres")) return <Database className={className} aria-hidden="true" />
  if (l.includes("db") || l.includes("dbeaver") || l.includes("pgadmin"))
    return <Database className={className} aria-hidden="true" />
  if (l.includes("mendix")) return <Wrench className={className} aria-hidden="true" />
  if (
    l.includes("html") ||
    l.includes("css") ||
    l.includes("java") ||
    l.includes("python") ||
    l.includes("c++") ||
    l.includes("sql")
  )
    return <Code className={className} aria-hidden="true" />
  if (l.includes("putty")) return <Settings className={className} aria-hidden="true" />
  return <Code className={className} aria-hidden="true" />
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching skills:', err)
        setSkills([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </section>
    )
  }

  const languages = skills.filter(s => s.category === 'language')
  const tools = skills.filter(s => s.category === 'tool')

  return (
    <section id="skills" className="py-12 sm:py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-primary mb-3 sm:mb-4 text-balance">Skills</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Technical expertise across technologies and development tools
          </p>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {/* Technology */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold font-serif text-primary mb-4">Technology</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {languages.map((skill) => (
                <Card
                  key={skill.id}
                  className="bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
                >
                  <CardHeader className="pb-0 p-3 sm:p-4 md:p-6 md:pb-0">
                    {/* Mobile: stacked layout. Desktop: side-by-side */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="bg-accent/10 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                          <SkillIcon label={skill.name} className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                        </div>
                        <CardTitle className="text-sm sm:text-base font-semibold text-foreground truncate">{skill.name}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs w-fit flex-shrink-0">
                        {skill.subcategory}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 sm:pt-4 p-3 sm:p-4 md:p-6 md:pt-4">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Proficiency</span>
                      <span className="text-xs sm:text-sm font-medium">{skill.proficiency}%</span>
                    </div>
                    <Progress
                      value={skill.proficiency}
                      className="h-1.5 sm:h-2"
                      aria-label={`${skill.name} proficiency ${skill.proficiency} percent`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold font-serif text-primary mb-4">Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {tools.map((skill) => (
                <Card
                  key={skill.id}
                  className="bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
                >
                  <CardHeader className="pb-0 p-3 sm:p-4 md:p-6 md:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="bg-accent/10 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                          <SkillIcon label={skill.name} className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                        </div>
                        <CardTitle className="text-sm sm:text-base font-semibold text-foreground truncate">{skill.name}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs w-fit flex-shrink-0">
                        Tool
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 sm:pt-4 p-3 sm:p-4 md:p-6 md:pt-4">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Proficiency</span>
                      <span className="text-xs sm:text-sm font-medium">{skill.proficiency}%</span>
                    </div>
                    <Progress
                      value={skill.proficiency}
                      className="h-1.5 sm:h-2"
                      aria-label={`${skill.name} proficiency ${skill.proficiency} percent`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="text-center bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="bg-accent/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Database className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-primary mb-2">Database Management</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Expert in PostgreSQL, database design, and optimization</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="bg-accent/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Laptop className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-primary mb-2">Full-Stack Development</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">End-to-end application development with modern frameworks</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 sm:p-6">
              <div className="bg-accent/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Code className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-primary mb-2">API Integration</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">REST APIs, microservices, and third-party integrations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
