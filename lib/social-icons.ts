import { Github, Linkedin, Instagram, Facebook, Youtube, Globe } from "lucide-react"
import { XIcon } from "@/components/x-icon"

export const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase().trim()) {
    case 'linkedin':
      return Linkedin
    case 'github':
      return Github
    case 'twitter':
    case 'x':
      return XIcon
    case 'instagram':
      return Instagram
    case 'facebook':
      return Facebook
    case 'youtube':
      return Youtube
    default:
      return Globe
  }
}
