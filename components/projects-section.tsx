"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  if (loading) {
    return (
      <section id="projects" className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </section>
    )
  }

  const visibleProjects = 4
  const maxIndex = Math.max(0, projectsData.length - visibleProjects)

  const nextProjects = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevProjects = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section id="projects" className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif gradient-text mb-4">Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work in building scalable applications and digital solutions
          </p>
        </div>

        {/* Projects Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
            {projectsData.slice(currentIndex, currentIndex + visibleProjects).map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedProject(project)}
                            className="bg-white/90 text-black hover:bg-white transform hover:scale-105 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-accent/20">
                          {selectedProject && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-serif gradient-text">
                                  {selectedProject.title}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <img
                                  src={selectedProject.image || "/placeholder.svg"}
                                  alt={selectedProject.title}
                                  className="w-full h-64 object-cover rounded-lg border border-accent/20"
                                />

                                <div>
                                  <h3 className="text-lg font-semibold mb-2 text-accent">Description</h3>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {selectedProject.full_description}
                                  </p>
                                </div>

                                <div>
                                  <h3 className="text-lg font-semibold mb-3 text-accent">Key Features</h3>
                                  <ul className="space-y-2">
                                    {selectedProject.functionality.map((feature, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-gradient-to-r from-accent to-secondary rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-muted-foreground">{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h3 className="text-lg font-semibold mb-3 text-accent">Technologies Used</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedProject.technologies.map((tech, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-gradient-to-r from-primary/20 to-accent/20 border-accent/30"
                                      >
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-serif gradient-text mb-2 line-clamp-2">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.short_description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-primary/20 to-accent/20 border-accent/30"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs border-accent/30">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          {projectsData.length > visibleProjects && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={prevProjects}
                disabled={currentIndex === 0}
                className="bg-background/80 backdrop-blur-sm border-accent/30 hover:bg-accent/10"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextProjects}
                disabled={currentIndex >= maxIndex}
                className="bg-background/80 backdrop-blur-sm border-accent/30 hover:bg-accent/10"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
