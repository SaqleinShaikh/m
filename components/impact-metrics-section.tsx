"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Rocket, Award, Users, Code, TrendingUp } from "lucide-react"

const metrics = [
  {
    icon: Briefcase,
    value: "3+",
    label: "Years Experience",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Rocket,
    value: "7+",
    label: "Projects Completed",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Award,
    value: "8+",
    label: "Certifications & Awards",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Users,
    value: "5+",
    label: "Go Live Deliveries",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Code,
    value: "12+",
    label: "Technical Skills",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: TrendingUp,
    value: "100%",
    label: "Client Satisfaction",
    color: "from-teal-500 to-green-500"
  }
]

export default function ImpactMetricsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Impact & Metrics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Delivering measurable results and driving digital transformation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className={`group hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 hover:scale-105 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`bg-gradient-to-br ${metric.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {metric.value}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
