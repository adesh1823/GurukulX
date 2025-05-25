"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  FileText,
  Download,
  ArrowLeft,
  Brain,
  Eye,
  EyeOff,
  ImageIcon,
  Type,
  Palette,
  Bold,
  Italic,
  Underline,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Undo,
  Redo,
  Save,
  Copy,
  ClipboardPasteIcon as Paste,
  ZoomIn,
  ZoomOut,
  Grid,
  Layers,
  Square,
  Circle,
  Triangle,
  Minus,
  Strikethrough,
  Subscript,
  Superscript,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Enhanced type definitions
interface FontOption {
  value: string
  label: string
  fontFamily: string
  className: string
}

interface ImageData {
  id: string
  src: string
  alt: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  borderRadius: number
  borderWidth: number
  borderColor: string
  shadow: boolean
  zIndex: number
}

interface ShapeData {
  id: string
  type: "rectangle" | "circle" | "triangle" | "line"
  x: number
  y: number
  width: number
  height: number
  color: string
  borderColor: string
  borderWidth: number
  rotation: number
  zIndex: number
}

interface TextStyle {
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor: string
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  subscript: boolean
  superscript: boolean
  alignment: "left" | "center" | "right" | "justify"
  lineHeight: number
  letterSpacing: number
}

interface CursorPosition {
  node: Node | null
  offset: number
}

interface APIResponse {
  response: string
}

