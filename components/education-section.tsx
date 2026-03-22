"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react"

interface Education {
  id: string
  degree: string
  year: string
  location: string
  description: string
  icon: string
}

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/education')
      .then(res => res.json())
      .then(data => {
        setEducation(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching education:', err)
        setEducation([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="education" className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading education...</p>
        </div>
      </section>
    )
  }

  const getIcon = (iconName: string) => {
    return iconName === 'GraduationCap' ? GraduationCap : Award
  }

  return (
    <section id="education" className="py-12 sm:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif gradient-text mb-3 sm:mb-4">Education</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            My academic journey that laid the foundation for my career in technology
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {education.map((edu) => {
            const Icon = getIcon(edu.icon)
            return (
              <Card
                key={edu.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40"
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-serif gradient-text mb-2">{edu.degree}</h3>
                      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {edu.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {edu.location}
                        </div>
                      </div>
                      <p className="text-foreground text-sm leading-relaxed">{edu.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
