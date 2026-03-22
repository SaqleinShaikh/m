"use client"

import { useEffect, useState, useRef, RefObject } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy, Calendar, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { useAutoScroll } from "@/hooks/use-auto-scroll"

interface Certification {
  id: string
  title: string
  issuer: string
  issue_date: string
  image: string
  description: string
  credential_url: string
  type: string
}

export default function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const certsScrollRef = useRef<HTMLDivElement>(null)
  const awardsScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeftCerts, setCanScrollLeftCerts] = useState(false)
  const [canScrollRightCerts, setCanScrollRightCerts] = useState(true)
  const [canScrollLeftAwards, setCanScrollLeftAwards] = useState(false)
  const [canScrollRightAwards, setCanScrollRightAwards] = useState(true)

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => res.json())
      .then(data => {
        setCertifications(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching certifications:', err)
        setCertifications([])
        setLoading(false)
      })
  }, [])

  const certs = certifications.filter(c => c.type === 'certification')
  const awards = certifications.filter(c => c.type === 'award')

  const checkScrollCerts = () => {
    const el = certsScrollRef.current
    if (!el) return
    setCanScrollLeftCerts(el.scrollLeft > 10)
    setCanScrollRightCerts(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const checkScrollAwards = () => {
    const el = awardsScrollRef.current
    if (!el) return
    setCanScrollLeftAwards(el.scrollLeft > 10)
    setCanScrollRightAwards(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const elCerts = certsScrollRef.current
    const elAwards = awardsScrollRef.current
    if (elCerts) {
      checkScrollCerts()
      elCerts.addEventListener('scroll', checkScrollCerts, { passive: true })
      window.addEventListener('resize', checkScrollCerts)
    }
    if (elAwards) {
      checkScrollAwards()
      elAwards.addEventListener('scroll', checkScrollAwards, { passive: true })
      window.addEventListener('resize', checkScrollAwards)
    }
    return () => {
      if (elCerts) {
        elCerts.removeEventListener('scroll', checkScrollCerts)
        window.removeEventListener('resize', checkScrollCerts)
      }
      if (elAwards) {
        elAwards.removeEventListener('scroll', checkScrollAwards)
        window.removeEventListener('resize', checkScrollAwards)
      }
    }
  }, [certifications])

  const scrollByAmount = (ref: RefObject<HTMLDivElement | null>, dir: number) => {
    const el = ref.current
    if (!el) return
    const width = el.children[0]?.clientWidth || 300
    el.scrollBy({ left: dir * (width + 24), behavior: 'smooth' })
  }

  useAutoScroll(certsScrollRef, 3500, !loading && certs.length > 3)
  useAutoScroll(awardsScrollRef, 4000, !loading && awards.length > 3)

  if (loading) {
    return (
      <section id="certifications" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading certifications...</p>
        </div>
      </section>
    )
  }

  const openUrl = (url: string) => {
    if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="certifications" className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-primary mb-3 sm:mb-4">Certifications & Awards</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and recognition for excellence in software development
          </p>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent/10 p-2 rounded-full">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-primary">Professional Certifications</h3>
          </div>

          <div className="relative group mb-8">
            {canScrollLeftCerts && (
              <button onClick={() => scrollByAmount(certsScrollRef, -1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/20 transition-all opacity-0 group-hover:opacity-100" aria-label="Scroll left">
                <ChevronLeft className="h-5 w-5 text-accent" />
              </button>
            )}
            {canScrollRightCerts && (
              <button onClick={() => scrollByAmount(certsScrollRef, 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/20 transition-all opacity-0 group-hover:opacity-100" aria-label="Scroll right">
                <ChevronRight className="h-5 w-5 text-accent" />
              </button>
            )}

            {canScrollLeftCerts && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />}
            {canScrollRightCerts && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />}

            <div
              ref={certsScrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {certs.map((cert) => (
                <div key={cert.id} className="flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)]">
                  <Card
                    className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 cursor-pointer flex flex-col"
                    onClick={() => openUrl(cert.credential_url)}
                  >
                    <CardHeader className="p-0 shrink-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={cert.image || "/placeholder.svg"}
                          alt={cert.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-accent text-accent-foreground">{cert.issue_date}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <CardTitle className="text-xl font-serif gradient-text mb-2 line-clamp-2">{cert.title}</CardTitle>
                      <p className="text-sm text-accent font-medium mb-2">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">{cert.description}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {cert.issue_date}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); openUrl(cert.credential_url) }}
                          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium uppercase tracking-wider"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center items-center gap-2 mt-2 md:hidden">
              <span className="text-xs text-muted-foreground flex items-center gap-1 opacity-70">
                <ChevronLeft className="h-3 w-3" />
                Swipe to explore
                <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Awards */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent/10 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-primary">Awards & Recognition</h3>
          </div>

          <div className="relative group mb-8">
            {canScrollLeftAwards && (
              <button onClick={() => scrollByAmount(awardsScrollRef, -1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/20 transition-all opacity-0 group-hover:opacity-100" aria-label="Scroll left">
                <ChevronLeft className="h-5 w-5 text-accent" />
              </button>
            )}
            {canScrollRightAwards && (
              <button onClick={() => scrollByAmount(awardsScrollRef, 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-accent/30 shadow-lg flex items-center justify-center hover:bg-accent/20 transition-all opacity-0 group-hover:opacity-100" aria-label="Scroll right">
                <ChevronRight className="h-5 w-5 text-accent" />
              </button>
            )}

            {canScrollLeftAwards && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />}
            {canScrollRightAwards && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />}

            <div
              ref={awardsScrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {awards.map((award) => (
                <div key={award.id} className="flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)]">
                  <Card
                    className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-accent/20 hover:border-accent/40 cursor-pointer flex flex-col"
                    onClick={() => openUrl(award.image)}
                  >
                    <CardHeader className="p-0 shrink-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={award.image || "/placeholder.svg"}
                          alt={award.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">{award.issue_date}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <CardTitle className="text-xl font-serif gradient-text mb-2 line-clamp-2">{award.title}</CardTitle>
                      <p className="text-sm text-accent font-medium mb-1">{award.issuer}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">{award.description}</p>

                      <div className="flex justify-end pt-2 border-t border-border/50 mt-auto">
                        <button
                          onClick={(e) => { e.stopPropagation(); openUrl(award.image) }}
                          className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors font-medium uppercase tracking-wider"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Award
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center items-center gap-2 mt-2 md:hidden">
              <span className="text-xs text-muted-foreground flex items-center gap-1 opacity-70">
                <ChevronLeft className="h-3 w-3" />
                Swipe to explore
                <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
