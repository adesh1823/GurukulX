"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Undo,
  Redo,
  Square,
  Users,
  Brain,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Presentation,
} from "lucide-react"
import { GradientText } from "./ui/gradient-text"

interface Tool {
  id: string
  icon: any
  label: string
}

interface WhiteboardToolbarProps {
  whiteboardState: any
  setWhiteboardState: (state: any) => void
  tools: Tool[]
  shapes: Tool[]
  colors: string[]
  showToolbar: boolean
  setShowToolbar: (show: boolean) => void
  undo: () => void
  redo: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  clearCanvas: () => void
  saveAsImage: () => void
  isCollaborating: boolean
  setIsCollaborating: (collaborating: boolean) => void
  showAiPanel: boolean
  setShowAiPanel: (show: boolean) => void
  exportWhiteboardData: () => any
  regions: any[]
  showPPTViewer: boolean
  setShowPPTViewer: (show: boolean) => void
}

export function WhiteboardToolbar({
  whiteboardState,
  setWhiteboardState,
  tools,
  shapes,
  colors,
  showToolbar,
  setShowToolbar,
  undo,
  redo,
  zoomIn,
  zoomOut,
  resetZoom,
  clearCanvas,
  saveAsImage,
  isCollaborating,
  setIsCollaborating,
  showAiPanel,
  setShowAiPanel,
  exportWhiteboardData,
  regions,
  showPPTViewer,
  setShowPPTViewer,
}: WhiteboardToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showShapeTools, setShowShapeTools] = useState(false)

  return (
    <AnimatePresence>
      {showToolbar && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 shadow-lg z-40"
        >
          <div className="flex items-center justify-between">
            {/* Left Section - Drawing Tools */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={whiteboardState.tool === tool.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setWhiteboardState((prev: any) => ({ ...prev, tool: tool.id }))}
                    className="h-8 w-8 p-0"
                    title={tool.label}
                  >
                    <tool.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Shape Tools */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShapeTools(!showShapeTools)}
                  className="h-8 w-8 p-0"
                  title="Shapes"
                >
                  <Square className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {showShapeTools && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-10 left-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-2 z-50"
                    >
                      <div className="grid grid-cols-3 gap-1">
                        {shapes.map((shape) => (
                          <Button
                            key={shape.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setWhiteboardState((prev: any) => ({ ...prev, tool: shape.id }))
                              setShowShapeTools(false)
                            }}
                            className="h-8 w-8 p-0"
                            title={shape.label}
                          >
                            <shape.icon className="h-4 w-4" />
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Color Picker */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="h-8 w-8 p-0"
                  title="Colors"
                >
                  <div
                    className="w-4 h-4 rounded border-2 border-gray-300"
                    style={{ backgroundColor: whiteboardState.color }}
                  />
                </Button>

                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-10 left-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-3 z-50"
                    >
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {colors.map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setWhiteboardState((prev: any) => ({ ...prev, color }))
                              setShowColorPicker(false)
                            }}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        value={whiteboardState.color}
                        onChange={(e) => setWhiteboardState((prev: any) => ({ ...prev, color: e.target.value }))}
                        className="w-full h-8"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
                <Input
                  type="range"
                  min="1"
                  max="20"
                  value={whiteboardState.size}
                  onChange={(e) =>
                    setWhiteboardState((prev: any) => ({ ...prev, size: Number.parseInt(e.target.value) }))
                  }
                  className="w-20"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-6">{whiteboardState.size}</span>
              </div>

              {/* Background */}
              <Select
                value={whiteboardState.background}
                onValueChange={(value) => setWhiteboardState((prev: any) => ({ ...prev, background: value }))}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="lines">Lines</SelectItem>
                  <SelectItem value="#000000">Black</SelectItem>
                </SelectContent>
              </Select>

              {/* Region Selector */}
              <Select
                value={whiteboardState.selectedRegion}
                onValueChange={(value) => setWhiteboardState((prev: any) => ({ ...prev, selectedRegion: value }))}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Center Section - Title */}
            <div className="text-center">
              <h1 className="text-xl font-bold">
                <GradientText> GX Studio </GradientText>
              </h1>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={undo}
                disabled={whiteboardState.historyIndex <= 0}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={redo}
                disabled={whiteboardState.historyIndex >= whiteboardState.history.length - 1}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-8" />

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={zoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-12 text-center">
                {Math.round(whiteboardState.zoom * 100)}%
              </span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={zoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={resetZoom} title="Reset Zoom">
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-8" />

              <Button
                variant={isCollaborating ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsCollaborating(!isCollaborating)}
                className="h-8 w-8 p-0"
                title="Collaboration"
              >
                <Users className="h-4 w-4" />
              </Button>

              <Button
                variant={showAiPanel ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="h-8 w-8 p-0"
                title="AI Assistant"
              >
                <Brain className="h-4 w-4" />
              </Button>

              <Button
                variant={showPPTViewer ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowPPTViewer(!showPPTViewer)}
                className="h-8 w-8 p-0"
                title="Presentation Viewer"
              >
                <Presentation className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={saveAsImage} title="Save Image">
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={clearCanvas} title="Clear All">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
