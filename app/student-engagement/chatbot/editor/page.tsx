"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileText, Download, ArrowLeft, Brain, Eye, EyeOff, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import "katex/dist/katex.min.css"

// First import the dynamic function
const dynamic = require('next/dynamic').default
const { InlineMath, BlockMath } = require('react-katex')

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

// Custom Markdown renderer with KaTeX support
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading renderer...</div>,
})

const QuestionPaperEditor = () => {
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("")
  const [thinkingMode, setThinkingMode] = useState(true)
  const [showThinking, setShowThinking] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [thinking, setThinking] = useState<string[]>([])
  const [response, setResponse] = useState<string[]>([])
  const [editedContent, setEditedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [isThinkingComplete, setIsThinkingComplete] = useState(false)
  const [isResponseComplete, setIsResponseComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thinkingRef = useRef<HTMLDivElement>(null)
  const responseRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Load data from localStorage and fetch API response on mount
  useEffect(() => {
    const storedQuery = localStorage.getItem("paperQuery")
    const storedSubject = localStorage.getItem("paperSubject")
    const storedThinkingMode = localStorage.getItem("paperThinkingMode")

    if (storedQuery && storedSubject && storedThinkingMode !== null) {
      setQuery(storedQuery)
      setSubject(storedSubject)
      setThinkingMode(storedThinkingMode === "true")

      // Fetch response from API
      fetchAPIResponse(storedQuery, storedSubject, storedThinkingMode === "true").then((apiResponse) => {
        if (apiResponse) {
          let thinkingLines: string[] = []
          let responseLines: string[] = []

          // Parse the API response
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

          // Simulate thinking process display
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
            }, 800)
          } else {
            setIsThinkingComplete(true)
            startResponseGeneration(responseLines)
          }
        } else {
          // If no API response, set some default content
          setThinking([])
          setResponse([
            "# Sample Question Paper",
            "",
            "## Please enter your query to generate a customized question paper."
          ])
          setIsThinkingComplete(true)
          setIsResponseComplete(true)
          setIsGenerating(false)
        }
      })
    } else {
      // For demo purposes, set default subject when accessing the page directly
      setSubject("Sample Subject")
      setIsLoading(false)
      setThinking([])
      setResponse([
        "# Sample Question Paper",
        "",
        "## Please enter your query to generate a customized question paper."
      ])
      setIsThinkingComplete(true)
      setIsResponseComplete(true)
      setIsGenerating(false)
    }
  }, [])  // Empty dependency array to run only once

  // Auto-scroll thinking box
  useEffect(() => {
    if (thinkingRef.current && thinking.length > 0) {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight
    }
  }, [thinking])

  // Auto-scroll response box
  useEffect(() => {
    if (responseRef.current && response.length > 0) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight
    }
  }, [response])

  // Update edited content when response is complete - only run when isResponseComplete changes
  useEffect(() => {
    if (isResponseComplete && response.length > 0) {
      const fullResponse = response.join("\n")
      setEditedContent(fullResponse)
    }
  }, [isResponseComplete, response])

  // Fixed handler for editor changes - separates state updates to avoid loops
  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    setEditedContent(newValue);
    
    // Only update response if we're in preview tab - important to avoid loops
    if (activeTab === "preview") {
      const lines = newValue.split("\n").filter(line => line.trim() !== "");
      setResponse(lines);
    }
  };

  // Handle tab changes without creating loops
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // When switching to preview tab, update from edited content
    if (value === "preview" && editedContent) {
      const lines = editedContent.split("\n").filter(line => line.trim() !== "");
      setResponse(lines);
    }
  };

  // Fetch response from the API
  const fetchAPIResponse = async (query: string, subject: string, thinkingMode: boolean) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/professor-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, subject, thinkingMode }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

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

  // Simulate line-by-line response generation
  const startResponseGeneration = (responseLines: string[]) => {
    let responseIndex = 0
    const responseInterval = setInterval(() => {
      if (responseIndex < responseLines.length) {
        setResponse((prev) => [...prev, responseLines[responseIndex]])
        responseIndex++
      } else {
        clearInterval(responseInterval)
        setIsResponseComplete(true)
        setIsGenerating(false)
      }
    }, 300)
  }

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Your question paper has been downloaded as a PDF.",
    })
    // PDF download logic would go here
  }

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const imageMarkdown = `\n\n![${file.name}](${imageUrl})\n\n`
        
        // Update edited content first
        const updatedContent = editedContent + imageMarkdown;
        setEditedContent(updatedContent)
        setImageUrl(imageUrl)
        
        // Update the preview only if in preview tab
        if (activeTab === "preview") {
          const lines = updatedContent.split("\n").filter(line => line.trim() !== "");
          setResponse(lines);
        }
        
        toast({
          title: "Image Added",
          description: "The image has been added to your question paper.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Enhanced custom components for ReactMarkdown with robust math handling
  const components = {
    p: ({ node, children }: any) => {
      const content = typeof children === "string" ? children : String(children)
      const parts = content.split(/(\$.*?\$|\$\$.*?\$\$)/g)
      if (parts.length > 1) {
        return (
          <p className="leading-relaxed my-2">
            {parts.map((part, i) => {
              if (part.startsWith("$$") && part.endsWith("$$")) {
                const math = part.slice(2, -2)
                return <BlockMath key={i} math={math} />
              } else if (part.startsWith("$") && part.endsWith("$")) {
                const math = part.slice(1, -1)
                return <InlineMath key={i} math={math} />
              }
              return <span key={i}>{part}</span>
            })}
          </p>
        )
      }
      return <p className="leading-relaxed my-2">{children}</p>
    },
    blockquote: ({ node, children }: any) => {
      const content = typeof children === "string" ? children : String(children)
      if (content.startsWith("$$") && content.endsWith("$$")) {
        const math = content.slice(2, -2)
        return <BlockMath math={math}  />
      }
      return <blockquote className="border-l-4 pl-4 my-4 italic">{children}</blockquote>
    },
    img: ({ src, alt }: { src: string; alt: string }) => (
      <div className="my-4">
        <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full h-auto rounded-lg shadow-lg" />
      </div>
    ),
    h1: ({ node, children }: any) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
    h2: ({ node, children }: any) => <h2 className="text-xl font-semibold my-3">{children}</h2>,
    h3: ({ node, children }: any) => <h3 className="text-lg font-medium my-2">{children}</h3>,
  }

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
        @keyframes neonGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
        @keyframes neonFlow {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .neon-text {
          text-shadow: 0 0 5px rgba(0, 255, 255, 0.7), 0 0 10px rgba(0, 255, 255, 0.5);
        }
        .paper-bg {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
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
        .gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          padding: 1px;
          background: linear-gradient(60deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.5));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .katex { 
          font-size: 1.1em; 
          margin: 0.5em 0;
        }
        .katex-display { 
          display: block; 
          margin: 1em 0; 
          text-align: center; 
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px]" />
      </div>

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
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-800/80 hover:text-white"
              onClick={handleAddImage}
            >
              <ImageIcon className="h-4 w-4" />
              Add Image
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!editedContent || isLoading}
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
          {subject ? (subject.charAt(0).toUpperCase() + subject.slice(1)) : "Question"} Paper
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
                                className="text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text leading-relaxed neon-text"
                              >
                                {line}
                              </motion.p>
                            ))}
                          </div>
                          <div
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-cyan-500/20 via-pink-500/20 to-transparent"
                            style={{
                              pointerEvents: "none",
                              animation: "neonFlow 1.5s infinite linear",
                            }}
                          ></div>
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
                    Question Paper
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Preview your question paper or edit the content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-blue-600">
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="edit" className="data-[state=active]:bg-blue-600">
                        Edit
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-0">
                      <div
                        ref={responseRef}
                        className="h-[600px] overflow-y-auto thinking-box bg-white text-black rounded-lg p-8 shadow-inner"
                      >
                        {response.map((line, i) => (
                          <div key={`response-line-${i}`}>
                            <ReactMarkdown components={components as any}>{line}</ReactMarkdown>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="edit" className="mt-0">
                      <div className="h-[600px]">
                        <MDEditor
                          value={editedContent}
                          onChange={handleEditorChange}
                          height={600}
                          preview="edit"
                          data-color-mode="dark"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-800/80 hover:text-white"
                    onClick={handleAddImage}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionPaperEditor
