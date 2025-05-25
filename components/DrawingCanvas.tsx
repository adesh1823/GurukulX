"use client"

import type React from "react"
import { useEffect, forwardRef } from "react"

interface DrawingPoint {
  x: number
  y: number
  pressure?: number
  timestamp: number
}

interface DrawingStroke {
  id: string
  points: DrawingPoint[]
  tool: string
  color: string
  size: number
  opacity: number
  region?: string
}

interface TextElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  fontSize: number
  color: string
  region: string
}

interface WhiteboardState {
  strokes: DrawingStroke[]
  textElements: TextElement[]
  currentStroke: DrawingStroke | null
  tool: string
  color: string
  size: number
  opacity: number
  background: string
  zoom: number
  pan: { x: number; y: number }
  history: (DrawingStroke[] | TextElement[])[]
  historyIndex: number
  selectedRegion: string
}

interface Region {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
}

interface DrawingCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>
  whiteboardState: WhiteboardState
  regions: Region[]
  isDrawing: boolean
  startDrawing: (e: React.PointerEvent) => void
  draw: (e: React.PointerEvent) => void
  stopDrawing: () => void
}

export const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(
  ({ containerRef, whiteboardState, regions, isDrawing, startDrawing, draw, stopDrawing }, ref) => {
    // Enhanced canvas rendering with accurate coordinate mapping
    useEffect(() => {
      if (!ref || typeof ref === "function") return
      const canvas = ref.current
      if (!canvas || !containerRef.current) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size to match container with device pixel ratio
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr)

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Set background
      if (whiteboardState.background === "grid") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, rect.width, rect.height)

        // Draw grid with proper scaling
        ctx.strokeStyle = "#e5e7eb"
        ctx.lineWidth = 1
        const gridSize = 20

        for (let x = 0; x <= rect.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, rect.height)
          ctx.stroke()
        }

        for (let y = 0; y <= rect.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(rect.width, y)
          ctx.stroke()
        }
      } else if (whiteboardState.background === "lines") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, rect.width, rect.height)

        // Draw lines with proper scaling
        ctx.strokeStyle = "#e5e7eb"
        ctx.lineWidth = 1
        const lineSpacing = 30

        for (let y = lineSpacing; y <= rect.height; y += lineSpacing) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(rect.width, y)
          ctx.stroke()
        }
      } else {
        ctx.fillStyle = whiteboardState.background
        ctx.fillRect(0, 0, rect.width, rect.height)
      }

      // Draw all strokes with accurate coordinate mapping
      const allStrokes = whiteboardState.currentStroke
        ? [...whiteboardState.strokes, whiteboardState.currentStroke]
        : whiteboardState.strokes

      allStrokes.forEach((stroke) => {
        if (stroke.points.length < 2) return

        ctx.globalAlpha = stroke.opacity
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.size
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        if (stroke.tool === "highlighter") {
          ctx.globalCompositeOperation = "multiply"
          ctx.globalAlpha = 0.3
        } else {
          ctx.globalCompositeOperation = "source-over"
        }

        ctx.beginPath()

        // Convert canvas coordinates to display coordinates
        const scaleX = (rect.width / canvas.width) * dpr
        const scaleY = (rect.height / canvas.height) * dpr

        const firstPoint = stroke.points[0]
        ctx.moveTo(firstPoint.x * scaleX, firstPoint.y * scaleY)

        // Use quadratic curves for smoother lines with proper coordinate scaling
        for (let i = 1; i < stroke.points.length; i++) {
          const point = stroke.points[i]
          const prevPoint = stroke.points[i - 1]

          const x = point.x * scaleX
          const y = point.y * scaleY
          const prevX = prevPoint.x * scaleX
          const prevY = prevPoint.y * scaleY

          const midX = (prevX + x) / 2
          const midY = (prevY + y) / 2

          if (i === 1) {
            ctx.lineTo(midX, midY)
          } else {
            ctx.quadraticCurveTo(prevX, prevY, midX, midY)
          }
        }

        // Draw the last point
        if (stroke.points.length > 1) {
          const lastPoint = stroke.points[stroke.points.length - 1]
          ctx.lineTo(lastPoint.x * scaleX, lastPoint.y * scaleY)
        }

        ctx.stroke()
      })

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
    }, [whiteboardState, ref, containerRef])

    // Enhanced resize handler
    useEffect(() => {
      const handleResize = () => {
        // Force re-render on resize
        if (ref && typeof ref !== "function" && ref.current && containerRef.current) {
          const canvas = ref.current
          const container = containerRef.current
          const rect = container.getBoundingClientRect()
          const dpr = window.devicePixelRatio || 1

          canvas.width = rect.width * dpr
          canvas.height = rect.height * dpr
          canvas.style.width = `${rect.width}px`
          canvas.style.height = `${rect.height}px`
        }
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [ref, containerRef])

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{
          cursor:
            whiteboardState.tool === "eraser"
              ? "crosshair"
              : whiteboardState.tool === "pen"
                ? "crosshair"
                : whiteboardState.tool === "highlighter"
                  ? "crosshair"
                  : whiteboardState.tool === "text"
                    ? "text"
                    : "default",
        }}
      >
        <canvas
          ref={ref}
          className="absolute inset-0 w-full h-full"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          style={{ touchAction: "none" }}
        />
      </div>
    )
  },
)

DrawingCanvas.displayName = "DrawingCanvas"
