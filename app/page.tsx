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
import { Coffee, ArrowDown } from "lucide-react"
import { useNavigationSettings } from "@/hooks/use-navigation-settings"
import { getSocialIcon } from "@/lib/social-icons"
import { usePageTransition } from "@/components/page-transition-loader"

const defaultSocialLinks = [
  { id: 'linkedin', href: "https://www.linkedin.com/in/saqlein-shaikh", label: "LinkedIn" },
  { id: 'github', href: "https://github.com/saqleinshaikh", label: "GitHub" },
]

export default function HomePage() {
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks)
  const [showLoader, setShowLoader] = useState(true)
  const [animatingOut, setAnimatingOut] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("Initializing connection...")

  const [fetchedData, setFetchedData] = useState<any>({
    settings: [],
    skills: [],
    projects: [],
    experience: [],
    endorsements: [],
    education: [],
    certifications: [],
    blogs: [],
  })

  const { endTransition } = usePageTransition()

  // Start all fetches in parallel
  useEffect(() => {
    endTransition() // clear any incoming navigation overlay
    const totalApis = 9
    let completed = 0

    const updateProgress = (label: string) => {
      completed += 1
      const pct = Math.round((completed / totalApis) * 100)
      setProgress(pct)
      
      if (pct === 100) {
        setStatusText("Ready!")
      } else {
        setStatusText(`Retrieved ${label}...`)
      }
    }

    const fetchItem = async (key: string, url: string, label: string, fallback: any) => {
      try {
        const res = await fetch(url)
        if (!res.ok) {
          console.warn(`Non-ok response for ${key}: ${res.status}`)
          setFetchedData((prev: any) => ({ ...prev, [key]: fallback }))
          return
        }
        const data = await res.json()
        setFetchedData((prev: any) => ({ ...prev, [key]: data }))
      } catch (err) {
        console.warn(`Failed to fetch ${key}:`, err)
        setFetchedData((prev: any) => ({ ...prev, [key]: fallback }))
      } finally {
        updateProgress(label)
      }
    }

    const fetchSocialLinks = async () => {
      try {
        const res = await fetch('/api/social-links')
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()
        if (data && typeof data === 'object') {
          const linksArray = Object.entries(data)
            .filter(([_, url]) => url && url !== "#")
            .map(([platform, url]) => ({
              id: platform,
              href: url as string,
              label: platform.charAt(0).toUpperCase() + platform.slice(1)
            }))
          if (linksArray.length > 0) {
            setSocialLinks(linksArray)
          }
        }
      } catch (err) {
        console.error('Failed to fetch social links:', err)
      } finally {
        updateProgress('social links')
      }
    }

    // Trigger parallel fetches
    fetchItem('settings', '/api/navigation-settings', 'navigation settings', [])
    fetchSocialLinks()
    fetchItem('skills', '/api/skills', 'skills inventory', [])
    fetchItem('projects', '/api/projects', 'projects', [])
    fetchItem('experience', '/api/experience', 'experience history', [])
    fetchItem('endorsements', '/api/endorsements', 'testimonials', [])
    fetchItem('education', '/api/education', 'education info', [])
    fetchItem('certifications', '/api/certifications', 'certifications', [])
    fetchItem('blogs', '/api/blogs?published=true', 'blog articles', [])
  }, [])

  // Trigger smooth transition out when progress hits 100%
  useEffect(() => {
    if (progress === 100) {
      const animTimer = setTimeout(() => {
        setAnimatingOut(true)
      }, 400) // Brief hold at 100% for smooth visuals

      const hideTimer = setTimeout(() => {
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
      }, 1400) // Matches opacity fadeout transition duration (1000ms)

      return () => {
        clearTimeout(animTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [progress])

  const isEnabled = (sectionKey: string) => {
    // If still loading, don't render sections
    if (progress < 100) {
      return false
    }
    
    const settings = fetchedData.settings
    if (!settings || settings.length === 0) {
      // Default enabled sections (video disabled by default)
      const defaultEnabled = ['home', 'experience', 'skills', 'projects', 'education', 'certifications', 'blogs', 'endorsements', 'contact']
      return defaultEnabled.includes(sectionKey)
    }
    
    const setting = settings.find((s: any) => s.section_key === sectionKey)
    return setting ? setting.enabled : false
  }

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
          
          {/* Redesigned Progress Circle Container */}
          <div 
            className={`fixed inset-0 z-[101] pointer-events-none flex flex-col items-center justify-center transition-all duration-[1000ms] ease-in-out ${
              animatingOut 
                ? "opacity-0 scale-95" 
                : "opacity-100 scale-100"
            }`}
          >
            <div className="w-48 h-48 relative flex items-center justify-center">
              {/* Subtle background glow pulsing behind the circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 via-accent/20 to-secondary/15 blur-xl animate-pulse"></div>
              
              {/* Outer static framing ring */}
              <div className="absolute inset-2 rounded-full border border-primary/10 bg-background/60 backdrop-blur-md"></div>
              
              {/* SVG Progress Circle */}
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-muted/40 fill-none"
                  strokeWidth="5"
                />
                {/* Active progress track */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={439.8}
                  strokeDashoffset={439.8 - (progress / 100) * 439.8}
                  className="transition-all duration-300 ease-out"
                  style={{
                    filter: "drop-shadow(0 0 8px var(--accent))"
                  }}
                />
              </svg>
              
              {/* Center percentage value */}
              <div className="absolute inset-[32px] rounded-full bg-background/95 flex items-center justify-center shadow-lg dark:shadow-[inset_0_0_15px_rgba(var(--primary),0.1)]">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  {progress}%
                </span>
              </div>
            </div>
            
            {/* Loading text and linear bar */}
            <div className="mt-8 text-center space-y-3 px-4 max-w-xs">
              <div className="text-sm font-semibold tracking-wider text-muted-foreground/80 uppercase">
                Loading Portfolio
              </div>
              <div className="text-sm font-medium text-accent animate-pulse min-h-[20px]">
                {statusText}
              </div>
              
              {/* Small horizontal progress bar */}
              <div className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden mx-auto">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
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
                {socialLinks.map((social) => {
                  const IconComp = getSocialIcon(social.id)
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-all duration-300 transform hover:scale-110"
                      aria-label={social.label}
                    >
                      <IconComp className="h-5 w-5 sm:h-6 sm:w-6" />
                    </a>
                  )
                })}
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
      {isEnabled('experience') && <ExperienceSection data={fetchedData.experience} />}
      {isEnabled('skills') && <SkillsSection data={fetchedData.skills} />}
      {isEnabled('projects') && <ProjectsSection data={fetchedData.projects} />}
      {isEnabled('education') && <EducationSection data={fetchedData.education} />}
      {isEnabled('certifications') && <CertificationsSection data={fetchedData.certifications} />}
      {isEnabled('blogs') && <BlogSection data={fetchedData.blogs} />}
      {isEnabled('endorsements') && <EndorsementsSection data={fetchedData.endorsements} />}
      {isEnabled('video') && <VideoResumeSection />}
      {isEnabled('contact') && <ContactSection />}

      {/* Footer */}
      <Footer />
    </div>
  )
}
