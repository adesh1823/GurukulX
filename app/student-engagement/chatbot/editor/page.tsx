
"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Loader2, FileText, Download, ArrowLeft, Brain, Eye, EyeOff, ImageIcon, Type, Palette, Bold, Italic, Underline, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

const QuestionPaperEditor = () => {
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("")
  const [thinkingMode, setThinkingMode] = useState(true)
  const [showThinking, setShowThinking] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [thinking, setThinking] = useState<string[]>([])
  const [response, setResponse] = useState<string[]>([])
  const [markdownContent, setMarkdownContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [isThinkingComplete, setIsThinkingComplete] = useState(false)
  const [isResponseComplete, setIsResponseComplete] = useState(false)
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)
  
  // Styling states
  const [selectedFont, setSelectedFont] = useState("serif")
  const [fontSize, setFontSize] = useState([16])
  const [textColor, setTextColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thinkingRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const contentSet = useRef(false)
  const { toast } = useToast()

  const fontOptions = [
    { value: "serif", label: "Times New Roman", fontFamily: "'Times New Roman', serif", className: "font-serif" },
    { value: "sans", label: "Arial", fontFamily: "Arial, sans-serif", className: "font-sans" },
    { value: "mono", label: "Courier New", fontFamily: "'Courier New', monospace", className: "font-mono" },
    { value: "playfair", label: "Playfair Display", fontFamily: "'Playfair Display', serif", className: "font-playfair" },
    { value: "inter", label: "Inter", fontFamily: "'Inter', sans-serif", className: "font-inter" },
    { value: "roboto", label: "Roboto", fontFamily: "'Roboto', sans-serif", className: "font-roboto" },
    { value: "crimson", label: "Crimson Text", fontFamily: "'Crimson Text', serif", className: "font-crimson" },
    { value: "lora", label: "Lora", fontFamily: "'Lora', serif", className: "font-lora" }
  ]

  // Load data from localStorage and fetch API response on mount
  useEffect(() => {
    const storedQuery = localStorage.getItem("paperQuery")
    const storedSubject = localStorage.getItem("paperSubject")
    const storedThinkingMode = localStorage.getItem("paperThinkingMode")

    if (storedQuery && storedSubject && storedThinkingMode !== null) {
      setQuery(storedQuery)
      setSubject(storedSubject)
      setThinkingMode(storedThinkingMode === "true")

      fetchAPIResponse(storedQuery, storedSubject, storedThinkingMode === "true").then((apiResponse) => {
        if (apiResponse) {
          let thinkingLines: string[] = []
          let responseLines: string[] = []

          if (storedThinkingMode === "true") {
            const thinkingMatch = apiResponse.match(/<Thinking>([\s\S]*?)<\/Thinking>/)
            if (thinkingMatch) {
              thinkingLines = thinkingMatch[1].split("\n").filter((line: string) => line.trim() !== "")
            }
            const responsePart = apiResponse.replace(/<Thinking>[\s\S]*?<\/Thinking>/, "").trim()
            responseLines = responsePart.split("\n").filter((line: string) => line.trim() !== "")
          } else {
            responseLines = apiResponse.split("\n").filter((line: string) => line.trim() !== "")
          }

          if (storedThinkingMode === "true" && thinkingLines.length > 0) {
            let thinkingIndex = 0
            const thinkingInterval = setInterval(() => {
              if (thinkingIndex < thinkingLines.length) {
                setThinking((prev) => [...prev, thinkingLines[thinkingIndex]])
                thinkingIndex++
              } else {
                clearInterval(thinkingInterval)
                setIsThinkingComplete(true)
                startResponseGeneration(responseLines)
              }
            }, 200)
          } else {
            setIsThinkingComplete(true)
            startResponseGeneration(responseLines)
          }
        } else {
          setThinking([])
          setResponse([
            "# Sample Question Paper",
            "",
            "## Please enter your query to generate a customized question paper."
          ])
          setMarkdownContent("# Sample Question Paper\n\n## Please enter your query to generate a customized question paper.")
          setIsThinkingComplete(true)
          setIsResponseComplete(true)
          setIsGenerating(false)
        }
      })
    } else {
      setSubject("Sample Subject")
      setIsLoading(false)
      setThinking([])
      setResponse([
        "# Sample Question Paper",
        "",
        "## Please enter your query to generate a customized question paper."
      ])
      setMarkdownContent("# Sample Question Paper\n\n## Please enter your query to generate a customized question paper.")
      setIsThinkingComplete(true)
      setIsResponseComplete(true)
      setIsGenerating(false)
    }
  }, [])

  // Enable CSS styling for formatting commands
  useEffect(() => {
    document.execCommand('styleWithCSS', false, 'true')
  }, [])

  // Auto-scroll thinking box
  useEffect(() => {
    if (thinkingRef.current && thinking.length > 0) {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight
    }
  }, [thinking])

  // Set initial editor content only once
  useEffect(() => {
    if (isResponseComplete && !contentSet.current) {
      const content = response.join("\n")
      setMarkdownContent(content)
      updateEditorContent(content)
      contentSet.current = true
    }
  }, [isResponseComplete])

  const fetchAPIResponse = async (query: string, subject: string, thinkingMode: boolean) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/professor-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, subject, thinkingMode }),
      })

      if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error fetching API response:", error)
      toast({
        title: "Error",
        description: "Failed to generate question paper. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const startResponseGeneration = (responseLines: string[]) => {
    setShowTypingIndicator(true)
    let responseIndex = 0
    const responseInterval = setInterval(() => {
      if (responseIndex < responseLines.length) {
        setResponse((prev) => [...prev, responseLines[responseIndex]])
        responseIndex++
      } else {
        clearInterval(responseInterval)
        setShowTypingIndicator(false)
        setIsResponseComplete(true)
        setIsGenerating(false)
      }
    }, 50)
  }

  const updateEditorContent = (content: string) => {
    if (editorRef.current) {
      const formattedHTML = convertMarkdownToHTML(content)
      editorRef.current.innerHTML = formattedHTML
    }
  }

  const convertMarkdownToHTML = (markdown: string) => {
    return markdown
      .split('\n')
      .map((line) => {
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
        if (imageMatch) {
          const [, alt, src] = imageMatch
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          return `<div class="image-container my-4 relative group" data-image-id="${imageId}">
            <img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg shadow-lg" />
            <button class="image-delete-btn absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onclick="removeImage('${imageId}')">×</button>
          </div>`
        }
        if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold my-6 text-gray-900">${line.substring(2)}</h1>`
        if (line.startsWith('## ')) return `<h2 class="text-2xl font-semibold my-4 text-gray-800">${line.substring(3)}</h2>`
        if (line.startsWith('### ')) return `<h3 class="text-xl font-medium my-3 text-gray-700">${line.substring(4)}</h3>`
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        line = line.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        if (line.trim() === '') return '<br />'
        return `<p class="leading-relaxed my-2 text-gray-900">${line}</p>`
      })
      .join('')
  }

  const convertHTMLToMarkdown = (html: string) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    let markdown = ''
    
    const processNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
      if (node.nodeType !== Node.ELEMENT_NODE) return ''
      
      const element = node as Element
      const tagName = element.tagName.toLowerCase()
      const content = Array.from(element.childNodes).map(processNode).join('')
      
      switch (tagName) {
        case 'h1': return `# ${content}\n`
        case 'h2': return `## ${content}\n`
        case 'h3': return `### ${content}\n`
        case 'strong':
        case 'b': return `**${content}**`
        case 'em':
        case 'i': return `*${content}*`
        case 'p': return `${content}\n`
        case 'br': return '\n'
        case 'img':
          const src = element.getAttribute('src') || ''
          const alt = element.getAttribute('alt') || ''
          return `![${alt}](${src})`
        case 'div':
          if (element.classList.contains('image-container')) {
            const img = element.querySelector('img')
            if (img) {
              const src = img.getAttribute('src') || ''
              const alt = img.getAttribute('alt') || ''
              return `![${alt}](${src})\n`
            }
          }
          return content
        default: return content
      }
    }
    
    return Array.from(tempDiv.childNodes).map(processNode).join('')
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML
      const markdownContent = convertHTMLToMarkdown(htmlContent)
      setMarkdownContent(markdownContent)
      setResponse(markdownContent.split('\n').filter(line => line.trim() !== ''))
    }
  }

  const applyFormatting = (command: string, value?: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      document.execCommand(command, false, value)
      handleContentChange()
      updateFormattingStates()
    } else {
      toast({
        title: "Select Text",
        description: "Please select some text to apply formatting.",
        variant: "destructive",
      })
    }
  }

  const applyFontFamily = (fontFamily: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      document.execCommand('fontName', false, fontFamily)
      handleContentChange()
    } else {
      toast({
        title: "Select Text",
        description: "Please select some text to apply font family.",
        variant: "destructive",
      })
    }
  }

  const updateFormattingStates = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setIsBold(document.queryCommandState('bold'))
      setIsItalic(document.queryCommandState('italic'))
      setIsUnderline(document.queryCommandState('underline'))
    }
  }

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          
          const imageContainer = document.createElement('div')
          imageContainer.className = 'image-container my-4 relative group'
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          imageContainer.setAttribute('data-image-id', imageId)
          
          imageContainer.innerHTML = `
            <img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto rounded-lg shadow-lg" />
            <button class="image-delete-btn absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onclick="removeImage('${imageId}')">×</button>
          `
          
          range.insertNode(imageContainer)
          range.setStartAfter(imageContainer)
          range.setEndAfter(imageContainer)
          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          const updatedMarkdown = markdownContent + '\n\n' + `![${file.name}](${imageUrl})`
          setMarkdownContent(updatedMarkdown)
          updateEditorContent(updatedMarkdown)
        }
        
        handleContentChange()
        toast({
          title: "Image Added",
          description: "The image has been added to your question paper.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (imageId: string) => {
    const imageContainer = document.querySelector(`[data-image-id="${imageId}"]`)
    if (imageContainer) {
      imageContainer.remove()
      handleContentChange()
      toast({
        title: "Image Removed",
        description: "The image has been removed from your question paper.",
      })
    }
  }

  useEffect(() => {
    (window as any).removeImage = removeImage
    return () => { delete (window as any).removeImage }
  }, [])

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Your question paper has been downloaded as a PDF.",
    })
    // Add PDF download logic here if needed
  }

  const getSelectedFontClass = () => {
    const font = fontOptions.find(f => f.value === selectedFont)
    return font ? font.className : "font-serif"
  }

  const getTextStyle = () => ({
    fontSize: `${fontSize[0]}px`,
    color: textColor,
  })

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
        .thinking-box {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.5) rgba(31, 41, 55, 0.3);
        }
        
        .paper-container {
          background-color: white;
          box-shadow: 
            0 1px 3px rgba(0,0,0,0.12), 
            0 5px 12px rgba(0,0,0,0.15), 
            0 15px 25px rgba(0,0,0,0.08);
          border-radius: 2px;
          position: relative;
          padding: 40px;
          transition: all 0.3s ease;
          min-height: 700px;
          background-image: 
            linear-gradient(#f1f1f1 1px, transparent 1px),
            linear-gradient(90deg, #f1f1f1 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: -1px -1px;
        }
        
        .paper-container:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px) 0 0 / 25px 100%,
            linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px) 0 0 / 100% 25px;
          z-index: 0;
          pointer-events: none;
          opacity: 0.2;
        }
        
        .paper-container:after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.3;
        }
        
        .paper-container.dark {
          background-color: #1c1c1c;
          color: #e0e0e0;
          background-image: 
            linear-gradient(#333333 1px, transparent 1px),
            linear-gradient(90deg, #333333 1px, transparent 1px);
        }
        
        .paper-edge {
          position: absolute;
          height: 100%;
          width: 20px;
          left: -10px;
          top: 0;
          background-image: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.8) 5%,
            transparent 10%,
            rgba(200, 200, 200, 0.2) 90%,
            transparent 100%
          );
          z-index: -1;
          border-radius: 2px 0 0 2px;
          box-shadow: inset -7px 0 9px -7px rgba(0,0,0,0.1);
        }
        
        .paper-holes {
          position: absolute;
          left: -8px;
          height: 100%;
          width: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          z-index: 2;
        }
        
        .paper-hole {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d0d0d0, #f5f5f5);
          box-shadow: 
            inset 0px 0px 2px rgba(0,0,0,0.25),
            0px 0px 0px 2px rgba(255,255,255,0.15);
          position: relative;
        }
        
        .paper-hole:after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(0,0,0,0.1);
          top: 2px;
          left: 2px;
        }
        
        .editable-content {
          min-height: 500px;
          outline: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          padding: 1rem;
        }
        
        .editable-content:focus {
          box-shadow: none;
        }
        
        .image-container {
          position: relative;
          display: inline-block;
          margin: 16px 0;
        }
        
        .image-delete-btn {
          z-index: 10;
        }
        
        .typing-indicator {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
          animation: float 2s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .glass-card {
          backdrop-filter: blur(16px);
          background: rgba(17, 24, 39, 0.7);
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 
            0 4px 30px rgba(0, 0, 0, 0.1),
            inset 0 0 1px 1px rgba(59, 130, 246, 0.1);
        }
        
        .gradient-border {
          position: relative;
          border-radius: 0.75rem;
          padding: 1px;
          background: linear-gradient(60deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.5));
        }
        
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
        .font-crimson { font-family: 'Crimson Text', serif; }
        .font-lora { font-family: 'Lora', serif; }
        
        .paper-tools {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          padding: 0.5rem;
        }
        
        .paper-tools:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .page-curl {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, transparent 50%, rgba(230, 230, 230, 0.6) 50%);
          border-radius: 0 0 0 10px;
          box-shadow: -5px -5px 10px -5px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          transition: all 0.3s ease;
        }
        
        .paper-container:hover .page-curl {
          width: 60px;
          height: 60px;
        }
        
        .ruler-marks::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 0;
          width: 18px;
          height: 100%;
          background: 
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 9px,
              rgba(0, 0, 0, 0.1) 9px,
              rgba(0, 0, 0, 0.1) 10px
            ),
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 49px,
              rgba(0, 0, 0, 0.2) 49px,
              rgba(0, 0, 0, 0.2) 50px
            );
          pointer-events: none;
        }
        
        .pencil-shadow {
          filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence>
        {showTypingIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="typing-indicator"
          >
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Clarvis is typing</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-800/80 hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {thinkingMode && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-800/80 hover:text-white"
                onClick={() => setShowThinking(!showThinking)}
              >
                {showThinking ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showThinking ? "Hide Thinking" : "Show Thinking"}
              </Button>
            )}

            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!markdownContent || isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center"
        >
          {subject ? (subject.charAt(0).toUpperCase() + subject.slice(1)) : "Question"} Paper Editor
        </motion.h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-400">Generating your question paper...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {thinkingMode && showThinking && thinking.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="gradient-border">
                    <Card className="glass-card border-0">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center">
                          <Brain className="mr-2 h-5 w-5 text-blue-400" />
                          AI Thinking Process
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          ref={thinkingRef}
                          className="relative p-4 rounded-xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 shadow-[0_0_18px_rgba(0,255,255,0.6)] overflow-hidden max-h-48 overflow-y-auto thinking-box"
                        >
                          <div className="relative z-10 space-y-1">
                            {thinking.map((line, i) => (
                              <motion.p
                                key={`think-line-${i}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text leading-relaxed"
                              >
                                {line}
                              </motion.p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="gradient-border">
              <Card className="glass-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-400" />
                    Editable Question Paper
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Click anywhere to edit content directly. Select text to format it with the toolbar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="paper-tools flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-lg sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-gray-600" />
                      <Select onValueChange={(value) => {
                        setSelectedFont(value);
                        const font = fontOptions.find(f => f.value === value)
                        if (font) applyFontFamily(font.fontFamily)
                      }}
                      value={selectedFont}
                      >
                        <SelectTrigger className="w-[180px] bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600">
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

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Size:</span>
                      <div className="w-24">
                        <Slider
                          value={fontSize}
                          onValueChange={setFontSize}
                          max={32}
                          min={10}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{fontSize[0]}px</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={isBold ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyFormatting('bold')}
                        className="h-8 w-8 p-0 pencil-shadow"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={isItalic ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyFormatting('italic')}
                        className="h-8 w-8 p-0 pencil-shadow"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={isUnderline ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyFormatting('underline')}
                        className="h-8 w-8 p-0 pencil-shadow"
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-gray-600" />
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          applyFormatting('foreColor', e.target.value);
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                        title="Text Color"
                      />
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => {
                          setBackgroundColor(e.target.value);
                          applyFormatting('hiliteColor', e.target.value);
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                        title="Highlight Color"
                      />
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 pencil-shadow"
                      onClick={handleAddImage}
                    >
                      <ImageIcon className="h-4 w-4" />
                      Add Image
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mt-4"
                  >
                    <div className="paper-holes">
                      <div className="paper-hole"></div>
                      <div className="paper-hole"></div>
                      <div className="paper-hole"></div>
                    </div>
                    <div className="paper-edge ruler-marks"></div>
                    
                    <div className="paper-container">
                      <div
                        ref={editorRef}
                        className={`editable-content thinking-box ${getSelectedFontClass()}`}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onInput={handleContentChange}
                        onKeyUp={updateFormattingStates}
                        onMouseUp={updateFormattingStates}
                        style={getTextStyle()}
                      />
                      <div className="page-curl"></div>
                    </div>
                  </motion.div>
                </CardContent>
                <div className="flex justify-between items-center p-6 pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">
                      {markdownContent.length} characters
                    </span>
                  </div>
                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionPaperEditor;
