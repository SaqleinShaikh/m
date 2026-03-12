import type React from "react"
import type { ComponentType } from "react"
import Link from "next/link"

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let ThreeBackgroundComp: ComponentType | null = null
  let NavigationComp: ComponentType | null = null
  let FooterComp: ComponentType | null = null

  try {
    const m = await import("@/components/three-background")
    ThreeBackgroundComp = (m as any).default ?? (m as any).ThreeBackground ?? null
  } catch (e) {
    // Handle error
  }

  try {
    const m = await import("@/components/navigation")
    NavigationComp = (m as any).default ?? (m as any).Navigation ?? null
  } catch (e) {
    // Handle error
  }

  try {
    const m = await import("@/components/footer")
    FooterComp = (m as any).default ?? (m as any).Footer ?? null
  } catch (e) {
    // Handle error
  }

  return (
    <div className="min-h-screen bg-background">
      {/* match homepage chrome */}
      {ThreeBackgroundComp ? <ThreeBackgroundComp /> : null}
      {NavigationComp ? <NavigationComp /> : null}
      {/* Offset like homepage if nav is fixed */}
      <div className="pt-16">{children}</div>
      {FooterComp ? <FooterComp /> : null}
    </div>
  )
}
