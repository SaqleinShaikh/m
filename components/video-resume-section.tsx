"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, Download } from "lucide-react"

export default function VideoResumeSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control the video player as player
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In a real implementation, this would control the video audio
  }

  return (
    <section id="video-resume" className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-primary mb-3 sm:mb-4">Video Resume</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know me better through this personal introduction and overview of my professional journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Video Player Container */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {/* Placeholder Video Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=600&text=Video+Resume+Thumbnail"
                    alt="Video Resume Thumbnail"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-accent/90 hover:bg-accent text-accent-foreground rounded-full w-20 h-20 p-0"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </Button>
                  </div>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="ghost" className="text-white hover:text-accent" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:text-accent" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <span className="text-white text-sm">0:00 / 3:45</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:text-accent">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:text-accent">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div className="bg-accent h-1 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Information */}
              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-bold font-serif text-primary mb-2">
                  Saqlein Shaikh - Professional Introduction
                </h3>
                <p className="text-muted-foreground mb-4">
                  A 3-minute overview of my professional journey, technical expertise, and what drives me as a Mendix
                  developer. Learn about my experience at TCS and Deloitte, my approach to problem-solving, and my
                  passion for creating innovative digital solutions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-primary mb-1">Duration</h4>
                    <p className="text-muted-foreground">3 minutes 45 seconds</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-primary mb-1">Topics Covered</h4>
                    <p className="text-muted-foreground">Experience, Skills, Goals</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-primary mb-1">Language</h4>
                    <p className="text-muted-foreground">English</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Want to discuss opportunities or learn more about my work? Feel free to reach out!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Get In Touch
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
