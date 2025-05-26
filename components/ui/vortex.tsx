"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { createNoise3D } from "simplex-noise"

interface VortexProps {
  className?: string
  particleCount?: number
  particleSize?: number
  baseHue?: number
  hueRange?: number
  baseSpeed?: number
  rangeY?: number
  backgroundColor?: string
  children?: React.ReactNode
}

export function Vortex({
  className = "",
  particleCount = 300,
  particleSize = 2,
  baseHue = 220,
  hueRange = 60,
  baseSpeed = 0.5,
  rangeY = 600,
  backgroundColor = "rgba(0,0,0,0.8)",
  children,
}: VortexProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const noise3D = createNoise3D()
    let animationFrameId: number
    let particles: Particle[] = []
    let width = 0
    let height = 0

    class Particle {
      x: number
      y: number
      size: number
      color: string
      speed: number
      angle: number
      noiseOffsetX: number
      noiseOffsetY: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * particleSize + 0.5
        this.color = `hsl(${baseHue + Math.random() * hueRange}, 80%, 60%)`
        this.speed = Math.random() * baseSpeed + 0.1
        this.angle = Math.random() * Math.PI * 2
        this.noiseOffsetX = Math.random() * 1000
        this.noiseOffsetY = Math.random() * 1000
      }

      update(time: number) {
        // Use noise to create a flowing effect
        const noiseX = noise3D(this.x * 0.001, this.y * 0.001, time * 0.0005 + this.noiseOffsetX)
        const noiseY = noise3D(this.x * 0.001, this.y * 0.001, time * 0.0005 + this.noiseOffsetY)

        // Calculate center of canvas
        const centerX = width / 2
        const centerY = height / 2

        // Vector from particle to center
        const dx = centerX - this.x
        const dy = centerY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Normalize and apply vortex effect
        const vx = dx / distance
        const vy = dy / distance
        const vortexStrength = 0.5 * Math.min(1, 100 / distance)

        // Combine noise and vortex
        this.x += (noiseX + vy * vortexStrength) * this.speed
        this.y += (noiseY - vx * vortexStrength) * this.speed

        // Wrap around edges
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const resizeCanvas = () => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth
        height = containerRef.current.offsetHeight
        canvas.width = width
        canvas.height = height

        // Recreate particles on resize
        particles = []
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle())
        }
      }
    }

    const animate = (time: number) => {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)

      particles.forEach((particle) => {
        particle.update(time)
        particle.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    animationFrameId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, particleSize, baseHue, hueRange, baseSpeed, backgroundColor])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ width: "100%", height: "100%" }} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
