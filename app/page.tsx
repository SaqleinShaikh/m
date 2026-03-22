"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import ThreeBackground from "@/components/three-background"
import EducationSection from "@/components/education-section"
import ExperienceSection from "@/components/experience-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import BlogSection from "@/components/blog-section"
import EndorsementsSection from "@/components/endorsements-section"
import CertificationsSection from "@/components/certifications-section"
import VideoResumeSection from "@/components/video-resume-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Coffee, ArrowDown, Github, Linkedin, Instagram } from "lucide-react"
import { XIcon } from "@/components/x-icon"
import { useNavigationSettings } from "@/hooks/use-navigation-settings"

const defaultSocialLinks = [
  { id: 'linkedin', icon: Linkedin, href: "https://www.linkedin.com/in/saqlein-shaikh", label: "LinkedIn", color: "hover:text-blue-400" },
  { id: 'github', icon: Github, href: "https://github.com/saqleinshaikh", label: "GitHub", color: "hover:text-purple-400" },
  { id: 'twitter', icon: XIcon, href: "#", label: "X (Twitter)", color: "hover:text-cyan-400" },
  { id: 'instagram', icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
]

export default function HomePage() {
  const { isEnabled, loading } = useNavigationSettings()
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks)
  const [linksLoading, setLinksLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)
  const [animatingOut, setAnimatingOut] = useState(false)

  // Trigger smooth transition out when API is done loading
  useEffect(() => {
    if (!loading) {
      // Small requestAnimationFrame delay prevents React batching glitches
      requestAnimationFrame(() => {
        setAnimatingOut(true)
      })
      const timer = setTimeout(() => {
        setShowLoader(false)
        
        // Ensure direct hash links jump correctly after dynamic components render
        if (window.location.hash) {
          setTimeout(() => {
            const id = window.location.hash.substring(1)
            const element = document.getElementById(id)
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          }, 100)
        }
      }, 1000) // matches transition duration
      return () => clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    fetch('/api/social-links')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSocialLinks(prev => prev.map(link => 
            data[link.id] ? { ...link, href: data[link.id] } : link
          ))
        }
      })
      .catch(console.error)
      .finally(() => setLinksLoading(false))
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Premium Minimalist Animated Loader Overlay */}
      {showLoader && (
        <>
          {/* Solid background covering everything until loaded */}
          <div 
            className={`fixed inset-0 z-[100] bg-background transition-opacity duration-[1000ms] pointer-events-none ease-in-out ${
              animatingOut ? "opacity-0" : "opacity-100"
            }`} 
          />
          
          {/* Animated SS Circle Container */}
          <div 
            className={`fixed z-[101] pointer-events-none flex items-center justify-center transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              animatingOut 
                ? "top-8 left-4 sm:left-6 lg:left-8 -translate-x-[0%] -translate-y-[50%] scale-[0.35] opacity-0" 
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-[50%] scale-100 opacity-100"
            }`}
            style={{ willChange: "transform, top, left, opacity" }}
          >
            {/* Elegant, colorful, and premium spinning rings */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 relative flex items-center justify-center">
              {/* Subtle background glow pulsing behind the circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 blur-xl animate-pulse"></div>
              
              {/* Outer static framing ring */}
              <div className="absolute inset-2 rounded-full border border-primary/20 bg-background/50 backdrop-blur-md"></div>
              
              {/* Fast interior primary color ring */}
              <div className="absolute inset-[10px] rounded-full border-t-2 border-r-2 border-primary/80 animate-[spin_2.5s_linear_infinite] shadow-[0_0_15px_rgba(var(--primary),0.3)]"></div>
              
              {/* Slower reverse accent ring */}
              <div className="absolute inset-[18px] rounded-full border-b-2 border-l-2 border-accent/80 animate-[spin_3.5s_linear_infinite_reverse] shadow-[0_0_15px_rgba(var(--accent),0.3)]"></div>
              
              {/* Center core holding the SS initials */}
              <div className="absolute inset-[28px] rounded-full bg-background/90 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_0_20px_rgba(var(--primary),0.2)]">
                <span className="text-4xl sm:text-5xl font-serif font-bold tracking-[0.1em] bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent pl-2 drop-shadow-sm">SS</span>
              </div>
            </div>
          </div>
        </>
      )}

      <ThreeBackground />
      <Navigation />

      {/* Hero Section - Always visible */}
      {isEnabled('home') && (
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-4 sm:space-y-6 animate-slide-in-left text-center lg:text-left">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-serif gradient-text leading-tight">
                  Saqlein Shaikh
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-accent font-semibold">Mendix Developer</h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Currently at <span className="text-secondary font-semibold">Deloitte</span>
                </p>
              </div>

              <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                Passionate about creating innovative digital solutions with Mendix platform. Experienced in building
                scalable applications that drive business transformation and deliver exceptional user experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-secondary transition-all duration-300 animate-glow"
                  onClick={() => scrollToSection("projects")}
                >
                  View My Work
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 bg-transparent border-accent hover:bg-accent/10 transition-all duration-300"
                  onClick={() => scrollToSection("contact")}
                >
                  Get In Touch
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-2 sm:pt-4">
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
                    <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side - Photo */}
            {isEnabled('profile_photo') && (
              <div className="flex justify-center lg:justify-end animate-slide-in-right order-first lg:order-last">
                <div className="relative">
                  <Card className="p-4 sm:p-8 bg-card/50 backdrop-blur-sm border-2 border-accent/20 animate-float">
                    <div className="relative">
                      <img
                        src="/header-light.png"
                        alt="Saqlein Shaikh holding a coffee cup"
                        className="w-56 h-72 sm:w-80 sm:h-96 object-cover rounded-lg shadow-2xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-user.jpg";
                        }}
                      />
                      <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-gradient-to-r from-accent to-secondary text-accent-foreground p-2.5 sm:p-3 rounded-full shadow-lg animate-bounce">
                        <Coffee className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
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
      {isEnabled('endorsements') && <EndorsementsSection />}
      {isEnabled('video') && <VideoResumeSection />}
      {isEnabled('contact') && <ContactSection />}

      {/* Footer */}
      <Footer />
    </div>
  )
}
