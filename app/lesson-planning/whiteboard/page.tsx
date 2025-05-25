"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Pen,
  Highlighter,
  Eraser,
  Square,
  Circle,
  Triangle,
  ArrowRight,
  Minus,
  Grid3X3,
  Maximize,
  Minimize,
  Type,
  Trash2,
  Presentation,
} from "lucide-react"
import { DrawingCanvas } from "@/components/DrawingCanvas"
import { AIAssistant } from "@/components/AIassistant"
import { TextRegion } from "@/components/TextRegion"
import { CollaborationPanel } from "@/components/CollaborationPanel"
import { WhiteboardToolbar } from "@/components/WhiteboardToolbar"
import { PPTViewer } from "@/components/PPTViewer"

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

export default function AIWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [whiteboardState, setWhiteboardState] = useState<WhiteboardState>({
    strokes: [],
    textElements: [],
    currentStroke: null,
    tool: "pen",
    color: "#000000",
    size: 3,
    opacity: 1,
    background: "white",
    zoom: 1,
    pan: { x: 0, y: 0 },
    history: [[]],
    historyIndex: 0,
    selectedRegion: "main",
  })

  // UI State
  const [showToolbar, setShowToolbar] = useState(true)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [selectedTextElement, setSelectedTextElement] = useState<string | null>(null)
  const [showPPTViewer, setShowPPTViewer] = useState(false)
  const [regions] = useState([
    { id: "main", name: "Main Board", x: 0, y: 0, width: 70, height: 100 },
    { id: "notes", name: "Notes", x: 70, y: 0, width: 30, height: 50 },
    { id: "formulas", name: "Formulas", x: 70, y: 50, width: 30, height: 25 },
    { id: "scratch", name: "Scratch Pad", x: 70, y: 75, width: 30, height: 25 },
  ])

  const { toast } = useToast()

  // Enhanced coordinate calculation for accurate drawing
  const getCanvasCoordinates = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    if (!canvasRef.current || !containerRef.current) return { x: 0, y: 0 }

    const canvas = canvasRef.current
    const container = containerRef.current

    // Get the actual canvas and container rectangles
    const canvasRect = canvas.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // Calculate coordinates relative to the canvas
    const x = ((e.clientX - canvasRect.left) / canvasRect.width) * canvas.width
    const y = ((e.clientY - canvasRect.top) / canvasRect.height) * canvas.height

    return { x, y }
  }, [])

  // Determine which region a point belongs to
  const getRegionFromPoint = useCallback(
    (x: number, y: number) => {
      if (!canvasRef.current) return "main"

      const canvas = canvasRef.current
      const relativeX = (x / canvas.width) * 100
      const relativeY = (y / canvas.height) * 100

      for (const region of regions) {
        if (
          relativeX >= region.x &&
          relativeX <= region.x + region.width &&
          relativeY >= region.y &&
          relativeY <= region.y + region.height
        ) {
          return region.id
        }
      }
      return "main"
    },
    [regions],
  )

  // Save state to history for undo/redo
  const saveToHistory = useCallback(() => {
    setWhiteboardState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1)
      newHistory.push([...prev.strokes])
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  }, [])

  // Enhanced Drawing Functions with accurate coordinates
  const startDrawing = useCallback(
    (e: React.PointerEvent) => {
      if (!canvasRef.current) return

      e.preventDefault()
      const { x, y } = getCanvasCoordinates(e)
      const region = getRegionFromPoint(x, y)

      if (whiteboardState.tool === "text") {
        // Create new text element
        const newTextElement: TextElement = {
          id: Date.now().toString(),
          x,
          y,
          width: 200,
          height: 30,
          text: "",
          fontSize: 16,
          color: whiteboardState.color,
          region,
        }

        setWhiteboardState((prev) => ({
          ...prev,
          textElements: [...prev.textElements, newTextElement],
        }))
        setSelectedTextElement(newTextElement.id)
        return
      }

      if (whiteboardState.tool === "eraser") {
        // For eraser, find and remove strokes at this point
        const strokeToRemove = whiteboardState.strokes.find((stroke) =>
          stroke.points.some(
            (point) =>
              Math.abs(point.x - x) < whiteboardState.size * 3 && Math.abs(point.y - y) < whiteboardState.size * 3,
          ),
        )

        if (strokeToRemove) {
          setWhiteboardState((prev) => ({
            ...prev,
            strokes: prev.strokes.filter((stroke) => stroke.id !== strokeToRemove.id),
          }))
          saveToHistory()
        }
        return
      }

      const newStroke: DrawingStroke = {
        id: Date.now().toString(),
        points: [{ x, y, pressure: e.pressure || 0.5, timestamp: Date.now() }],
        tool: whiteboardState.tool,
        color: whiteboardState.color,
        size: whiteboardState.size,
        opacity: whiteboardState.tool === "highlighter" ? 0.3 : whiteboardState.opacity,
        region,
      }

      setWhiteboardState((prev) => ({ ...prev, currentStroke: newStroke }))
      setIsDrawing(true)
    },
    [whiteboardState, getCanvasCoordinates, getRegionFromPoint, saveToHistory],
  )

  const draw = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing || !whiteboardState.currentStroke || !canvasRef.current) return

      e.preventDefault()
      const { x, y } = getCanvasCoordinates(e)

      const newPoint: DrawingPoint = {
        x,
        y,
        pressure: e.pressure || 0.5,
        timestamp: Date.now(),
      }

      setWhiteboardState((prev) => ({
        ...prev,
        currentStroke: prev.currentStroke
          ? { ...prev.currentStroke, points: [...prev.currentStroke.points, newPoint] }
          : null,
      }))
    },
    [isDrawing, whiteboardState.currentStroke, getCanvasCoordinates],
  )

  const stopDrawing = useCallback(() => {
    if (whiteboardState.currentStroke && whiteboardState.currentStroke.points.length > 0) {
      setWhiteboardState((prev) => ({
        ...prev,
        strokes: [...prev.strokes, prev.currentStroke!],
        currentStroke: null,
      }))
      saveToHistory()
    }
    setIsDrawing(false)
  }, [whiteboardState.currentStroke, saveToHistory])

  // Undo/Redo Functions
  const undo = useCallback(() => {
    setWhiteboardState((prev) => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1
        return {
          ...prev,
          strokes: [...(prev.history[newIndex] as DrawingStroke[])],
          historyIndex: newIndex,
          currentStroke: null,
        }
      }
      return prev
    })
  }, [])

  const redo = useCallback(() => {
    setWhiteboardState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1
        return {
          ...prev,
          strokes: [...(prev.history[newIndex] as DrawingStroke[])],
          historyIndex: newIndex,
          currentStroke: null,
        }
      }
      return prev
    })
  }, [])

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setWhiteboardState((prev) => ({
      ...prev,
      strokes: [],
      textElements: [],
      currentStroke: null,
    }))
    saveToHistory()
    toast({
      title: "Canvas Cleared",
      description: "All content has been removed from the whiteboard",
    })
  }, [saveToHistory, toast])

  // Zoom functions
  const zoomIn = useCallback(() => {
    setWhiteboardState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 5),
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setWhiteboardState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.1),
    }))
  }, [])

  const resetZoom = useCallback(() => {
    setWhiteboardState((prev) => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 },
    }))
  }, [])

  // Export whiteboard data for AI analysis
  const exportWhiteboardData = useCallback(() => {
    return {
      strokes: whiteboardState.strokes,
      textElements: whiteboardState.textElements,
      regions: regions.map((region) => ({
        ...region,
        strokeCount: whiteboardState.strokes.filter((s) => s.region === region.id).length,
        textCount: whiteboardState.textElements.filter((t) => t.region === region.id).length,
      })),
      metadata: {
        totalStrokes: whiteboardState.strokes.length,
        totalTexts: whiteboardState.textElements.length,
        background: whiteboardState.background,
        zoom: whiteboardState.zoom,
      },
    }
  }, [whiteboardState, regions])

  // Save/Export functions
  const saveAsImage = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = `whiteboard-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Image Saved",
      description: "Whiteboard exported as PNG image",
    })
  }

  const tools = [
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "highlighter", icon: Highlighter, label: "Highlighter" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "text", icon: Type, label: "Text" },
  ]

  const shapes = [
    { id: "line", icon: Minus, label: "Line" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
  ]

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#8B4513",
    "#808080",
    "#000080",
    "#008000",
    "#800000",
  ]

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Top Toolbar */}
      <WhiteboardToolbar
        whiteboardState={whiteboardState}
        setWhiteboardState={setWhiteboardState}
        tools={tools}
        shapes={shapes}
        colors={colors}
        showToolbar={showToolbar}
        setShowToolbar={setShowToolbar}
        undo={undo}
        redo={redo}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        clearCanvas={clearCanvas}
        saveAsImage={saveAsImage}
        isCollaborating={isCollaborating}
        setIsCollaborating={setIsCollaborating}
        showAiPanel={showAiPanel}
        setShowAiPanel={setShowAiPanel}
        exportWhiteboardData={exportWhiteboardData}
        regions={regions}
        showPPTViewer={showPPTViewer}
        setShowPPTViewer={setShowPPTViewer}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex relative min-h-0">
        {/* Collaboration Panel */}
        <CollaborationPanel isCollaborating={isCollaborating} setShowAiPanel={setShowAiPanel} />

        {/* Canvas Container */}
        <div className="flex-1 relative overflow-hidden min-w-0">
          <DrawingCanvas
            ref={canvasRef}
            containerRef={containerRef}
            whiteboardState={whiteboardState}
            regions={regions}
            isDrawing={isDrawing}
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
          />

          {/* Text Elements Overlay */}
          {whiteboardState.textElements.map((textElement) => (
            <TextRegion
              key={textElement.id}
              textElement={textElement}
              isSelected={selectedTextElement === textElement.id}
              onSelect={() => setSelectedTextElement(textElement.id)}
              onUpdate={(updates) => {
                setWhiteboardState((prev) => ({
                  ...prev,
                  textElements: prev.textElements.map((el) => (el.id === textElement.id ? { ...el, ...updates } : el)),
                }))
              }}
              onDelete={() => {
                setWhiteboardState((prev) => ({
                  ...prev,
                  textElements: prev.textElements.filter((el) => el.id !== textElement.id),
                }))
                setSelectedTextElement(null)
              }}
            />
          ))}

          {/* Region Indicators */}
          <div className="absolute inset-0 pointer-events-none">
            {regions.map((region) => (
              <div
                key={region.id}
                className={`absolute border-2 border-dashed transition-colors ${
                  whiteboardState.selectedRegion === region.id ? "border-blue-500 bg-blue-50/20" : "border-gray-300/50"
                }`}
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                }}
              >
                <div className="absolute top-2 left-2 bg-gray-950/90 px-2 py-1 rounded text-xs font-medium">
                  {region.name}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Mini Toolbar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-950 dark:bg-gray-800 rounded-full shadow-lg border p-2 flex items-center gap-2 z-20"
          >
            <Button variant="ghost" size="sm" onClick={() => setShowToolbar(!showToolbar)} className="h-8 w-8 p-0">
              {showToolbar ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                setWhiteboardState((prev) => ({
                  ...prev,
                  background: prev.background === "grid" ? "white" : "grid",
                }))
              }
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowPPTViewer(true)}
              title="Open Presentation"
            >
              <Presentation className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={clearCanvas}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* AI Assistant Panel */}
        <AIAssistant
          showAiPanel={showAiPanel}
          setShowAiPanel={setShowAiPanel}
          exportWhiteboardData={exportWhiteboardData}
        />
      </div>

      {/* PPT Viewer */}
      <PPTViewer
        isVisible={showPPTViewer}
        onClose={() => setShowPPTViewer(false)}
        onSlideChange={(slide) => {
          // Optional: Add slide content to whiteboard as text
          console.log("Slide changed:", slide)
        }}
      />

      {/* Status Bar */}
      <div className="bg-gray-950/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span>Strokes: {whiteboardState.strokes.length}</span>
          <span>Texts: {whiteboardState.textElements.length}</span>
          <span>Tool: {whiteboardState.tool}</span>
          <span>Region: {regions.find((r) => r.id === whiteboardState.selectedRegion)?.name || "Main"}</span>
          <span>Zoom: {Math.round(whiteboardState.zoom * 100)}%</span>
        </div>

        <div className="flex items-center gap-4">
          {isCollaborating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Live
            </Badge>
          )}
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}
