"use client"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, ChevronDown, Download } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import { useNavigationSettings } from "@/hooks/use-navigation-settings"

// Map section keys to navigation items
const navigationMap = {
  home: { name: "Home", href: "#home" },
  experience: { name: "Experience", href: "#experience" },
  skills: { name: "Skills", href: "#skills" },
  projects: { name: "Projects", href: "#projects" },
  education: { name: "Education", href: "#education" },
  certifications: { name: "Certifications & Awards", href: "#certifications" },
  blogs: { name: "Blogs", href: "#blogs" },
  endorsements: { name: "Endorsements", href: "#endorsements" },
  video: { name: "Video Resume", href: "#video-resume" },
  contact: { name: "Contact Me", href: "#contact" },
  // Note: profile_photo is not included in navigation as it's not a navigable section
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { getEnabledSections, loading } = useNavigationSettings()

  const handleNav = (href: string) => {
    const onHome = pathname === "/" || pathname.startsWith("/#")
    if (onHome) {
      if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      }
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
      router.push(`/${href}`)
      return
    }
    router.push(href === "#home" ? "/" : `/${href}`)
  }

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold font-serif gradient-text">Saqlein Shaikh</h1>
            </div>
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </div>
      </nav>
    )
  }

  const enabledSections = getEnabledSections()
  const enabledNavItems = enabledSections
    .filter(section => section.section_key !== 'profile_photo') // Exclude profile photo from navigation
    .map(section => navigationMap[section.section_key as keyof typeof navigationMap])
    .filter(Boolean)

  // Split items for desktop: main nav and dropdown
  const mainNavItems = enabledNavItems.slice(0, 5) // First 5 items in main nav
  const dropdownItems = enabledNavItems.slice(5) // Rest in dropdown

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold font-serif gradient-text">Saqlein Shaikh</h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {mainNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.href)}
                  className="text-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-accent/10"
                >
                  {item.name}
                </button>
              ))}

              {dropdownItems.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 hover:bg-accent/10">
                      More <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border-border/50">
                    {dropdownItems.map((item) => (
                      <DropdownMenuItem
                        key={item.name}
                        onClick={() => handleNav(item.href)}
                        className="hover:bg-accent/10"
                      >
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button 
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-secondary transition-all duration-300 animate-glow"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Saqlein-Shaikh.pdf';
                link.download = 'Saqlein-Shaikh-Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-xl border-t border-border/50">
              {enabledNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNav(item.href)
                    setIsOpen(false)
                  }}
                  className="text-foreground hover:text-accent block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 hover:bg-accent/10"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 py-2">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-accent w-full"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/Saqlein-Shaikh.pdf';
                    link.download = 'Saqlein-Shaikh-Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsOpen(false);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