const EnhancedQuestionPaperEditor: React.FC = () => {
  const [query, setQuery] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [thinkingMode, setThinkingMode] = useState<boolean>(true)
  const [showThinking, setShowThinking] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [thinking, setThinking] = useState<string[]>([])
  const [response, setResponse] = useState<string[]>([])
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(true)
  const [isThinkingComplete, setIsThinkingComplete] = useState<boolean>(false)
  const [isResponseComplete, setIsResponseComplete] = useState<boolean>(false)
  const [showTypingIndicator, setShowTypingIndicator] = useState<boolean>(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [shapes, setShapes] = useState<ShapeData[]>([])
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [activeShape, setActiveShape] = useState<string | null>(null)
  const [katexLoaded, setKatexLoaded] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(100)
  const [showGrid, setShowGrid] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [savedCursorPosition, setSavedCursorPosition] = useState<CursorPosition | null>(null)

  // Enhanced styling states
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontSize: 16,
    fontFamily: "serif",
    color: "#000000",
    backgroundColor: "transparent",
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    subscript: false,
    superscript: false,
    alignment: "left",
    lineHeight: 1.5,
    letterSpacing: 0,
  })

  const [selectedTool, setSelectedTool] = useState<string>("text")
  const [brushSize, setBrushSize] = useState<number>(5)
  const [selectedColor, setSelectedColor] = useState<string>("#000000")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const thinkingRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const fontOptions: FontOption[] = [
    { value: "serif", label: "Times New Roman", fontFamily: "'Times New Roman', serif", className: "font-serif" },
    { value: "sans", label: "Arial", fontFamily: "Arial, sans-serif", className: "font-sans" },
    { value: "mono", label: "Courier New", fontFamily: "'Courier New', monospace", className: "font-mono" },
    {
      value: "playfair",
      label: "Playfair Display",
      fontFamily: "'Playfair Display', serif",
      className: "font-playfair",
    },
    { value: "inter", label: "Inter", fontFamily: "'Inter', sans-serif", className: "font-inter" },
    { value: "roboto", label: "Roboto", fontFamily: "'Roboto', sans-serif", className: "font-roboto" },
    { value: "crimson", label: "Crimson Text", fontFamily: "'Crimson Text', serif", className: "font-crimson" },
    { value: "lora", label: "Lora", fontFamily: "'Lora', serif", className: "font-lora" },
    { value: "opensans", label: "Open Sans", fontFamily: "'Open Sans', sans-serif", className: "font-opensans" },
    {
      value: "merriweather",
      label: "Merriweather",
      fontFamily: "'Merriweather', serif",
      className: "font-merriweather",
    },
  ]

  // Improved cursor position management
  const saveCursorPosition = useCallback((): CursorPosition | null => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0)
      return {
        node: range.startContainer,
        offset: range.startOffset,
      }
    }
    return null
  }, [])

  const restoreCursorPosition = useCallback((position: CursorPosition | null) => {
    if (!position || !position.node || !editorRef.current?.contains(position.node)) return

    try {
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()

        // Ensure the node still exists and the offset is valid
        const maxOffset =
          position.node.nodeType === Node.TEXT_NODE ? (position.node as Text).length : position.node.childNodes.length

        const safeOffset = Math.min(position.offset, maxOffset)

        range.setStart(position.node, safeOffset)
        range.collapse(true)

        selection.removeAllRanges()
        selection.addRange(range)
      }
    } catch (error) {
      console.warn("Could not restore cursor position:", error)
    }
  }, [])

  // Debounced content update to prevent cursor jumping
  const debouncedUpdateContent = useCallback(
    (content: string) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      updateTimeoutRef.current = setTimeout(() => {
        setIsUpdating(true)
        const cursorPos = saveCursorPosition()
        setSavedCursorPosition(cursorPos)

        setMarkdownContent(content)
        saveToHistory(content)

        // Restore cursor position after a brief delay
        requestAnimationFrame(() => {
          setTimeout(() => {
            restoreCursorPosition(cursorPos)
            setIsUpdating(false)
          }, 10)
        })
      }, 150)
    },
    [saveCursorPosition, restoreCursorPosition],
  )

  // Load external fonts and KaTeX
  useEffect(() => {
    const loadExternalResources = async () => {
      const fontLink = document.createElement("link")
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Crimson+Text:wght@400;600&family=Lora:wght@400;500;700&family=Open+Sans:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap"
      fontLink.rel = "stylesheet"
      document.head.appendChild(fontLink)

      if (typeof window !== "undefined" && !(window as any).katex) {
        const katexScript = document.createElement("script")
        katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"
        katexScript.crossOrigin = "anonymous"
        document.head.appendChild(katexScript)

        const katexStyles = document.createElement("link")
        katexStyles.rel = "stylesheet"
        katexStyles.href = "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
        katexStyles.crossOrigin = "anonymous"
        document.head.appendChild(katexStyles)

        katexScript.onload = () => {
          setKatexLoaded(true)
        }
      } else if (typeof (window as any).katex !== "undefined") {
        setKatexLoaded(true)
      }
    }
    loadExternalResources()
  }, [])

  // Improved markdown to HTML conversion
  const convertMarkdownToHTML = useCallback(
    (markdown: string): string => {
      let html = markdown

      // Handle question numbers and sections
      html = html.replace(/^Q(\d+)\.\s*(.*?)$/gm, (match, num, content) => {
        return `<div class="question mb-4 p-3 border-l-4 border-blue-500 bg-blue-50"><strong class="text-lg text-blue-700">Q${num}.</strong> <span class="ml-2">${content.trim()}</span></div>`
      })

      // Handle sections
      html = html.replace(
        /^Section\s*([A-Z])\s*-\s*(.*?)\s*$$(\d+-\d+\s*marks)$$$/gm,
        (match, section, title, marks) => {
          return `<h2 class="text-xl font-bold mt-8 mb-6 text-gray-800 border-b-2 border-gray-300 pb-2">Section ${section} - ${title} (${marks})</h2>`
        },
      )

      // Handle plain text questions with dashes
      html = html.replace(/^-\s*Q\d+\.\s*(.*?)$/gm, (match, content) => {
        const questionMatch = content.match(/^(Q\d+\.\s*)(.*?)($$(\d+\s*marks)$$)?$/)
        if (questionMatch) {
          const qNum = questionMatch[1]
          const qContent = questionMatch[2]
          const marks = questionMatch[3] || ""
          return `<div class="question mb-4 p-3 border-l-4 border-green-500 bg-green-50"><strong class="text-lg text-green-700">${qNum}</strong> <span class="ml-2">${qContent.trim()}</span> <span class="text-sm text-gray-600">${marks}</span></div>`
        }
        return match
      })

      // Headers with better styling
      html = html.replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-semibold my-4 text-gray-800 border-l-4 border-purple-500 pl-4">$1</h3>',
      )
      html = html.replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-bold my-6 text-gray-800 border-b-2 border-gray-300 pb-2">$1</h2>',
      )
      html = html.replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold my-8 text-gray-900 text-center border-b-4 border-blue-500 pb-4">$1</h1>',
      )

      // Enhanced text formatting
      html = html.replace(
        /\*\*\*(.*?)\*\*\*/g,
        '<strong class="font-bold bg-yellow-100 px-1 rounded"><em class="italic">$1</em></strong>',
      )
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      html = html.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500">$1</del>')

      // Enhanced code blocks
      html = html.replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-900 text-green-400 p-6 rounded-lg my-6 overflow-x-auto shadow-lg border border-gray-700"><code class="font-mono text-sm">$1</code></pre>',
      )
      html = html.replace(
        /`(.*?)`/g,
        '<code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-red-600 border">$1</code>',
      )

      // Enhanced links
      html = html.replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline hover:bg-blue-50 px-1 rounded transition-colors" target="_blank" rel="noopener noreferrer">$1</a>',
      )

      // Enhanced images
      html = html.replace(
        /!\[([^\]]*)\]$$([^)]+)$$/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-lg my-6 border border-gray-200" />',
      )

      // Enhanced lists
      html = html.replace(/^\* (.+)$/gm, '<li class="ml-6 list-disc marker:text-blue-500 py-1">$1</li>')
      html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal marker:text-green-500 py-1">$1</li>')

      // Wrap list items with better styling
      html = html.replace(
        /(<li class="ml-6 list-disc[\s\S]*?<\/li>)+/g,
        '<ul class="list-disc my-6 space-y-1 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">$&</ul>',
      )
      html = html.replace(
        /(<li class="ml-6 list-decimal[\s\S]*?<\/li>)+/g,
        '<ol class="list-decimal my-6 space-y-1 bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">$&</ol>',
      )

      // Enhanced blockquotes
      html = html.replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-orange-400 bg-orange-50 pl-6 py-4 italic my-6 text-gray-700 rounded-r-lg shadow-sm">$1</blockquote>',
      )

      // Handle plain text lines with better paragraph styling
      html = html.replace(
        /^(?!<div|<h[1-3]|<ul|<ol|<blockquote|<pre|<img)(.+)$/gm,
        '<p class="my-4 leading-relaxed text-gray-800">$1</p>',
      )

      // Line breaks within paragraphs
      html = html.replace(/\n(?!(<div|<h[1-3]|<ul|<ol|<blockquote|<pre|<img))/g, "<br>")

      // Render math equations
      html = renderMath(html)

      return html
    },
    [katexLoaded],
  )

  const renderMath = useCallback(
    (text: string): string => {
      if (!katexLoaded || typeof (window as any).katex === "undefined") return text

      text = text.replace(/\$\$(.*?)\$\$/g, (match, p1) => {
        try {
          return `<div class="math-display my-6 text-center bg-blue-50 p-4 rounded-lg border border-blue-200">${(window as any).katex.renderToString(p1.trim(), { throwOnError: false, displayMode: true })}</div>`
        } catch (e) {
          return `<div class="text-red-500 my-4 p-3 bg-red-50 border border-red-200 rounded">Invalid LaTeX: ${p1}</div>`
        }
      })

      text = text.replace(/(?<!\$)\$(.*?)(?<!\$)\$/g, (match, p1) => {
        try {
          return `<span class="math-inline bg-blue-50 px-1 rounded">${(window as any).katex.renderToString(p1.trim(), { throwOnError: false })}</span>`
        } catch (e) {
          return `<span class="text-red-500 bg-red-50 px-1 rounded">Invalid LaTeX: ${p1}</span>`
        }
      })

      return text
    },
    [katexLoaded],
  )

  // Mock API response
  const fetchAPIResponse = async (query: string, subject: string, thinkingMode: boolean): Promise<string | null> => {
    try {
      const response = await fetch("/api/professor-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, subject, thinkingMode }),
      })
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
      const data: APIResponse = await response.json()
      return data.response
    } catch (error) {
      console.error("Error fetching API response:", error)
      // Return mock data for demo
      return null
    }
  }

  const processAPIResponse = (apiResponse: string, thinkingMode: boolean) => {
    let thinkingLines: string[] = []
    let responseLines: string[] = []

    if (thinkingMode) {
      const thinkingMatch = apiResponse.match(/<Thinking>([\s\S]*?)<\/Thinking>/)
      if (thinkingMatch) {
        thinkingLines = thinkingMatch[1]
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line) => line.trim())
      }

      const responsePart = apiResponse.replace(/<Thinking>[\s\S]*?<\/Thinking>/, "").trim()
      responseLines = responsePart.split("\n").filter((line) => line.trim() !== "")
    } else {
      responseLines = apiResponse.split("\n").filter((line) => line.trim() !== "")
    }

    setThinking([])
    setResponse([])
    setMarkdownContent("")

    if (thinkingMode && thinkingLines.length > 0) {
      animateThinking(thinkingLines, () => {
        setIsThinkingComplete(true)
        animateResponse(responseLines)
      })
    } else {
      setIsThinkingComplete(true)
      animateResponse(responseLines)
    }
  }

  const animateThinking = (lines: string[], callback: () => void) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < lines.length) {
        setThinking((prev) => [...prev, lines[index]])
        index++
      } else {
        clearInterval(interval)
        callback()
      }
    }, 100)
  }

  const animateResponse = (lines: string[]) => {
    setShowTypingIndicator(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < lines.length) {
        setResponse((prev) => [...prev, lines[index]])
        index++
      } else {
        clearInterval(interval)
        setShowTypingIndicator(false)
        setIsResponseComplete(true)
        setIsGenerating(false)
        setIsLoading(false)
      }
    }, 50)
  }

  useEffect(() => {
    const fetchAndProcessContent = async () => {
      setIsLoading(true)

      try {
        const storedQuery = localStorage.getItem("paperQuery") || "Generate a comprehensive question paper"
        const storedSubject = localStorage.getItem("paperSubject") || "Mathematics"
        const storedThinkingMode = localStorage.getItem("paperThinkingMode") === "true"

        setQuery(storedQuery)
        setSubject(storedSubject)
        setThinkingMode(storedThinkingMode)

        const apiResponse = await fetchAPIResponse(storedQuery, storedSubject, storedThinkingMode)

        if (apiResponse) {
          processAPIResponse(apiResponse, storedThinkingMode)
        } else {
          throw new Error("Failed to fetch API response")
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to generate question paper. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        setIsGenerating(false)
      }
    }

    fetchAndProcessContent()
  }, [])

  useEffect(() => {
    if (response.length > 0 && editorRef.current) {
      const content = response.join("\n")
      setMarkdownContent(content)
      updateEditorContent(content)
      saveToHistory(content)
    }
  }, [response, katexLoaded])

  const updateEditorContent = useCallback(
    (content: string) => {
      if (editorRef.current && !isUpdating) {
        const formattedHTML = convertMarkdownToHTML(content)
        editorRef.current.innerHTML = formattedHTML
      }
    },
    [convertMarkdownToHTML, isUpdating],
  )

  const saveToHistory = useCallback(
    (content: string) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push(content)
        return newHistory.slice(-50)
      })
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const content = history[newIndex]
      setMarkdownContent(content)
      updateEditorContent(content)
    }
  }, [historyIndex, history, updateEditorContent])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const content = history[newIndex]
      setMarkdownContent(content)
      updateEditorContent(content)
    }
  }, [historyIndex, history, updateEditorContent])

  // Improved content change handler
  const handleContentChange = useCallback(() => {
    if (editorRef.current && !isUpdating) {
      const htmlContent = editorRef.current.innerHTML
      const markdownContent = convertHTMLToMarkdown(htmlContent)
      debouncedUpdateContent(markdownContent)
    }
  }, [isUpdating, debouncedUpdateContent])

  const convertHTMLToMarkdown = useCallback((html: string): string => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html

    const processNode = (node: Node, level = 0): string => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent || ""
      if (node.nodeType !== Node.ELEMENT_NODE) return ""

      const element = node as HTMLElement
      const tagName = element.tagName.toLowerCase()
      const content = Array.from(element.childNodes)
        .map((child) => processNode(child, level + 1))
        .join("")

      switch (tagName) {
        case "h1":
          return `# ${content}\n\n`
        case "h2":
          return `## ${content}\n\n`
        case "h3":
          return `### ${content}\n\n`
        case "strong":
        case "b":
          return `**${content}**`
        case "em":
        case "i":
          return `*${content}*`
        case "del":
          return `~~${content}~~`
        case "code":
          return `\`${content}\``
        case "pre":
          return `\`\`\`\n${content}\n\`\`\`\n`
        case "a":
          const href = element.getAttribute("href") || ""
          return `[${content}](${href})`
        case "img":
          const src = element.getAttribute("src") || ""
          const alt = element.getAttribute("alt") || ""
          return `![${alt}](${src})`
        case "p":
          return `${content}\n\n`
        case "br":
          return "\n"
        case "li":
          return `${" ".repeat(level * 2)}- ${content}\n`
        case "ul":
          return `${content}\n`
        case "ol":
          return `${content}\n`
        case "blockquote":
          return `> ${content}\n`
        case "div":
          if (element.classList.contains("question")) {
            const strong = element.querySelector("strong")?.textContent || ""
            const span = element.querySelector("span")?.textContent || ""
            const remaining = Array.from(element.childNodes)
              .slice(2)
              .map((child) => processNode(child))
              .join("")
            return `${strong} ${span} ${remaining}\n`
          }
          return content
        default:
          return content
      }
    }

    return Array.from(tempDiv.childNodes)
      .map((node) => processNode(node))
      .join("")
      .trim()
  }, [])

  // Enhanced formatting functions
  const applyFormatting = useCallback(
    (command: string, value?: string) => {
      if (!editorRef.current) return

      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
        const range = selection.getRangeAt(0)
        const success = document.execCommand(command, false, value)

        if (success) {
          selection.removeAllRanges()
          selection.addRange(range)
          handleContentChange()
          updateFormattingStates()
        } else {
          toast({
            title: "Formatting Failed",
            description: `Could not apply ${command}. Please try again.`,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Select Text",
          description: "Please select some text to apply formatting.",
          variant: "destructive",
        })
      }
    },
    [handleContentChange, toast],
  )

  const applyAlignment = useCallback(
    (alignment: "left" | "center" | "right" | "justify") => {
      if (editorRef.current) {
        editorRef.current.style.textAlign = alignment
        setTextStyle((prev) => ({ ...prev, alignment }))
        handleContentChange()
      }
    },
    [handleContentChange],
  )

  const insertList = useCallback(
    (ordered = false) => {
      applyFormatting(ordered ? "insertOrderedList" : "insertUnorderedList")
    },
    [applyFormatting],
  )

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      applyFormatting("createLink", url)
    }
  }, [applyFormatting])

  const insertImage = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

          const newImage: ImageData = {
            id: imageId,
            src: imageUrl,
            alt: file.name,
            x: 50,
            y: 50,
            width: 200,
            height: 150,
            rotation: 0,
            opacity: 1,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: "#000000",
            shadow: false,
            zIndex: images.length + 1,
          }

          setImages((prev) => [...prev, newImage])

          toast({
            title: "Image Added",
            description: "Drag the image to position it on your paper.",
          })
        }
        reader.readAsDataURL(file)
      }
    },
    [images.length, toast],
  )

  const addShape = useCallback(
    (type: "rectangle" | "circle" | "triangle" | "line") => {
      const shapeId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newShape: ShapeData = {
        id: shapeId,
        type,
        x: 100,
        y: 100,
        width: type === "line" ? 100 : 100,
        height: type === "line" ? 2 : 100,
        color: selectedColor,
        borderColor: "#000000",
        borderWidth: 2,
        rotation: 0,
        zIndex: shapes.length + 1,
      }

      setShapes((prev) => [...prev, newShape])
      setActiveShape(shapeId)
    },
    [selectedColor, shapes.length],
  )

  const removeImage = useCallback(
    (imageId: string) => {
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      if (activeImage === imageId) setActiveImage(null)

      toast({
        title: "Image Removed",
        description: "The image has been removed from your question paper.",
      })
    },
    [activeImage, toast],
  )

  const removeShape = useCallback(
    (shapeId: string) => {
      setShapes((prev) => prev.filter((shape) => shape.id !== shapeId))
      if (activeShape === shapeId) setActiveShape(null)
    },
    [activeShape],
  )

  const updateFormattingStates = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || !editorRef.current) return

    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null
    if (!range) return

    const parentElement =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : (range.commonAncestorContainer as HTMLElement)

    if (parentElement && document.queryCommandSupported("bold")) {
      setTextStyle((prev) => ({
        ...prev,
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikethrough: document.queryCommandState("strikeThrough"),
        subscript: document.queryCommandState("subscript"),
        superscript: document.queryCommandState("superscript"),
      }))
    }
  }, [])

  const handleDownloadPDF = useCallback(() => {
    toast({
      title: "PDF Download",
      description: "Your question paper has been downloaded as a PDF.",
    })
  }, [])

  const copyContent = useCallback(() => {
    navigator.clipboard
      .writeText(markdownContent)
      .then(() => {
        toast({
          title: "Copied",
          description: "Content copied to clipboard.",
        })
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Could not copy content to clipboard.",
          variant: "destructive",
        })
      })
  }, [markdownContent, toast])

  const pasteContent = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (editorRef.current) {
        const formattedHTML = convertMarkdownToHTML(text)
        document.execCommand("insertHTML", false, formattedHTML)
        handleContentChange()
      }
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Could not paste content from clipboard.",
        variant: "destructive",
      })
    }
  }, [convertMarkdownToHTML, handleContentChange, toast])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <style>{`
        .thinking-box::-webkit-scrollbar {
          width: 6px;
        }
        .thinking-box::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 10px;
        }
        .thinking-box::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .thinking-box::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
        
        .paper-container {
          background-color: white;
          box-shadow: 
            0 1px 3px rgba(0,0,0,0.12), 
            0 5px 12px rgba(0,0,0,0.15), 
            0 15px 25px rgba(0,0,0,0.08);
          border-radius: 8px;
          position: relative;
          padding: 60px;
          transition: all 0.3s ease;
          min-height: 800px;
          transform: scale(${zoom / 100});
          transform-origin: top left;
          ${
            showGrid
              ? `
            background-image: 
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
            background-size: 20px 20px;
          `
              : ""
          }
        }
        
        .editable-content {
          min-height: 600px;
          outline: none;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1;
          padding: 2rem;
          font-family: ${fontOptions.find((f) => f.value === textStyle.fontFamily)?.fontFamily || "serif"};
          font-size: ${textStyle.fontSize}px;
          color: ${textStyle.color};
          line-height: ${textStyle.lineHeight};
          letter-spacing: ${textStyle.letterSpacing}px;
          text-align: ${textStyle.alignment};
          border: 2px solid transparent;
          border-radius: 8px;
        }
        
        .editable-content:focus {
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .draggable-image {
          position: absolute;
          cursor: grab;
          border: 2px solid transparent;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          border-radius: 8px;
          overflow: hidden;
          z-index: 2;
        }
        
        .draggable-image:hover {
          border: 2px solid rgba(59, 130, 246, 0.7);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }
        
        .draggable-image.active {
          cursor: grabbing;
          border: 2px solid rgb(59, 130, 246);
          z-index: 10;
          transform: scale(1.02);
        }
        
        .shape-element {
          position: absolute;
          cursor: grab;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .shape-element:hover {
          border: 2px solid rgba(59, 130, 246, 0.7);
          transform: translateY(-1px);
        }
        
        .shape-element.active {
          border: 2px solid rgb(59, 130, 246);
          cursor: grabbing;
          z-index: 10;
        }
        
        .toolbar-section {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
        .font-crimson { font-family: 'Crimson Text', serif; }
        .font-lora { font-family: 'Lora', serif; }
        .font-opensans { font-family: 'Open Sans', sans-serif; }
        .font-merriweather { font-family: 'Merriweather', serif; }
        
        .question {
          transition: all 0.2s ease;
        }
        
        .question:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Enhanced floating typing indicator */}
      <AnimatePresence>
        {showTypingIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-20 right-20 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <Brain className="h-6 w-6 animate-pulse" />
              <span className="font-semibold">AI is crafting your question paper...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3">
            {thinkingMode && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200"
                onClick={() => setShowThinking(!showThinking)}
              >
                {showThinking ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showThinking ? "Hide AI Process" : "Show AI Process"}
              </Button>
            )}

            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
              disabled={!markdownContent || isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center"
        >
          Professional {subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "Question"} Paper Editor
        </motion.h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400 mb-6" />
            <p className="text-gray-400 text-lg">Generating your professional question paper...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Enhanced Thinking Process */}
            <AnimatePresence>
              {thinkingMode && showThinking && thinking.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center text-xl">
                        <Brain className="mr-3 h-6 w-6 text-blue-400 animate-pulse" />
                        AI Thinking Process
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Watch how AI analyzes your requirements and crafts the perfect question paper
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        ref={thinkingRef}
                        className="relative p-6 rounded-xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 shadow-lg overflow-hidden max-h-64 overflow-y-auto thinking-box"
                      >
                        <div className="relative z-10 space-y-2">
                          {thinking.map((line, i) => (
                            <motion.p
                              key={`think-line-${i}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text leading-relaxed font-medium"
                            >
                              {line}
                            </motion.p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Main Editor */}
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center text-xl">
                  <FileText className="mr-3 h-6 w-6 text-blue-400" />
                  Professional Question Paper Editor
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced editing suite with AI-powered content generation, real-time formatting, and professional
                  publishing tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                {/* Enhanced Toolbar */}
                <Tabs defaultValue="format" className="w-full mb-6">
                  <TabsList className="grid w-full grid-cols-5 bg-gray-700/50 p-1 rounded-lg">
                    <TabsTrigger value="format" className="data-[state=active]:bg-blue-600">
                      Format
                    </TabsTrigger>
                    <TabsTrigger value="insert" className="data-[state=active]:bg-blue-600">
                      Insert
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="data-[state=active]:bg-blue-600">
                      Layout
                    </TabsTrigger>
                    <TabsTrigger value="tools" className="data-[state=active]:bg-blue-600">
                      Tools
                    </TabsTrigger>
                    <TabsTrigger value="view" className="data-[state=active]:bg-blue-600">
                      View
                    </TabsTrigger>
                  </TabsList>

                  {/* Format Tab */}
                  <TabsContent value="format" className="space-y-4">
                    <div className="toolbar-section">
                      <div className="flex flex-wrap items-center gap-4">
                        {/* History Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Undo"
                          >
                            <Undo className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={redo}
                            disabled={historyIndex >= history.length - 1}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Redo"
                          >
                            <Redo className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Font Controls */}
                        <div className="flex items-center gap-3">
                          <Type className="h-5 w-5 text-gray-600" />
                          <Select
                            onValueChange={(value: string) => {
                              setTextStyle((prev) => ({ ...prev, fontFamily: value }))
                              applyFormatting(
                                "fontName",
                                fontOptions.find((f) => f.value === value)?.fontFamily || "serif",
                              )
                            }}
                            value={textStyle.fontFamily}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                              {fontOptions.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  <span className={font.className}>{font.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Font Size */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 font-medium">Size:</span>
                          <div className="w-32">
                            <Slider
                              value={[textStyle.fontSize]}
                              onValueChange={(value) => {
                                setTextStyle((prev) => ({ ...prev, fontSize: value[0] }))
                                applyFormatting("fontSize", `${value[0]}px`)
                              }}
                              max={48}
                              min={8}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 font-mono">{textStyle.fontSize}px</span>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Text Formatting */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant={textStyle.bold ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFormatting("bold")}
                            className="h-9 w-9 p-0"
                            title="Bold"
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.italic ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFormatting("italic")}
                            className="h-9 w-9 p-0"
                            title="Italic"
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.underline ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFormatting("underline")}
                            className="h-9 w-9 p-0"
                            title="Underline"
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.strikethrough ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFormatting("strikeThrough")}
                            className="h-9 w-9 p-0"
                            title="Strikethrough"
                          >
                            <Strikethrough className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.subscript ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFormatting("subscript")}
                            className="h-9 w-9 p-0"
                            title="Subscript"
                          >
                            <Subscript className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.superscript ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFormatting("superscript")}
                            className="h-9 w-9 p-0"
                            title="Superscript"
                          >
                            <Superscript className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Alignment */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant={textStyle.alignment === "left" ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyAlignment("left")}
                            className="h-9 w-9 p-0"
                            title="Align Left"
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.alignment === "center" ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyAlignment("center")}
                            className="h-9 w-9 p-0"
                            title="Align Center"
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.alignment === "right" ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyAlignment("right")}
                            className="h-9 w-9 p-0"
                            title="Align Right"
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={textStyle.alignment === "justify" ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyAlignment("justify")}
                            className="h-9 w-9 p-0"
                            title="Justify"
                          >
                            <AlignJustify className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Colors */}
                        <div className="flex items-center gap-3">
                          <Palette className="h-5 w-5 text-gray-600" />
                          <div className="flex gap-2">
                            <div className="flex flex-col items-center gap-1">
                              <input
                                type="color"
                                value={textStyle.color}
                                onChange={(e) => {
                                  setTextStyle((prev) => ({ ...prev, color: e.target.value }))
                                  applyFormatting("foreColor", e.target.value)
                                }}
                                className="w-10 h-8 rounded border-2 border-gray-300 cursor-pointer"
                                title="Text Color"
                              />
                              <span className="text-xs text-gray-500">Text</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <input
                                type="color"
                                value={textStyle.backgroundColor}
                                onChange={(e) => {
                                  setTextStyle((prev) => ({ ...prev, backgroundColor: e.target.value }))
                                  applyFormatting("hiliteColor", e.target.value)
                                }}
                                className="w-10 h-8 rounded border-2 border-gray-300 cursor-pointer"
                                title="Highlight Color"
                              />
                              <span className="text-xs text-gray-500">Highlight</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Insert Tab */}
                  <TabsContent value="insert" className="space-y-4">
                    <div className="toolbar-section">
                      <div className="flex flex-wrap items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => insertList(false)}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <List className="h-4 w-4" />
                          Bullet List
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => insertList(true)}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <ListOrdered className="h-4 w-4" />
                          Numbered List
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyFormatting("formatBlock", "blockquote")}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <Quote className="h-4 w-4" />
                          Quote
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyFormatting("formatBlock", "pre")}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <Code className="h-4 w-4" />
                          Code Block
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={insertLink}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <Link className="h-4 w-4" />
                          Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={insertImage}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Image
                        </Button>

                        <Separator orientation="vertical" className="h-8" />

                        {/* Shapes */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addShape("rectangle")}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Rectangle"
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addShape("circle")}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Circle"
                          >
                            <Circle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addShape("triangle")}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Triangle"
                          >
                            <Triangle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addShape("line")}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Line"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Layout Tab */}
                  <TabsContent value="layout" className="space-y-4">
                    <div className="toolbar-section">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Label htmlFor="line-height" className="font-medium">
                            Line Height:
                          </Label>
                          <Slider
                            id="line-height"
                            value={[textStyle.lineHeight]}
                            onValueChange={(value) => setTextStyle((prev) => ({ ...prev, lineHeight: value[0] }))}
                            max={3}
                            min={1}
                            step={0.1}
                            className="w-32"
                          />
                          <span className="text-sm w-12 font-mono">{textStyle.lineHeight.toFixed(1)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Label htmlFor="letter-spacing" className="font-medium">
                            Letter Spacing:
                          </Label>
                          <Slider
                            id="letter-spacing"
                            value={[textStyle.letterSpacing]}
                            onValueChange={(value) => setTextStyle((prev) => ({ ...prev, letterSpacing: value[0] }))}
                            max={5}
                            min={-2}
                            step={0.1}
                            className="w-32"
                          />
                          <span className="text-sm w-12 font-mono">{textStyle.letterSpacing.toFixed(1)}px</span>
                        </div>

                        <Separator orientation="vertical" className="h-8" />

                        <Button
                          variant={showGrid ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowGrid(!showGrid)}
                          className="flex items-center gap-2"
                        >
                          <Grid className="h-4 w-4" />
                          Grid {showGrid ? "On" : "Off"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tools Tab */}
                  <TabsContent value="tools" className="space-y-4">
                    <div className="toolbar-section">
                      <div className="flex flex-wrap items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyContent}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <Copy className="h-4 w-4" />
                          Copy All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={pasteContent}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <Paste className="h-4 w-4" />
                          Paste
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMarkdownContent("")
                            setImages([])
                            setShapes([])
                            if (editorRef.current) editorRef.current.innerHTML = ""
                            saveToHistory("")
                            toast({
                              title: "Content Cleared",
                              description: "All content has been cleared from the editor.",
                            })
                          }}
                          className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear All
                        </Button>

                        <Separator orientation="vertical" className="h-8" />

                        <div className="flex items-center gap-3">
                          <Label htmlFor="brush-size" className="font-medium">
                            Brush Size:
                          </Label>
                          <Slider
                            id="brush-size"
                            value={[brushSize]}
                            onValueChange={(value) => setBrushSize(value[0])}
                            max={20}
                            min={1}
                            step={1}
                            className="w-32"
                          />
                          <span className="text-sm w-12 font-mono">{brushSize}px</span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-10 h-8 rounded border-2 border-gray-300 cursor-pointer"
                            title="Drawing Color"
                          />
                          <span className="text-xs text-gray-500">Color</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* View Tab */}
                  <TabsContent value="view" className="space-y-4">
                    <div className="toolbar-section">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(Math.max(25, zoom - 25))}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Zoom Out"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <span className="text-sm w-16 text-center font-mono">{zoom}%</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(Math.min(200, zoom + 25))}
                            className="h-9 w-9 p-0 hover:bg-blue-50"
                            title="Zoom In"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setZoom(100)}
                          className="flex items-center gap-2 hover:bg-blue-50"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset Zoom
                        </Button>

                        <Separator orientation="vertical" className="h-8" />

                        <Button variant="outline" size="sm" className="flex items-center gap-2" disabled>
                          <Layers className="h-4 w-4" />
                          Layers (Coming Soon)
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Enhanced Paper Container */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative mt-6 overflow-auto border-2 border-gray-200 rounded-lg"
                  style={{ height: "700px" }}
                >
                  <div ref={containerRef} className="paper-container relative">
                    <div
                      ref={editorRef}
                      className="editable-content"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onInput={handleContentChange}
                      onKeyUp={updateFormattingStates}
                      onMouseUp={updateFormattingStates}
                      onFocus={() => {
                        if (editorRef.current) {
                          editorRef.current.style.borderColor = "rgba(59, 130, 246, 0.5)"
                        }
                      }}
                      onBlur={() => {
                        if (editorRef.current) {
                          editorRef.current.style.borderColor = "transparent"
                        }
                      }}
                      style={{
                        fontFamily: fontOptions.find((f) => f.value === textStyle.fontFamily)?.fontFamily || "serif",
                        fontSize: `${textStyle.fontSize}px`,
                        color: textStyle.color,
                        lineHeight: textStyle.lineHeight,
                        letterSpacing: `${textStyle.letterSpacing}px`,
                        textAlign: textStyle.alignment,
                      }}
                    />

                    {/* Enhanced Draggable Images */}
                    {images.map((image) => (
                      <motion.div
                        key={image.id}
                        className={`draggable-image ${activeImage === image.id ? "active" : ""} group`}
                        drag
                        dragConstraints={containerRef}
                        dragElastic={0.1}
                        dragMomentum={false}
                        initial={{ x: image.x, y: image.y }}
                        animate={{
                          x: image.x,
                          y: image.y,
                          width: image.width,
                          height: image.height,
                          rotate: image.rotation,
                          opacity: image.opacity,
                          zIndex: image.zIndex,
                        }}
                        onDragStart={() => setActiveImage(image.id)}
                        onDragEnd={(e, info) => {
                          setImages((prev) =>
                            prev.map((img) =>
                              img.id === image.id
                                ? {
                                    ...img,
                                    x: Math.max(0, img.x + info.offset.x / (zoom / 100)),
                                    y: Math.max(0, img.y + info.offset.y / (zoom / 100)),
                                  }
                                : img,
                            ),
                          )
                          setActiveImage(null)
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          borderRadius: `${image.borderRadius}px`,
                          borderWidth: `${image.borderWidth}px`,
                          borderColor: image.borderColor,
                          boxShadow: image.shadow ? "0 10px 25px rgba(0,0,0,0.3)" : "none",
                          zIndex: image.zIndex,
                        }}
                      >
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius: `${image.borderRadius}px`,
                          }}
                          draggable={false}
                        />

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setImages((prev) =>
                                prev.map((img) =>
                                  img.id === image.id
                                    ? { ...img, zIndex: Math.max(...images.map((i) => i.zIndex)) + 1 }
                                    : img,
                                ),
                              )
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg text-xs"
                            title="Bring to Front"
                          >
                            <Layers className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeImage(image.id)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                            title="Remove Image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    {/* Enhanced Draggable Shapes */}
                    {shapes.map((shape) => (
                      <motion.div
                        key={shape.id}
                        className={`shape-element ${activeShape === shape.id ? "active" : ""} group`}
                        drag
                        dragConstraints={containerRef}
                        dragElastic={0.1}
                        dragMomentum={false}
                        initial={{ x: shape.x, y: shape.y }}
                        animate={{
                          x: shape.x,
                          y: shape.y,
                          width: shape.width,
                          height: shape.height,
                          rotate: shape.rotation,
                          zIndex: shape.zIndex,
                        }}
                        onDragStart={() => setActiveShape(shape.id)}
                        onDragEnd={(e, info) => {
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === shape.id
                                ? {
                                    ...s,
                                    x: Math.max(0, s.x + info.offset.x / (zoom / 100)),
                                    y: Math.max(0, s.y + info.offset.y / (zoom / 100)),
                                  }
                                : s,
                            ),
                          )
                          setActiveShape(null)
                        }}
                        style={{
                          backgroundColor: shape.type === "line" ? "transparent" : shape.color,
                          borderWidth: `${shape.borderWidth}px`,
                          borderColor: shape.borderColor,
                          borderStyle: "solid",
                          borderRadius: shape.type === "circle" ? "50%" : shape.type === "triangle" ? "0" : "4px",
                          clipPath: shape.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
                          zIndex: shape.zIndex,
                        }}
                      >
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setShapes((prev) =>
                                prev.map((s) =>
                                  s.id === shape.id
                                    ? { ...s, zIndex: Math.max(...shapes.map((sh) => sh.zIndex)) + 1 }
                                    : s,
                                ),
                              )
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            title="Bring to Front"
                          >
                            <Layers className="h-2 w-2" />
                          </button>
                          <button
                            onClick={() => removeShape(shape.id)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            title="Remove Shape"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Status Bar */}
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg mt-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span className="font-medium">{markdownContent.length} characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">
                        {markdownContent.split(/\s+/).filter((word) => word.length > 0).length} words
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="font-medium">
                        {images.length} image{images.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      <span className="font-medium">
                        {shapes.length} shape{shapes.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        localStorage.setItem("questionPaperContent", markdownContent)
                        localStorage.setItem("questionPaperImages", JSON.stringify(images))
                        localStorage.setItem("questionPaperShapes", JSON.stringify(shapes))
                        toast({
                          title: "Saved Successfully",
                          description: "Your work has been saved locally and can be restored later.",
                        })
                      }}
                      className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600"
                    >
                      <Save className="h-4 w-4" />
                      Save Work
                    </Button>
                    <Button
                      onClick={handleDownloadPDF}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
    </div>
  )
}

export default EnhancedQuestionPaperEditor
