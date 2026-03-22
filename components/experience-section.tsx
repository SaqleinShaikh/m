"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Calendar, MapPin, Building } from "lucide-react"

interface Experience {
  id: string
  company: string
  position: string
  duration: string
  location: string
  description: string
  technologies: string[]
  is_current: boolean
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => {
        setExperiences(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching experience:', err)
        setExperiences([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="experience" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading experience...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif gradient-text mb-3 sm:mb-4">Experience</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey in software development and Mendix platform expertise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {experiences.map((exp) => (
            <Card
              key={exp.id}
              className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 ${exp.is_current ? "ring-2 ring-accent/50 animate-glow" : ""}`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`p-3 rounded-full ${exp.is_current ? "bg-gradient-to-r from-accent to-secondary" : "bg-gradient-to-r from-primary to-accent"}`}
                    >
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold font-serif gradient-text">{exp.position}</h3>
                        {exp.is_current && (
                          <span className="bg-gradient-to-r from-accent to-secondary text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <Building className="h-4 w-4 text-accent" />
                        <span className="text-lg font-semibold text-accent">{exp.company}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {exp.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {exp.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed text-sm">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gradient-to-r from-muted to-muted/50 text-foreground px-3 py-1 rounded-full text-xs font-medium border border-accent/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
