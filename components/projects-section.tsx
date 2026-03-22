"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { useAutoScroll } from "@/hooks/use-auto-scroll"

interface Project {
  id: string
  title: string
  short_description: string
  full_description: string
  image: string
  technologies: string[]
  functionality: string[]
  live_url: string
  github_url: string
}

export default function ProjectsSection() {
  const [projectsData, setProjectsData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjectsData(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching projects:', err)
        setProjectsData([])
        setLoading(false)
      })
  }, [])

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [projectsData])

  const scrollByAmount = (dir: number) => {
    const el = scrollRef.current
    if (!el) return
    const width = el.children[0]?.clientWidth || 300
    el.scrollBy({ left: dir * (width + 24), behavior: 'smooth' })
  }

  // Engage auto slideshow logic globally
  useAutoScroll(scrollRef, 3500, !loading && projectsData.length > 3)

  if (loading) {
    return (
      <section id="projects" className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-12 sm:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif gradient-text mb-3 sm:mb-4">Projects</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work in building scalable applications and digital solutions
          </p>
        </div>

        {/* Unified Auto-Scrolling Horizontal List */}
        <div className="relative group">
          {/* Scroll hint indicators */}
          {canScrollLeft && (
            <button
              onClick={() => scrollByAmount(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/20 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-accent" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollByAmount(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/20 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-accent" />
            </button>
          )}

          {/* Gradient edge hints */}
          {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />}
          {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />}

          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {projectsData.map((project) => (
              <div key={project.id} className="flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)]">
                <Card
                  className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 cursor-pointer flex flex-col"
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader className="p-0 shrink-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <CardTitle className="text-xl font-serif gradient-text mb-2 line-clamp-2">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1 leading-relaxed">{project.short_description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                         <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 border-accent/20 font-normal">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs border-accent/20 font-normal">+{project.technologies.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex justify-end mt-auto pt-2 border-t border-border/50">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProject(project) }}
                        className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-medium uppercase tracking-wider"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Mobile Swipe helper text */}
          <div className="flex justify-center items-center gap-2 mt-2 md:hidden">
            <span className="text-xs text-muted-foreground flex items-center gap-1 opacity-70">
              <ChevronLeft className="h-3 w-3" />
              Swipe to explore
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-accent/20 mx-4 sm:mx-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-serif gradient-text">{selectedProject.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6">
                <img
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-lg border border-accent/20"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-accent">Description</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{selectedProject.full_description}</p>
                </div>
                {selectedProject.functionality?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-accent">Key Features</h3>
                    <ul className="space-y-2">
                      {selectedProject.functionality.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-accent to-secondary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-accent">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-gradient-to-r from-primary/20 to-accent/20 border-accent/30">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
