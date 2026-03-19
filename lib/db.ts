// Simple JSON-based database utility
// This can be easily migrated to a real database later

import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

export interface Endorsement {
  id: number
  name: string
  email: string
  designation: string
  organization: string
  endorsement: string
  image: string
  rating: number
  approved: boolean
  createdAt: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  category: string
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailMessage {
  id: number
  type: 'contact' | 'endorsement'
  from: string
  email: string
  subject?: string
  message: string
  phone?: string
  date: string
  read: boolean
}

export interface AdminSettings {
  email: string
  password: string
  username: string
}

// Generic database functions
export function readDB<T>(filename: string): T[] {
  const filePath = path.join(DB_DIR, filename)
  if (!fs.existsSync(filePath)) {
    return []
  }
  const data = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(data)
}

export function writeDB<T>(filename: string, data: T[]): void {
  const filePath = path.join(DB_DIR, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// Initialize database files with default data
export function initializeDB() {
  // Initialize endorsements
  const endorsementsFile = path.join(DB_DIR, 'endorsements.json')
  if (!fs.existsSync(endorsementsFile)) {
    const defaultEndorsements: Endorsement[] = [
      {
        id: 1,
        name: "Rajesh Kumar",
        email: "rajesh@tcs.com",
        designation: "Senior Project Manager",
        organization: "TCS",
        endorsement: "Saqlein is an exceptional Mendix developer who consistently delivers high-quality solutions.",
        image: "/placeholder.svg?height=80&width=80&text=RK",
        rating: 5,
        approved: true,
        createdAt: new Date().toISOString()
      }
    ]
    writeDB('endorsements.json', defaultEndorsements)
  }

  // Initialize blogs
  const blogsFile = path.join(DB_DIR, 'blogs.json')
  if (!fs.existsSync(blogsFile)) {
    writeDB('blogs.json', [])
  }

  // Initialize emails
  const emailsFile = path.join(DB_DIR, 'emails.json')
  if (!fs.existsSync(emailsFile)) {
    writeDB('emails.json', [])
  }

  // Initialize admin settings
  const settingsFile = path.join(DB_DIR, 'admin-settings.json')
  if (!fs.existsSync(settingsFile)) {
    const defaultSettings: AdminSettings = {
      email: 'saqleinsheikh43@gmail.com',
      password: 'S@qlein050505',
      username: 'AppAdmin'
    }
    fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2))
  }
}
