"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy, Calendar, ExternalLink } from "lucide-react"

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

  if (loading) {
    return (
      <section id="certifications" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading certifications...</p>
        </div>
      </section>
    )
  }

  const certs = certifications.filter(c => c.type === 'certification')
  const awards = certifications.filter(c => c.type === 'award')

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {certs.map((cert) => (
              <Card
                key={cert.id}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm cursor-pointer"
                onClick={() => openUrl(cert.credential_url)}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-accent text-accent-foreground">{cert.issue_date}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-serif text-primary mb-2 line-clamp-2">{cert.title}</CardTitle>
                  <p className="text-sm text-accent font-medium mb-2">{cert.issuer}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{cert.description}</p>

                  {/* Bottom row: date left, button right — matching screenshot style */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {cert.issue_date}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); openUrl(cert.credential_url) }}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Credential
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {awards.map((award) => (
              <Card
                key={award.id}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm cursor-pointer"
                onClick={() => openUrl(award.image)}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={award.image || "/placeholder.svg"}
                      alt={award.title}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{award.issue_date}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-base font-serif text-primary mb-2 line-clamp-2">{award.title}</CardTitle>
                  <p className="text-sm text-accent font-medium mb-1">{award.issuer}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{award.description}</p>

                  {/* Small link-style button matching screenshot */}
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); openUrl(award.image) }}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Award
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
