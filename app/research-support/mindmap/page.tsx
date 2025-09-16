"use client"

import { useState, useEffect } from "react"
import mermaid from "mermaid"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Download, Loader2, Copy, Zap, Info, Brain, Network, Lightbulb } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { saveAs } from "file-saver"
import { GradientText } from "@/components/ui/gradient-text"

// Default mindmap diagram
const DEFAULT_DIAGRAM = `mindmap
  root((Mindmap Starter))
    Concepts
      Idea Generation
      ::icon(fa fa-lightbulb)
      Planning
        ::icon(fa fa-clipboard)
        Goals
        Timeline
    Tools
      Pen and Paper
      ::icon(fa fa-pen)
      Mermaid
      ::icon(fa fa-code)`

export default function MindmapGenerator() {
  const [prompt, setPrompt] = useState("")
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_DIAGRAM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [renderedSvg, setRenderedSvg] = useState("")
  const [error, setError] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)

  useEffect(() => {
    // Initialize Mermaid for mindmaps
    ;(async () => {
      try {
        await mermaid.registerExternalDiagrams([await import("@mermaid-js/mermaid-mindmap")])
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "Inter, sans-serif",
          mindmap: {
            useMaxWidth: true,
            padding: 20,
          },
        })
        renderDiagram(mermaidCode)
      } catch (err) {
        console.error("Mermaid initialization error:", err)
        setError("Failed to initialize Mermaid for mindmaps.")
        toast({
          title: "Initialization Error",
          description: "Failed to load Mermaid mindmap support. Please refresh the page.",
          variant: "destructive",
        })
      }
    })()
  }, [])

  const renderDiagram = async (code: string) => {
    if (!code.trim()) {
      setRenderedSvg("")
      setError("")
      setShowDiagram(false)
      return
    }

    try {
      setError("")
      setIsAnimating(true)
      setShowDiagram(false)

      // Add a delay for the animation effect
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const { svg } = await mermaid.render("diagram", code)
      setRenderedSvg(svg)

      // Trigger the diagram appearance animation
      setTimeout(() => {
        setIsAnimating(false)
        setShowDiagram(true)
      }, 500)
    } catch (err) {
      console.error("Mermaid rendering error:", err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to render mindmap. Ensure the code starts with "mindmap", uses consistent indentation, and has valid node syntax (e.g., plain text, ID[Label], ID((Label))).',
      )
      toast({
        title: "Render Error",
        description:
          "Invalid Mermaid mindmap code. Ensure it starts with 'mindmap', uses proper indentation, and valid node syntax (e.g., plain text like 'Origins', ID[Label] for squares, ID((Label)) for circles). Avoid unescaped parentheses or special characters in node labels.",
        variant: "destructive",
      })
      setRenderedSvg("")
      setIsAnimating(false)
      setShowDiagram(false)
    }
  }

  const generateDiagram = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description:
          "Please enter a description of the mindmap you want to create (e.g., machine learning concepts, project management workflow).",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/mindmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate mindmap")
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setMermaidCode(data.diagram)
      await renderDiagram(data.diagram)

      toast({
        title: "Mindmap generated",
        description: "Your mindmap has been generated successfully using Groq Llama 3.3",
      })
    } catch (error) {
      console.error("Error generating mindmap:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate mindmap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCodeChange = (newCode: string) => {
    setMermaidCode(newCode)
    renderDiagram(newCode)
  }

  const exportSvg = () => {
    if (!renderedSvg) {
      toast({
        title: "No mindmap to export",
        description: "Please generate or create a valid mindmap first",
        variant: "destructive",
      })
      return
    }

    const svgBlob = new Blob([renderedSvg], { type: "image/svg+xml;charset=utf-8" })
    const filename = `mindmap-${Date.now()}.svg`
    saveAs(svgBlob, filename)

    toast({
      title: "Export successful",
      description: `Saved as ${filename}`,
    })
  }

  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode)
    toast({
      title: "Code copied",
      description: "Mermaid mindmap code copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-orange-600/50 backdrop-blur-xl bg-orange-50/80 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-green-500 text-blackblack flex items-center justify-center font-bold text-blacklg shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-black5xl font-bold text-blackcenter">
                <GradientText>GX Mindmap Generator</GradientText><span className="text-blackgreen-500"> (Beta)</span>
              </h1>
              <p className="text-blacksm text-blackblack">Powered by GurukulX-1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportSvg}
              variant="outline"
              className="bg-orange-50/80 border-orange-600/50 text-blackblack hover:bg-orange-50/80"
            >
              <Download className="h-4 w-4 mr-2" />
              Export SVG
            </Button>
          </div>
        </div>
      </header>

      {/* Educational Section */}
   

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* AI Prompt Section */}
            <div className="bg-orange-50/80 backdrop-blur-xl border border-orange-600/50 rounded-xl p-6 shadow-2xl">
              <h2 className="text-blacklg font-semibold text-blackwhite mb-4 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                AI Prompt
              </h2>
              <div className="space-y-4">
                <Input
                  placeholder="Describe your mindmap (e.g., machine learning concepts, project management workflow...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-orange-50/80 border-orange-600/50 text-blackblack placeholder-orange-400 focus:border-emerald-400"
                />
                <Button
                  onClick={generateDiagram}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-blackblack border-0 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating with GurukulX...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Mindmap
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="bg-orange-50/80 backdrop-blur-xl border border-orange-600/50 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-blacklg font-semibold text-blackwhite flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                  Mermaid Code
                </h2>
                <Button
                  onClick={copyCode}
                  variant="outline"
                  size="sm"
                  className="bg-orange-50/80 border-orange-600/50 text-blackblack hover:bg-orange-50/80"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={mermaidCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Enter your Mermaid mindmap code here..."
                className="min-h-[400px] font-mono text-blacksm bg-orange-50/80 border-orange-600/50 text-blackblack-200 placeholder-orange-400 focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-orange-50/80 backdrop-blur-xl border border-orange-600/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-blacklg font-semibold text-blackwhite mb-4 flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
              Mindmap Preview
            </h2>
            <div className="bg-orange-50/90 border border-orange-600/50 rounded-lg p-6 min-h-[600px] flex items-center justify-center relative overflow-hidden">
              {/* Futuristic Loading Animation */}
              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="w-32 h-32 border-4 border-transparent border-t-emerald-400 border-r-cyan-400 rounded-full animate-spin"></div>

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 w-24 h-24 border-2 border-transparent border-t-emerald-400 border-l-cyan-400 rounded-full animate-spin animate-reverse"></div>

                    {/* Center glowing dot */}
                    <div className="absolute inset-1/2 w-4 h-4 -ml-2 -mt-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>

                    {/* Scanning lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rotate-90">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse delay-300"></div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute -inset-8">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                          style={{
                            left: `${20 + i * 10}%`,
                            top: `${30 + i * 5}%`,
                            animationDelay: `${i * 200}ms`,
                            animationDuration: "2s",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Loading text */}
                  <div className="absolute bottom-20 text-blackcenter">
                    <div className="text-blackcyan-400 font-mono text-blacksm mb-2 animate-pulse">Rendering Mindmap...</div>
                    <div className="flex space-x-1 justify-center">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 200}ms` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isAnimating && (
                <div className="text-blackcenter animate-fadeIn">
                  <div className="text-blackred-400 mb-2">⚠️ Render Error</div>
                  <pre className="text-blackred-300 text-blacksm bg-red-50/20 p-4 rounded border border-red-600/50 max-w-md">
                    {error}
                  </pre>
                </div>
              )}

              {/* Rendered Diagram with Staggered Animation */}
              {renderedSvg && showDiagram && !error && (
                <div className="w-full h-full flex items-center justify-center overflow-auto animate-slideInUp">
                  <div className="diagram-container" dangerouslySetInnerHTML={{ __html: renderedSvg }} />
                </div>
              )}

              {/* Empty State */}
              {!renderedSvg && !error && !isAnimating && (
                <div className="text-blackblack-400 text-blackcenter animate-fadeIn">
                  <div className="text-black4xl mb-4 animate-bounce">🧠</div>
                  <p>Your mindmap will appear here</p>
                  <div className="mt-4 text-blackxs text-blackblack-500">Generate or edit code to see the magic happen</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-transparent backdrop-blur-xl border border-orange-600/50 rounded-xl p-6 shadow-2xl mb-6">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-blackblack-400 mr-3" />
            <h2 className="text-blackxl font-semibold text-blackblack">About Mindmaps</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-blackblack-400 leading-relaxed">
                Mindmaps are visual thinking tools that help organize information hierarchically around a central
                concept. They mirror how our brains naturally process information, making them perfect for
                brainstorming, note-taking, project planning, and knowledge mapping.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-transparent rounded-lg p-4 border border-orange-600/30">
                  <Brain className="h-8 w-8 text-blackblack-400 mb-2" />
                  <h3 className="font-semibold text-blackblack mb-1">Central Topic</h3>
                  <p className="text-blacksm text-blackblack-400">Main idea at the center</p>
                </div>
                <div className="bg-transparent rounded-lg p-4 border border-orange-600/30">
                  <Network className="h-8 w-8 text-blackblack-400 mb-2" />
                  <h3 className="font-semibold text-blackblack mb-1">Branches</h3>
                  <p className="text-blacksm text-blackblack-400">Related subtopics radiating out</p>
                </div>
                <div className="bg-transparent rounded-lg p-4 border border-orange-600/30">
                  <Lightbulb className="h-8 w-8 text-blackpurple-400 mb-2" />
                  <h3 className="font-semibold text-blackwhite mb-1">Keywords</h3>
                  <p className="text-blacksm text-blackblack-400">Key concepts and ideas</p>
                </div>
              </div>
            </div>
            <div className="bg-transparent rounded-lg p-4 border border-orange-600/30">
              <h3 className="font-semibold text-blackwhite mb-3">Perfect for:</h3>
              <ul className="space-y-2 text-blackblack-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Brainstorming sessions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Project planning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Study notes organization
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  Knowledge mapping
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Decision making
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  Creative thinking
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-transparent backdrop-blur-xl border border-orange-600/50 rounded-xl p-6 text-blackcenter shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-blacklg font-semibold text-blackwhite mb-2">
              <GradientText>⚡ Ultra-Fast AI-Powered Mindmap Generation</GradientText>
            </h3>
            <p className="text-blackblack-300 mb-4">
              Create professional mindmaps instantly using GurukulX's lightning-fast model. Simply describe your
              concept, and watch as AI generates beautiful Mermaid mindmaps with enhanced styling.
            </p>
            <div className="flex items-center justify-center space-x-6 text-blacksm">
              <div className="flex items-center text-blackemerald-400">
                <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></span>
                GurukulX-1.0
              </div>
              <div className="flex items-center text-blackindigo-400">
                <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                Real-time Preview
              </div>
              <div className="flex items-center text-blackpurple-400">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                SVG Export
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.8s ease-out;
      }
      
      .animate-slideInUp {
        animation: slideInUp 1s ease-out;
      }
      
      .animate-reverse {
        animation-direction: reverse;
      }
      
      /* Staggered animation for mindmap elements */
      .diagram-container svg g[id*="mindmap"] {
        animation: slideInUp 0.8s ease-out;
      }
      
      .diagram-container svg g[id*="mindmap"]:nth-child(1) { animation-delay: 0.1s; }
      .diagram-container svg g[id*="mindmap"]:nth-child(2) { animation-delay: 0.2s; }
      .diagram-container svg g[id*="mindmap"]:nth-child(3) { animation-delay: 0.3s; }
      .diagram-container svg g[id*="mindmap"]:nth-child(4) { animation-delay: 0.4s; }
      
      /* Glowing effect for mindmap nodes */
      .diagram-container svg circle,
      .diagram-container svg rect {
        filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.3));
      }
    `}</style>
    </div>
  )
}
