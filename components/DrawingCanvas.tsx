
import React, { useEffect, forwardRef, useCallback } from "react"

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
  shape?: string
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

interface ShapeElement {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  color: string
  fillColor?: string
  strokeWidth: number
  region: string
}

interface WhiteboardState {
  strokes: DrawingStroke[]
  textElements: TextElement[]
  shapeElements: ShapeElement[]
  currentStroke: DrawingStroke | null
  tool: string
  color: string
  size: number
  opacity: number
  background: string
  zoom: number
  pan: { x: number; y: number }
  history: any[]
  historyIndex: number
  selectedRegion: string
  selectedTool: string
  isDrawingShape: boolean
  shapeStart: { x: number; y: number } | null
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
    
    // Fix canvas size and scaling issues
    const resizeCanvas = useCallback(() => {
      if (!ref || typeof ref === 'function') return
      const canvas = ref.current
      const container = containerRef.current
      if (!canvas || !container) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Get the actual container dimensions
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      // Set the actual canvas size in memory (scaled by device pixel ratio)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Scale the canvas back down using CSS
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'

      // Scale the drawing context so everything draws at the correct size
      ctx.scale(dpr, dpr)

      console.log("Canvas resized:", { 
        width: rect.width, 
        height: rect.height, 
        dpr,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height 
      })
    }, [ref, containerRef])

    // Canvas rendering with proper scaling
    useEffect(() => {
      if (!ref || typeof ref === 'function') return
      const canvas = ref.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Resize canvas first
      resizeCanvas()

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1))

      // Set background
      const canvasWidth = canvas.width / (window.devicePixelRatio || 1)
      const canvasHeight = canvas.height / (window.devicePixelRatio || 1)

      if (whiteboardState.background === "grid") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // Draw grid
        ctx.strokeStyle = "#e5e7eb"
        ctx.lineWidth = 1
        const gridSize = 20

        for (let x = 0; x <= canvasWidth; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvasHeight)
          ctx.stroke()
        }

        for (let y = 0; y <= canvasHeight; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvasWidth, y)
          ctx.stroke()
        }
      } else if (whiteboardState.background === "lines") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // Draw lines
        ctx.strokeStyle = "#e5e7eb"
        ctx.lineWidth = 1
        const lineSpacing = 30

        for (let y = lineSpacing; y <= canvasHeight; y += lineSpacing) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvasWidth, y)
          ctx.stroke()
        }
      } else {
        ctx.fillStyle = whiteboardState.background
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      }

      // Draw all strokes with proper scaling
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
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

        // Use quadratic curves for smoother lines
        for (let i = 1; i < stroke.points.length; i++) {
          const point = stroke.points[i]
          const prevPoint = stroke.points[i - 1]
          const midX = (prevPoint.x + point.x) / 2
          const midY = (prevPoint.y + point.y) / 2

          if (i === 1) {
            ctx.lineTo(midX, midY)
          } else {
            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY)
          }
        }

        // Draw the last point
        if (stroke.points.length > 1) {
          const lastPoint = stroke.points[stroke.points.length - 1]
          ctx.lineTo(lastPoint.x, lastPoint.y)
        }

        ctx.stroke()
      })

      // Draw shapes
      whiteboardState.shapeElements.forEach((shape) => {
        ctx.strokeStyle = shape.color
        ctx.lineWidth = shape.strokeWidth
        ctx.globalAlpha = 1

        if (shape.fillColor) {
          ctx.fillStyle = shape.fillColor
        }

        switch (shape.type) {
          case "rectangle":
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            if (shape.fillColor) {
              ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
            }
            break
          case "circle":
            ctx.beginPath()
            const radius = Math.min(shape.width, shape.height) / 2
            ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, radius, 0, 2 * Math.PI)
            ctx.stroke()
            if (shape.fillColor) {
              ctx.fill()
            }
            break
          case "triangle":
            ctx.beginPath()
            ctx.moveTo(shape.x + shape.width / 2, shape.y)
            ctx.lineTo(shape.x, shape.y + shape.height)
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
            ctx.closePath()
            ctx.stroke()
            if (shape.fillColor) {
              ctx.fill()
            }
            break
          case "line":
            ctx.beginPath()
            ctx.moveTo(shape.x, shape.y)
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
            ctx.stroke()
            break
          case "arrow":
            // Draw arrow line
            ctx.beginPath()
            ctx.moveTo(shape.x, shape.y)
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
            ctx.stroke()
            
            // Draw arrowhead
            const angle = Math.atan2(shape.height, shape.width)
            const headLength = 15
            ctx.beginPath()
            ctx.moveTo(shape.x + shape.width, shape.y + shape.height)
            ctx.lineTo(
              shape.x + shape.width - headLength * Math.cos(angle - Math.PI / 6),
              shape.y + shape.height - headLength * Math.sin(angle - Math.PI / 6)
            )
            ctx.moveTo(shape.x + shape.width, shape.y + shape.height)
            ctx.lineTo(
              shape.x + shape.width - headLength * Math.cos(angle + Math.PI / 6),
              shape.y + shape.height - headLength * Math.sin(angle + Math.PI / 6)
            )
            ctx.stroke()
            break
        }
      })

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
    }, [whiteboardState, ref, containerRef, resizeCanvas])

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        resizeCanvas()
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [resizeCanvas])

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
  }
)

DrawingCanvas.displayName = "DrawingCanvas"
