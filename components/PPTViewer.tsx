"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  FileText,
  Presentation,
  Grid3X3,
  Maximize2,
  Minimize2,
  Copy,
  Pen,
  Highlighter,
  Eraser,
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Sparkles,
} from "lucide-react"

interface PPTSlide {
  id: string
  content: string
  imageUrl?: string
  notes?: string
  createdAt: number
  annotations?: DrawingStroke[]
}

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
}

interface PPTViewerProps {
  isVisible: boolean
  onClose: () => void
  onSlideChange?: (slide: PPTSlide) => void
}

interface AIMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: number
}

export function PPTViewer({ isVisible, onClose, onSlideChange }: PPTViewerProps) {
  const [slides, setSlides] = useState<PPTSlide[]>([
    {
      id: "1",
      content: "Welcome to AI Whiteboard\n\nYour intelligent teaching companion",
      createdAt: Date.now(),
      annotations: [],
    },
    {
      id: "2",
      content: "Features:\n• Interactive whiteboard\n• AI assistance\n• Voice interaction\n• Live collaboration",
      createdAt: Date.now(),
      annotations: [],
    },
  ])

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isGridView, setIsGridView] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<string | null>(null)
  const [slideContent, setSlideContent] = useState("")

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingTool, setDrawingTool] = useState("pen")
  const [drawingColor, setDrawingColor] = useState("#FF0000")
  const [drawingSize, setDrawingSize] = useState(3)
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null)
  const [showDrawingTools, setShowDrawingTools] = useState(false)

  // AI features - Enhanced state management
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I'm your AI presentation assistant. I can help analyze slides, suggest improvements, and answer questions about your content. How can I assist you today?",
      timestamp: Date.now(),
    },
  ])
  const [aiInput, setAiInput] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [aiMode, setAiMode] = useState("general")

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const slideContentRef = useRef<HTMLDivElement>(null)
  const aiMessagesEndRef = useRef<HTMLDivElement>(null)
  const aiInputRef = useRef<HTMLTextAreaElement>(null)

  const { toast } = useToast()

  const currentSlide = slides[currentSlideIndex]

  const aiModes = [
    { id: "general", label: "General Help", icon: Brain },
    { id: "lesson_suggestion", label: "Lesson Ideas", icon: Sparkles },
    { id: "content_help", label: "Content Help", icon: FileText },
    { id: "doubt_solving", label: "Solve Doubts", icon: Brain },
  ]

  // Auto-scroll AI messages to bottom
  useEffect(() => {
    if (aiMessagesEndRef.current) {
      aiMessagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [aiMessages])

  // Canvas drawing functions
  const getCanvasCoordinates = useCallback((e: React.PointerEvent) => {
    if (!canvasRef.current || !slideContentRef.current) return { x: 0, y: 0 }

    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()

    const x = ((e.clientX - canvasRect.left) / canvasRect.width) * canvas.width
    const y = ((e.clientY - canvasRect.top) / canvasRect.height) * canvas.height

    return { x, y }
  }, [])

  const startDrawing = useCallback(
    (e: React.PointerEvent) => {
      if (!showDrawingTools) return

      const { x, y } = getCanvasCoordinates(e)

      if (drawingTool === "eraser") {
        const currentAnnotations = currentSlide?.annotations || []
        const strokeToRemove = currentAnnotations.find((stroke) =>
          stroke.points.some(
            (point) => Math.abs(point.x - x) < drawingSize * 2 && Math.abs(point.y - y) < drawingSize * 2,
          ),
        )

        if (strokeToRemove) {
          setSlides(
            slides.map((slide) =>
              slide.id === currentSlide?.id
                ? { ...slide, annotations: currentAnnotations.filter((s) => s.id !== strokeToRemove.id) }
                : slide,
            ),
          )
        }
        return
      }

      const newStroke: DrawingStroke = {
        id: Date.now().toString(),
        points: [{ x, y, pressure: e.pressure || 0.5, timestamp: Date.now() }],
        tool: drawingTool,
        color: drawingColor,
        size: drawingSize,
        opacity: drawingTool === "highlighter" ? 0.3 : 1,
      }

      setCurrentStroke(newStroke)
      setIsDrawing(true)
    },
    [showDrawingTools, drawingTool, drawingColor, drawingSize, currentSlide, slides, getCanvasCoordinates],
  )

  const draw = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing || !currentStroke) return

      const { x, y } = getCanvasCoordinates(e)
      const newPoint: DrawingPoint = {
        x,
        y,
        pressure: e.pressure || 0.5,
        timestamp: Date.now(),
      }

      setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, newPoint],
      })
    },
    [isDrawing, currentStroke, getCanvasCoordinates],
  )

  const stopDrawing = useCallback(() => {
    if (currentStroke && currentStroke.points.length > 0) {
      setSlides(
        slides.map((slide) =>
          slide.id === currentSlide?.id
            ? { ...slide, annotations: [...(slide.annotations || []), currentStroke] }
            : slide,
        ),
      )
    }
    setCurrentStroke(null)
    setIsDrawing(false)
  }, [currentStroke, currentSlide, slides])

  // Render canvas annotations
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !slideContentRef.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const slideRect = slideContentRef.current.getBoundingClientRect()
    canvas.width = slideRect.width * window.devicePixelRatio
    canvas.height = slideRect.height * window.devicePixelRatio
    canvas.style.width = `${slideRect.width}px`
    canvas.style.height = `${slideRect.height}px`
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const allStrokes = currentStroke
      ? [...(currentSlide?.annotations || []), currentStroke]
      : currentSlide?.annotations || []

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

      if (stroke.points.length > 1) {
        const lastPoint = stroke.points[stroke.points.length - 1]
        ctx.lineTo(lastPoint.x, lastPoint.y)
      }

      ctx.stroke()
    })

    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = "source-over"
  }, [currentSlide, currentStroke])

  // Enhanced AI Functions with better error handling and state management
  const sendAiMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: aiInput,
      timestamp: Date.now(),
    }

    setAiMessages((prev) => [...prev, userMessage])
    const currentInput = aiInput
    setAiInput("")
    setIsAiLoading(true)

    // Clear input immediately and focus back
    if (aiInputRef.current) {
      aiInputRef.current.value = ""
      aiInputRef.current.focus()
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/whiteboard/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          context: `Current slide: "${currentSlide?.content || ""}"`,
          type: aiMode,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response || "I couldn't process your request. Please try again.",
        timestamp: Date.now(),
      }

      setAiMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI Error:", error)

      let errorContent = "I'm experiencing technical difficulties. Please try again."
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorContent = "Request timed out. Please try again with a shorter message."
        } else if (error.message.includes("fetch")) {
          errorContent = "Network error. Please check your connection and try again."
        }
      }

      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: errorContent,
        timestamp: Date.now(),
      }
      setAiMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAiLoading(false)
      // Re-focus input after response
      setTimeout(() => {
        if (aiInputRef.current) {
          aiInputRef.current.focus()
        }
      }, 100)
    }
  }

  // Enhanced voice recording with better cleanup
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.wav")

        try {
          const response = await fetch("/api/whiteboard/stt", {
            method: "POST",
            body: formData,
          })

          const data = await response.json()
          if (data.text) {
            setAiInput(data.text)
            if (aiInputRef.current) {
              aiInputRef.current.value = data.text
              aiInputRef.current.focus()
            }
          }
        } catch (error) {
          console.error("Speech-to-text error:", error)
          toast({
            title: "Voice Recognition Error",
            description: "Could not convert speech to text",
            variant: "destructive",
          })
        }

        // Cleanup stream
        stream.getTracks().forEach((track) => track.stop())
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop()
          setIsRecording(false)
        }
      }, 30000)
    } catch (error) {
      console.error("Microphone error:", error)
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      })
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  // Enhanced text-to-speech with better error handling
  const speakText = async (text: string) => {
    if (isSpeaking) {
      // Stop current speech
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    try {
      setIsSpeaking(true)

      // Try API first, fallback to browser TTS
      try {
        const response = await fetch("/api/whiteboard/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })

        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)

          audio.onended = () => {
            setIsSpeaking(false)
            URL.revokeObjectURL(audioUrl)
          }

          audio.onerror = () => {
            setIsSpeaking(false)
            URL.revokeObjectURL(audioUrl)
          }

          await audio.play()
          return
        }
      } catch (apiError) {
        console.log("TTS API failed, falling back to browser TTS")
      }

      // Fallback to browser's built-in speech synthesis
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        speechSynthesis.speak(utterance)
      } else {
        setIsSpeaking(false)
        toast({
          title: "Speech Not Supported",
          description: "Text-to-speech is not supported in this browser",
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsSpeaking(false)
      console.error("Speech error:", error)
    }
  }

  // Enhanced slide analysis
  const analyzeSlide = async () => {
    if (!currentSlide || isAiLoading) return

    setIsAiLoading(true)

    try {
      let imageUrl = ""

      if (currentSlide.imageUrl) {
        imageUrl = currentSlide.imageUrl
      } else {
        const canvas = document.createElement("canvas")
        canvas.width = 800
        canvas.height = 600
        const ctx = canvas.getContext("2d")!

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#000000"
        ctx.font = "24px Arial"
        ctx.fillText(currentSlide.content, 50, 100)

        imageUrl = canvas.toDataURL()
      }

      const response = await fetch("/api/whiteboard/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          prompt: "Analyze this presentation slide and provide educational insights.",
        }),
      })

      const data = await response.json()

      const aiMessage: AIMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: `📊 **Slide Analysis:**\n\n${data.analysis || "Analysis completed successfully."}`,
        timestamp: Date.now(),
      }

      setAiMessages((prev) => [...prev, aiMessage])
      setShowAiPanel(true)
    } catch (error) {
      console.error("Slide analysis error:", error)
      toast({
        title: "Analysis Error",
        description: "Could not analyze slide content",
        variant: "destructive",
      })
    } finally {
      setIsAiLoading(false)
    }
  }

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
      if (onSlideChange) {
        onSlideChange(slides[currentSlideIndex + 1])
      }
    }
  }, [currentSlideIndex, slides, onSlideChange])

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
      if (onSlideChange) {
        onSlideChange(slides[currentSlideIndex - 1])
      }
    }
  }, [currentSlideIndex, slides, onSlideChange])

  // Enhanced slide management functions
  const addNewSlide = () => {
    const newSlide: PPTSlide = {
      id: Date.now().toString(),
      content: "New Slide\n\nAdd your content here...",
      createdAt: Date.now(),
      annotations: [],
    }

    setSlides((prev) => [...prev, newSlide])
    setCurrentSlideIndex(slides.length)

    toast({
      title: "Slide Added",
      description: "New slide created successfully",
    })
  }

  const duplicateSlide = (slideId: string) => {
    const slideIndex = slides.findIndex((s) => s.id === slideId)
    if (slideIndex === -1) return

    const originalSlide = slides[slideIndex]
    const duplicatedSlide: PPTSlide = {
      ...originalSlide,
      id: Date.now().toString(),
      content: originalSlide.content + " (Copy)",
      createdAt: Date.now(),
      annotations: [...(originalSlide.annotations || [])],
    }

    const newSlides = [...slides]
    newSlides.splice(slideIndex + 1, 0, duplicatedSlide)
    setSlides(newSlides)

    toast({
      title: "Slide Duplicated",
      description: "Slide copied successfully",
    })
  }

  const deleteSlide = (slideId: string) => {
    if (slides.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "At least one slide must remain",
        variant: "destructive",
      })
      return
    }

    const newSlides = slides.filter((s) => s.id !== slideId)
    setSlides(newSlides)

    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1)
    }

    toast({
      title: "Slide Deleted",
      description: "Slide removed successfully",
    })
  }

  const updateSlideContent = (slideId: string, content: string) => {
    setSlides(slides.map((s) => (s.id === slideId ? { ...s, content } : s)))
  }

  // File upload and processing
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type === "application/pdf") {
      try {
        


        const arrayBuffer = await file.arrayBuffer()
     
        const newSlides: PPTSlide[] = []

        

          const imageUrl = ""

          newSlides.push({
            id: `pdf-page-${Date.now()}`,
            content: `PDF Page`,
            imageUrl,
            createdAt: Date.now(),
            annotations: [],
          })
        

        setSlides((prev) => [...prev, ...newSlides])
        toast({
          title: "PDF Imported",
          description: `${newSlides.length} slides imported from PDF`,
        })
      } catch (error) {
        console.error("PDF import error:", error)
        toast({
          title: "Import Error",
          description: "Could not import PDF file",
          variant: "destructive",
        })
      }
    } else if (file.type.includes("presentation") || file.name.endsWith(".pptx")) {
      toast({
        title: "File Upload",
        description: "PPTX processing requires a backend service. For now, please export to PDF.",
      })
    } else if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file)
      const newSlide: PPTSlide = {
        id: Date.now().toString(),
        content: "Image Slide",
        imageUrl,
        createdAt: Date.now(),
        annotations: [],
      }
      setSlides((prev) => [...prev, newSlide])
      setCurrentSlideIndex(slides.length)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
    setIsGridView(false)
    if (onSlideChange && slides[index]) {
      onSlideChange(slides[index])
    }
  }

  const startEditing = (slideId: string) => {
    const slide = slides.find((s) => s.id === slideId)
    if (slide) {
      setSlideContent(slide.content)
      setEditingSlide(slideId)
    }
  }

  const saveEdit = () => {
    if (editingSlide) {
      updateSlideContent(editingSlide, slideContent)
      setEditingSlide(null)
      setSlideContent("")
    }
  }

  const clearAnnotations = () => {
    if (!currentSlide) return

    setSlides(slides.map((slide) => (slide.id === currentSlide.id ? { ...slide, annotations: [] } : slide)))

    toast({
      title: "Annotations Cleared",
      description: "All drawings removed from current slide",
    })
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isVisible) return

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        nextSlide()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevSlide()
      } else if (e.key === "Escape") {
        setIsFullscreen(false)
        setIsGridView(false)
        setShowDrawingTools(false)
        setShowAiPanel(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isVisible, nextSlide, prevSlide])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop()
      }
      if (isSpeaking) {
        speechSynthesis.cancel()
      }
    }
  }, [mediaRecorder, isSpeaking])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center ${
          isFullscreen ? "p-0" : "p-4"
        }`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col ${
            isFullscreen ? "w-full h-full rounded-none" : "w-full max-w-7xl h-[90vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Presentation className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">AI-Enhanced Presentation</h2>
              <span className="text-sm text-gray-500">
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showDrawingTools ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowDrawingTools(!showDrawingTools)}
                title="Drawing Tools"
              >
                <Pen className="h-4 w-4" />
              </Button>

              <Button
                variant={showAiPanel ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowAiPanel(!showAiPanel)}
                title="AI Assistant"
              >
                <Brain className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setIsGridView(!isGridView)} title="Grid View">
                <Grid3X3 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="Upload Files">
                <Upload className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={addNewSlide} title="Add Slide">
                <Plus className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Slide Thumbnails */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto flex-shrink-0">
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2 px-2">Slides</h3>
                {slides.map((slide, index) => (
                  <Card
                    key={slide.id}
                    className={`p-3 mb-2 cursor-pointer transition-all hover:shadow-md ${
                      index === currentSlideIndex ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Slide {index + 1}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateSlide(slide.id)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSlide(slide.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {slide.imageUrl ? (
                      <img
                        src={slide.imageUrl || "/placeholder.svg"}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ) : (
                      <div className="bg-white dark:bg-gray-700 rounded border p-2 h-20 overflow-hidden">
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-4">{slide.content}</p>
                      </div>
                    )}

                    {slide.annotations && slide.annotations.length > 0 && (
                      <div className="mt-1 text-xs text-blue-500">📝 {slide.annotations.length} annotations</div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex min-w-0">
              {/* Slide Content */}
              <div className="flex-1 flex flex-col min-w-0">
                {isGridView ? (
                  /* Grid View */
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {slides.map((slide, index) => (
                        <Card
                          key={slide.id}
                          className="p-4 cursor-pointer hover:shadow-lg transition-all"
                          onClick={() => goToSlide(index)}
                        >
                          <div className="text-center mb-2">
                            <span className="text-sm font-medium">Slide {index + 1}</span>
                          </div>
                          {slide.imageUrl ? (
                            <img
                              src={slide.imageUrl || "/placeholder.svg"}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                          ) : (
                            <div className="bg-gray-100 dark:bg-gray-700 rounded h-32 p-3 overflow-hidden">
                              <p className="text-sm text-gray-600 dark:text-gray-300">{slide.content}</p>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Single Slide View */
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Drawing Tools */}
                    <AnimatePresence>
                      {showDrawingTools && (
                        <motion.div
                          initial={{ y: -50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -50, opacity: 0 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-gray-950 dark:bg-gray-700 rounded-lg p-1">
                              {[
                                { id: "pen", icon: Pen, label: "Pen" },
                                { id: "highlighter", icon: Highlighter, label: "Highlighter" },
                                { id: "eraser", icon: Eraser, label: "Eraser" },
                              ].map((tool) => (
                                <Button
                                  key={tool.id}
                                  variant={drawingTool === tool.id ? "default" : "ghost"}
                                  size="sm"
                                  onClick={() => setDrawingTool(tool.id)}
                                  className="h-8 w-8 p-0"
                                  title={tool.label}
                                >
                                  <tool.icon className="h-4 w-4" />
                                </Button>
                              ))}
                            </div>

                            <div
                              className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                              style={{ backgroundColor: drawingColor }}
                              onClick={() => {
                                const input = document.createElement("input")
                                input.type = "color"
                                input.value = drawingColor
                                input.onchange = (e) => setDrawingColor((e.target as HTMLInputElement).value)
                                input.click()
                              }}
                            />

                            <div className="flex items-center gap-2">
                              <span className="text-sm">Size:</span>
                              <Input
                                type="range"
                                min="1"
                                max="20"
                                value={drawingSize}
                                onChange={(e) => setDrawingSize(Number(e.target.value))}
                                className="w-20"
                              />
                              <span className="text-sm w-6">{drawingSize}</span>
                            </div>

                            <Button variant="outline" size="sm" onClick={clearAnnotations}>
                              Clear Drawings
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative min-h-0">
                      {currentSlide && (
                        <div className="relative w-full max-w-4xl h-full">
                          <Card className="w-full h-full shadow-2xl relative">
                            <div className="h-full flex flex-col">
                              {editingSlide === currentSlide.id ? (
                                <div className="flex-1 p-6">
                                  <textarea
                                    value={slideContent}
                                    onChange={(e) => setSlideContent(e.target.value)}
                                    className="w-full h-full resize-none border rounded-lg p-4 text-lg"
                                    placeholder="Enter slide content..."
                                  />
                                  <div className="flex gap-2 mt-4">
                                    <Button onClick={saveEdit}>Save</Button>
                                    <Button variant="outline" onClick={() => setEditingSlide(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  ref={slideContentRef}
                                  className="flex-1 p-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative"
                                  onClick={() => !showDrawingTools && startEditing(currentSlide.id)}
                                >
                                  {currentSlide.imageUrl ? (
                                    <img
                                      src={currentSlide.imageUrl || "/placeholder.svg"}
                                      alt={`Slide ${currentSlideIndex + 1}`}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="h-full flex items-center justify-center">
                                      <pre className="text-lg whitespace-pre-wrap text-center leading-relaxed">
                                        {currentSlide.content}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Drawing Canvas Overlay */}
                                  {showDrawingTools && (
                                    <canvas
                                      ref={canvasRef}
                                      className="absolute inset-0 w-full h-full"
                                      onPointerDown={startDrawing}
                                      onPointerMove={draw}
                                      onPointerUp={stopDrawing}
                                      onPointerLeave={stopDrawing}
                                      style={{ touchAction: "none", pointerEvents: showDrawingTools ? "auto" : "none" }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-center gap-4 p-4 bg-gray-950 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <Button variant="outline" onClick={prevSlide} disabled={currentSlideIndex === 0}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      <span className="text-sm text-gray-500 px-4">
                        {currentSlideIndex + 1} of {slides.length}
                      </span>

                      <Button variant="outline" onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>

                      <Button variant="outline" onClick={analyzeSlide} disabled={isAiLoading} className="ml-4">
                        <Camera className="h-4 w-4 mr-1" />
                        {isAiLoading ? "Analyzing..." : "Analyze Slide"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Assistant Panel */}
              <AnimatePresence>
                {showAiPanel && (
                  <motion.div
                    initial={{ x: 400 }}
                    animate={{ x: 0 }}
                    exit={{ x: 400 }}
                    className="w-96 bg-gray-950 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">AI Teaching Assistant</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowAiPanel(false)} className="h-6 w-6 p-0">
                          ×
                        </Button>
                      </div>

                      <Select value={aiMode} onValueChange={setAiMode}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {aiModes.map((mode) => (
                            <SelectItem key={mode.id} value={mode.id}>
                              <div className="flex items-center gap-2">
                                <mode.icon className="h-4 w-4" />
                                {mode.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                      {aiMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.type === "assistant" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakText(message.content)}
                                className="mt-2 h-6 p-1"
                                disabled={isAiLoading}
                              >
                                {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {isAiLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              <span className="text-sm text-purple-400">AI is thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={aiMessagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <div className="flex gap-2 mb-2">
                        <Button
                          variant={isRecording ? "destructive" : "outline"}
                          size="sm"
                          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                          className="h-8 w-8 p-0"
                          title={isRecording ? "Stop Recording" : "Voice Input"}
                          disabled={isAiLoading}
                        >
                          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={analyzeSlide}
                          title="Analyze Current Slide"
                          disabled={isAiLoading}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setAiMessages([aiMessages[0]])
                            toast({
                              title: "Chat Cleared",
                              description: "AI conversation history cleared",
                            })
                          }}
                          title="Clear Chat"
                          disabled={isAiLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Textarea
                          ref={aiInputRef}
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder="Ask about this slide..."
                          className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                          disabled={isAiLoading}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              sendAiMessage()
                            }
                          }}
                        />
                        <Button
                          onClick={sendAiMessage}
                          disabled={!aiInput.trim() || isAiLoading}
                          className="h-10 w-10 p-0"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.ppt,.pptx,image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </motion.div>
    </AnimatePresence>
  )
}
