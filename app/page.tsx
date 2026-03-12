"use client"

import Navigation from "@/components/navigation"
import ThreeBackground from "@/components/three-background"
import EducationSection from "@/components/education-section"
import ExperienceSection from "@/components/experience-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import BlogSection from "@/components/blog-section"
import TestimonialsSection from "@/components/testimonials-section"
import CertificationsSection from "@/components/certifications-section"
import VideoResumeSection from "@/components/video-resume-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Coffee, ArrowDown, Github, Linkedin, Instagram } from "lucide-react"
import { XIcon } from "@/components/x-icon"
import { useNavigationSettings } from "@/hooks/use-navigation-settings"

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/saqlein-shaikh", label: "LinkedIn", color: "hover:text-blue-400" },
  { icon: Github, href: "https://github.com/saqleinshaikh", label: "GitHub", color: "hover:text-purple-400" },
  { icon: XIcon, href: "#", label: "X (Twitter)", color: "hover:text-cyan-400" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
]

export default function HomePage() {
  const { isEnabled, loading } = useNavigationSettings()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Show loading state while navigation settings are being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading website...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ThreeBackground />
      <Navigation />

      {/* Hero Section - Always visible */}
      {isEnabled('home') && (
        <section id="home" className="min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6 animate-slide-in-left">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold font-serif gradient-text leading-tight">
                  Saqlein Shaikh
                </h1>
                <h2 className="text-2xl lg:text-3xl text-accent font-semibold">Mendix Developer</h2>
                <p className="text-lg text-muted-foreground">
                  Currently at <span className="text-secondary font-semibold">Deloitte</span>
                </p>
              </div>

              <p className="text-lg text-foreground leading-relaxed max-w-lg">
                Passionate about creating innovative digital solutions with Mendix platform. Experienced in building
                scalable applications that drive business transformation and deliver exceptional user experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-secondary transition-all duration-300 animate-glow"
                  onClick={() => scrollToSection("projects")}
                >
                  View My Work
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 bg-transparent border-accent hover:bg-accent/10 transition-all duration-300"
                  onClick={() => scrollToSection("contact")}
                >
                  Get In Touch
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <span className="text-muted-foreground text-sm">Follow me:</span>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground ${social.color} transition-all duration-300 transform hover:scale-110`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side - Photo */}
            {isEnabled('profile_photo') && (
              <div className="flex justify-center lg:justify-end animate-slide-in-right">
                <div className="relative">
                  <Card className="p-8 bg-card/50 backdrop-blur-sm border-2 border-accent/20 animate-float">
                    <div className="relative">
                      <img
                        src="/header-light.png"
                        alt="Saqlein Shaikh holding a coffee cup"
                        className="w-80 h-96 object-cover rounded-lg shadow-2xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-user.jpg";
                        }}
                      />
                      <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-accent to-secondary text-accent-foreground p-3 rounded-full shadow-lg animate-bounce">
                        <Coffee className="h-6 w-6" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-6 w-6 text-accent" />
          </div>
        </div>
      </section>
        )}

      {/* All Portfolio Sections with Conditional Rendering */}
      {isEnabled('experience') && <ExperienceSection />}
      {isEnabled('skills') && <SkillsSection />}
      {isEnabled('projects') && <ProjectsSection />}
      {isEnabled('education') && <EducationSection />}
      {isEnabled('certifications') && <CertificationsSection />}
      {isEnabled('blogs') && <BlogSection />}
      {isEnabled('testimonials') && <TestimonialsSection />}
      {isEnabled('video') && <VideoResumeSection />}
      {isEnabled('contact') && <ContactSection />}

      {/* Footer */}
      <Footer />
    </div>
  )
}
