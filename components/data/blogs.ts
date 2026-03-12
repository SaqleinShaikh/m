export type Blog = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category?: string
  tags?: string[]
  date?: string
  readTime?: string
  image?: string
}

export const blogs: Blog[] = [
  // You can replace/extend with your real data. Slugs must be unique.
  {
  "id": "1",
  "slug": "Mendix-Studio-Pro-Latest-Release-11.0",
  "title": "Mendix Studio Pro Latest Release 11.0",
  "excerpt": "Explore the powerful new features, enhancements, and productivity boosters introduced in the latest Mendix Studio Pro release.",
  "content": "Mendix has rolled out its latest Studio Pro release, delivering a host of features to accelerate low-code development and improve developer experience.\n\n Key Highlights:\n- Enhanced Performance Tools: The release brings optimized performance profiling, helping developers quickly identify and resolve bottlenecks in microflows.\n- Advanced Data Integration: Improved connectors and support for additional REST and OData features simplify data synchronization across enterprise systems.\n- UI/UX Improvements: New responsive templates and design-time previews allow developers to deliver better user experiences with less effort.\n- Collaboration Enhancements: Real-time collaboration updates improve multi-developer workflows, making it easier for teams to work on complex applications simultaneously.\n- Version Control Upgrades: Seamless Git-based project management ensures faster branching, merging, and CI/CD integration.\n\n Why It Matters\nWith these updates, Mendix Studio Pro continues to empower developers—both citizen and professional—by offering more intuitive tools, greater flexibility, and enterprise-ready scalability.\n\nStay tuned for more detailed use cases and examples as the community begins leveraging these exciting new features.",
  "category": "Mendix",
  "tags": ["mendix", "studio-pro", "low-code", "release-notes"],
  "date": "2025-09-02",
  "readTime": "7 min",
  "image": "/mendix-10.24.PNG?height=120&width=320&text=Mendix+Studio+Pro"
  },
  {
    id: "2",
    slug: "designing-better-ux-in-enterprise-apps",
    title: "Designing Better UX in Enterprise Apps",
    excerpt: "Principles to create usable, accessible enterprise UIs.",
    content: "Full article content goes here. Discuss UX heuristics, accessibility, and performance.\n\nDetails: ...",
    category: "UX",
    tags: ["ux", "accessibility", "enterprise"],
    date: "2024-08-10",
    readTime: "7 min",
    image: "/placeholder.svg?height=160&width=320&text=UX",
  },
  {
    id: "3",
    slug: "python-scripting-for-automation",
    title: "Python Scripting for Automation",
    excerpt: "Automate routine tasks with concise Python scripts.",
    content: "Full article content goes here. Show examples of scripts and patterns.\n\nExamples: ...",
    category: "Python",
    tags: ["python", "automation", "tips"],
    date: "2024-09-05",
    readTime: "6 min",
    image: "/placeholder.svg?height=160&width=320&text=Python",
  },
  {
    id: "4",
    slug: "sql-best-practices",
    title: "SQL Best Practices",
    excerpt: "Write fast, maintainable queries with confidence.",
    content: "Full article content goes here. Indexes, query plans, and schema design.\n\nChecklist: ...",
    category: "Database",
    tags: ["sql", "database", "performance"],
    date: "2024-09-18",
    readTime: "8 min",
    image: "/placeholder.svg?height=160&width=320&text=SQL",
  },
]
