"use client"

import { useState, useEffect } from "react"
import { Heart, Code, Coffee } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useNavigationSettings } from "@/hooks/use-navigation-settings"
import { getSocialIcon } from "@/lib/social-icons"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const router = useRouter()
  const pathname = usePathname()
  const { getEnabledSections } = useNavigationSettings()

  const [socialLinks, setSocialLinks] = useState<any[]>([
    { id: 'linkedin', href: "https://www.linkedin.com/in/saqlein-shaikh", label: "LinkedIn" },
    { id: 'github', href: "https://github.com/saqleinshaikh", label: "GitHub" },
  ])

  useEffect(() => {
    fetch('/api/social-links')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object' && !data.error) {
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
      })
      .catch(err => console.error("Error fetching footer social links:", err))
  }, [])

  const handleNavigation = (sectionId: string) => {
    // If we're on a blog page, navigate to home first
    if (pathname?.startsWith('/blogs/')) {
      router.push(`/#${sectionId}`)
    } else {
      // If we're on the home page, just scroll
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  const enabledSections = getEnabledSections()
  const navigationMap = {
    home: "Home",
    experience: "Experience", 
    skills: "Skills",
    projects: "Projects",
    education: "Education",
    certifications: "Certifications",
    blogs: "Blogs",
    endorsements: "Endorsements",
    video: "Video Resume",
    contact: "Contact"
    // Note: profile_photo excluded from footer links as it's not navigable
  }

  return (
    <footer className="bg-primary text-primary-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Section - Branding */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-serif">Saqlein Shaikh</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Passionate Mendix Developer creating innovative digital solutions that drive business transformation.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social) => {
                const IconComp = getSocialIcon(social.id)
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors hover:scale-110 transform duration-300"
                    aria-label={social.label}
                  >
                    <IconComp className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {enabledSections.map((section) => (
                <button
                  key={section.section_key}
                  onClick={() => handleNavigation(section.section_key)}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm text-left"
                >
                  {navigationMap[section.section_key as keyof typeof navigationMap] || section.section_name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Section - Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get In Touch</h4>
            <div className="space-y-2 text-sm">
              <p className="text-primary-foreground/80">
                <strong>Email:</strong>{" "}
                <a href="mailto:saqlein.shaikh@email.com" className="hover:text-primary-foreground transition-colors">
                  saqleinsheikh43@gmail.com
                </a>
              </p>

              <p className="text-primary-foreground/80">
                <strong>Location:</strong> Pune, Maharashtra, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center text-center">
            <div className="flex items-center text-sm text-primary-foreground/80 text-center">
              <span>&copy; {currentYear} Saqlein Shaikh. All rights reserved.</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-primary-foreground/60">
              This portfolio showcases my professional journey and technical expertise. Feel free to explore and connect
              with me for opportunities and collaborations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
