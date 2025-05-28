
"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Pen,
  Highlighter,
  Eraser,
  Undo,
  Redo,
  Square,
  Circle,
  Triangle,
  ArrowRight,
  Minus,
  Grid3X3,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  Sparkles,
  Eye,
  Camera,
  Maximize,
  Minimize,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Type,
  Brain,
  Lightbulb,
  Calculator,
  BookOpen,
  HelpCircle,
  Trash2,
  Download,
  Presentation,
  Move,
  MousePointer,
  Shapes,
  Palette,
  Settings,
  Save,
  FolderOpen,
  Star,
  Heart,
  Hexagon,
  Pentagon,
  Diamond,
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
  fontFamily?: string
  isBold?: boolean
  isItalic?: boolean
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

export default function AIWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [whiteboardState, setWhiteboardState] = useState<WhiteboardState>({
    strokes: [],
    textElements: [],
    shapeElements: [],
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
    selectedTool: "pen",
    isDrawingShape: false,
    shapeStart: null,
  })

  // UI State
  const [showToolbar, setShowToolbar] = useState(true)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [selectedTextElement, setSelectedTextElement] = useState<string | null>(null)
  const [showPPTViewer, setShowPPTViewer] = useState(false)
  const [showShapePanel, setShowShapePanel] = useState(false)
  const [regions] = useState([
    { id: "main", name: "Main Board", x: 0, y: 0, width: 70, height: 100 },
    { id: "notes", name: "Notes", x: 70, y: 0, width: 30, height: 50 },
    { id: "formulas", name: "Formulas", x: 70, y: 50, width: 30, height: 25 },
    { id: "scratch", name: "Scratch Pad", x: 70, y: 75, width: 30, height: 25 },
  ])

  const { toast } = useToast()

  // Fixed coordinate calculation with proper canvas bounds
  const getCanvasCoordinates = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    if (!canvasRef.current || !containerRef.current) return { x: 0, y: 0 }

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    // Get the actual mouse position relative to the canvas element
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    console.log("Mouse coordinates:", { 
      clientX: e.clientX, 
      clientY: e.clientY, 
      rectLeft: rect.left, 
      rectTop: rect.top, 
      calculatedX: x, 
      calculatedY: y,
      canvasWidth: rect.width,
      canvasHeight: rect.height
    })

    return { x, y }
  }, [])

  // Determine which region a point belongs to
  const getRegionFromPoint = useCallback((x: number, y: number) => {
    const canvasWidth = canvasRef.current?.getBoundingClientRect().width || 1
    const canvasHeight = canvasRef.current?.getBoundingClientRect().height || 1
    
    const relativeX = (x / canvasWidth) * 100
    const relativeY = (y / canvasHeight) * 100

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
  }, [regions])

  // Save state to history for undo/redo
  const saveToHistory = useCallback(() => {
    setWhiteboardState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1)
      newHistory.push({
        strokes: [...prev.strokes],
        textElements: [...prev.textElements],
        shapeElements: [...prev.shapeElements],
      })
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  }, [])

  // Drawing Functions with fixed coordinates
  const startDrawing = useCallback(
    (e: React.PointerEvent) => {
      if (!canvasRef.current) return

      const { x, y } = getCanvasCoordinates(e)
      const region = getRegionFromPoint(x, y)

      console.log("Starting drawing at:", { x, y, region, tool: whiteboardState.tool })

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
          fontFamily: "Inter",
          isBold: false,
          isItalic: false,
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
              Math.abs(point.x - x) < whiteboardState.size * 2 && Math.abs(point.y - y) < whiteboardState.size * 2,
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

      // Handle shape drawing
      const shapeTools = ["rectangle", "circle", "triangle", "arrow", "line", "diamond", "hexagon", "pentagon", "star", "heart"]
      if (shapeTools.includes(whiteboardState.tool)) {
        setWhiteboardState((prev) => ({
          ...prev,
          isDrawingShape: true,
          shapeStart: { x, y },
        }))
        setIsDrawing(true)
        return
      }

      // Regular pen/highlighter drawing
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
      if (!isDrawing || !canvasRef.current) return

      const { x, y } = getCanvasCoordinates(e)

      // Handle shape drawing
      if (whiteboardState.isDrawingShape && whiteboardState.shapeStart) {
        // Shape preview will be handled in the canvas rendering
        return
      }

      // Regular drawing
      if (!whiteboardState.currentStroke) return

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
    [isDrawing, whiteboardState.currentStroke, whiteboardState.isDrawingShape, whiteboardState.shapeStart, getCanvasCoordinates],
  )

  const stopDrawing = useCallback((e?: React.PointerEvent) => {
    if (whiteboardState.isDrawingShape && whiteboardState.shapeStart && e) {
      // Complete shape drawing
      const { x: endX, y: endY } = getCanvasCoordinates(e)

      const newShape: ShapeElement = {
        id: Date.now().toString(),
        type: whiteboardState.tool,
        x: Math.min(whiteboardState.shapeStart.x, endX),
        y: Math.min(whiteboardState.shapeStart.y, endY),
        width: Math.abs(endX - whiteboardState.shapeStart.x),
        height: Math.abs(endY - whiteboardState.shapeStart.y),
        color: whiteboardState.color,
        strokeWidth: whiteboardState.size,
        region: getRegionFromPoint(whiteboardState.shapeStart.x, whiteboardState.shapeStart.y),
      }

      setWhiteboardState((prev) => ({
        ...prev,
        shapeElements: [...prev.shapeElements, newShape],
        isDrawingShape: false,
        shapeStart: null,
      }))
      saveToHistory()
    } else if (whiteboardState.currentStroke && whiteboardState.currentStroke.points.length > 0) {
      setWhiteboardState((prev) => ({
        ...prev,
        strokes: [...prev.strokes, prev.currentStroke!],
        currentStroke: null,
      }))
      saveToHistory()
    }
    setIsDrawing(false)
  }, [whiteboardState.currentStroke, whiteboardState.isDrawingShape, whiteboardState.shapeStart, whiteboardState.tool, whiteboardState.color, whiteboardState.size, saveToHistory, getCanvasCoordinates, getRegionFromPoint])

  // ... keep existing code (undo, redo, clearCanvas, zoom functions, exportWhiteboardData, tools, shapes, colors arrays)

  // Undo/Redo Functions
  const undo = useCallback(() => {
    setWhiteboardState((prev) => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1
        const historyState = prev.history[newIndex]
        return {
          ...prev,
          strokes: [...(historyState.strokes || [])],
          textElements: [...(historyState.textElements || [])],
          shapeElements: [...(historyState.shapeElements || [])],
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
        const historyState = prev.history[newIndex]
        return {
          ...prev,
          strokes: [...(historyState.strokes || [])],
          textElements: [...(historyState.textElements || [])],
          shapeElements: [...(historyState.shapeElements || [])],
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
      shapeElements: [],
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
      shapeElements: whiteboardState.shapeElements,
      regions: regions.map(region => ({
        ...region,
        strokeCount: whiteboardState.strokes.filter(s => s.region === region.id).length,
        textCount: whiteboardState.textElements.filter(t => t.region === region.id).length,
        shapeCount: whiteboardState.shapeElements.filter(s => s.region === region.id).length,
      })),
      metadata: {
        totalStrokes: whiteboardState.strokes.length,
        totalTexts: whiteboardState.textElements.length,
        totalShapes: whiteboardState.shapeElements.length,
        background: whiteboardState.background,
        zoom: whiteboardState.zoom,
      }
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
    { id: "select", icon: MousePointer, label: "Select" },
  ]

  const shapes = [
    { id: "line", icon: Minus, label: "Line" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "diamond", icon: Diamond, label: "Diamond" },
    { id: "hexagon", icon: Hexagon, label: "Hexagon" },
    { id: "pentagon", icon: Pentagon, label: "Pentagon" },
    { id: "star", icon: Star, label: "Star" },
    { id: "heart", icon: Heart, label: "Heart" },
  ]

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB",
    "#8B4513", "#808080", "#000080", "#008000", "#800000",
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57",
    "#FF9FF3", "#54A0FF", "#5F27CD", "#00D2D3", "#FF9F43",
  ]

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Enhanced Top Toolbar */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {/* Tool Selection */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={whiteboardState.tool === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setWhiteboardState(prev => ({ ...prev, tool: tool.id }))}
                className="h-8 w-8 p-0"
                title={tool.label}
              >
                <tool.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Shape Tools */}
          <div className="flex items-center gap-1">
            <Button
              variant={showShapePanel ? "default" : "outline"}
              size="sm"
              onClick={() => setShowShapePanel(!showShapePanel)}
              className="h-8"
            >
              <Shapes className="h-4 w-4 mr-1" />
              Shapes
            </Button>
            
            {showShapePanel && (
              <div className="absolute top-12 left-0 z-50 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-2">
                <div className="grid grid-cols-5 gap-1">
                  {shapes.map((shape) => (
                    <Button
                      key={shape.id}
                      variant={whiteboardState.tool === shape.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setWhiteboardState(prev => ({ ...prev, tool: shape.id }))
                        setShowShapePanel(false)
                      }}
                      className="h-8 w-8 p-0"
                      title={shape.label}
                    >
                      <shape.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Enhanced Color Palette */}
          <div className="flex items-center gap-1">
            <div 
              className="w-6 h-6 rounded border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: whiteboardState.color }}
              title="Current Color"
            />
            <div className="flex gap-1">
              {colors.slice(0, 10).map((color) => (
                <button
                  key={color}
                  className="w-4 h-4 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setWhiteboardState(prev => ({ ...prev, color }))}
                  title={color}
                />
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Size Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Size:</span>
            <Input
              type="range"
              min="1"
              max="20"
              value={whiteboardState.size}
              onChange={(e) => setWhiteboardState(prev => ({ ...prev, size: parseInt(e.target.value) }))}
              className="w-20 h-6"
            />
            <span className="text-sm text-gray-600 w-6">{whiteboardState.size}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* History Controls */}
          <Button variant="outline" size="sm" onClick={undo} className="h-8 w-8 p-0" title="Undo">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} className="h-8 w-8 p-0" title="Redo">
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Zoom Controls */}
          <Button variant="outline" size="sm" onClick={zoomOut} className="h-8 w-8 p-0" title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[50px] text-center">
            {Math.round(whiteboardState.zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={zoomIn} className="h-8 w-8 p-0" title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetZoom} className="h-8 w-8 p-0" title="Reset Zoom">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Action Buttons */}
          <Button variant="outline" size="sm" onClick={clearCanvas} className="h-8">
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={saveAsImage} className="h-8">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAiPanel(true)} className="h-8">
            <Brain className="h-4 w-4 mr-1" />
            AI Assistant
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Collaboration Panel */}
        <CollaborationPanel 
          isCollaborating={isCollaborating}
          setShowAiPanel={setShowAiPanel}
        />

        {/* Canvas Container */}
        <div className="flex-1 relative overflow-hidden">
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
                  textElements: prev.textElements.map((el) =>
                    el.id === textElement.id ? { ...el, ...updates } : el
                  ),
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
                  whiteboardState.selectedRegion === region.id
                    ? "border-blue-500 bg-blue-50/20"
                    : "border-gray-300/50"
                }`}
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                }}
              >
                <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                  {region.name}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Mini Toolbar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg border p-2 flex flex-col items-center gap-2 z-20"
          >
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
              title="Toggle Grid"
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

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setIsCollaborating(!isCollaborating)}
              title="Toggle Collaboration"
            >
              <Users className="h-4 w-4" />
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
          console.log("Slide changed:", slide)
        }}
      />

      {/* Enhanced Status Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Strokes: {whiteboardState.strokes.length}</span>
          <span>Texts: {whiteboardState.textElements.length}</span>
          <span>Shapes: {whiteboardState.shapeElements.length}</span>
          <span>Tool: {whiteboardState.tool}</span>
          <span>Region: {regions.find(r => r.id === whiteboardState.selectedRegion)?.name || "Main"}</span>
          <span>Zoom: {Math.round(whiteboardState.zoom * 100)}%</span>
        </div>

        <div className="flex items-center gap-4">
          {isCollaborating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </Badge>
          )}
          <span>Ready for Teaching</span>
        </div>
      </div>
    </div>
  )
}
