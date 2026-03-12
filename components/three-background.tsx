"use client"

import { useEffect, useRef } from "react"

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    let scene: any,
      camera: any,
      renderer: any,
      particles: any,
      cubes: any[] = [],
      dashboards: any[] = []

    const init = async () => {
      // Dynamic import for Three.js to avoid SSR issues
      const THREE = await import("three")

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement)
      }

      const geometry = new THREE.BufferGeometry()
      const particleCount = 200
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20

        // Neon cyan, soft blue, electric purple colors
        const colorChoice = Math.random()
        if (colorChoice < 0.33) {
          colors[i * 3] = 0.0 // R - Neon cyan
          colors[i * 3 + 1] = 1.0 // G
          colors[i * 3 + 2] = 1.0 // B
        } else if (colorChoice < 0.66) {
          colors[i * 3] = 0.4 // R - Soft blue
          colors[i * 3 + 1] = 0.7 // G
          colors[i * 3 + 2] = 1.0 // B
        } else {
          colors[i * 3] = 0.8 // R - Electric purple
          colors[i * 3 + 1] = 0.2 // G
          colors[i * 3 + 2] = 1.0 // B
        }
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      })

      particles = new THREE.Points(geometry, material)
      scene.add(particles)

      for (let i = 0; i < 8; i++) {
        const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        const cubeMaterial = new THREE.MeshBasicMaterial({
          color: i % 3 === 0 ? 0x00ffff : i % 3 === 1 ? 0x6699ff : 0xcc66ff,
          transparent: true,
          opacity: 0.6,
          wireframe: true,
        })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

        cube.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10)

        cubes.push(cube)
        scene.add(cube)
      }

      for (let i = 0; i < 4; i++) {
        const dashboardGeometry = new THREE.PlaneGeometry(2, 1.2)
        const dashboardMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffaa,
          transparent: true,
          opacity: 0.3,
          wireframe: true,
          side: THREE.DoubleSide,
        })
        const dashboard = new THREE.Mesh(dashboardGeometry, dashboardMaterial)

        dashboard.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8)
        dashboard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

        dashboards.push(dashboard)
        scene.add(dashboard)
      }

      const lineGeometry = new THREE.BufferGeometry()
      const linePositions = []

      for (let i = 0; i < cubes.length - 1; i++) {
        linePositions.push(cubes[i].position.x, cubes[i].position.y, cubes[i].position.z)
        linePositions.push(cubes[i + 1].position.x, cubes[i + 1].position.y, cubes[i + 1].position.z)
      }

      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
      })
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
      scene.add(lines)

      camera.position.z = 8

      animate()
    }

    const animate = () => {
      requestAnimationFrame(animate)

      if (particles) {
        particles.rotation.x += 0.0005
        particles.rotation.y += 0.001
      }

      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01 + index * 0.002
        cube.rotation.y += 0.008 + index * 0.001
        cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002
      })

      dashboards.forEach((dashboard, index) => {
        dashboard.rotation.z += 0.005
        dashboard.position.x += Math.sin(Date.now() * 0.0008 + index * 2) * 0.01
        dashboard.position.y += Math.cos(Date.now() * 0.0006 + index * 1.5) * 0.008
      })

      renderer.render(scene, camera)
    }

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }

    init()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={mountRef} className="fixed inset-0 -z-10 pointer-events-none" style={{ background: "transparent" }} />
  )
}
