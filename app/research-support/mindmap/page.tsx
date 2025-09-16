"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Download, Loader2, Copy, Zap, Info, Brain, Network, Lightbulb } from "lucide-react"

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

// Mock toast function for demo
const toast = ({ title : string , description : string, variant : string }) => {
  console.log(`${variant || 'info'}: ${title} - ${description}`)
}

// Mock GradientText component
const GradientText = ({ children }) => (
  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
    {children}
  </span>
)

export default function MindmapGenerator() {
  const [prompt, setPrompt] = useState("")
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_DIAGRAM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [renderedSvg, setRenderedSvg] = useState("")
  const [error, setError] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)

  useEffect(() => {
    // Mock mermaid initialization
    const initializeMermaid = async () => {
      try {
        // Simulate mermaid rendering
        setRenderedSvg('<svg width="200" height="100"><rect width="200" height="100" fill="#374151" rx="8"/><text x="100" y="55" text-anchor="middle" fill="#fff" font-family="Arial">Sample Mindmap</text></svg>')
        setShowDiagram(true)
      } catch (err) {
        console.error("Mermaid initialization error:", err)
        setError("Failed to initialize Mermaid for mindmaps.")
      }
    }
    initializeMermaid()
  }, [])

  const renderDiagram = async (code : any) => {
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

      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Mock SVG generation
      const svg = '<svg width="300" height="200"><rect width="300" height="200" fill="#1f2937" rx="8"/><text x="150" y="100" text-anchor="middle" fill="#fff" font-family="Arial">Generated Mindmap</text></svg>'
      setRenderedSvg(svg)

      setTimeout(() => {
        setIsAnimating(false)
        setShowDiagram(true)
      }, 500)
    } catch (err) {
      console.error("Mermaid rendering error:", err)
      setError("Failed to render mindmap. Please check your syntax.")
      setRenderedSvg("")
      setIsAnimating(false)
      setShowDiagram(false)
    }
  }

  const generateDiagram = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of the mindmap you want to create.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockDiagram = `mindmap
  root((${prompt}))
    Main Branch
      Sub Item 1
      Sub Item 2
    Secondary Branch
      Another Item
      Final Item`
      
      setMermaidCode(mockDiagram)
      await renderDiagram(mockDiagram)

      toast({
        title: "Mindmap generated",
        description: "Your mindmap has been generated successfully using GurukulX-1.0",
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating mindmap:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate mindmap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCodeChange = (newCode : any) => {
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

    // Mock export
    toast({
      title: "Export successful",
      description : `Saved as mindmap-${Date.now()}.svg`,
      variant: "default",
    })
  }

  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode)
    toast({
      title: "Code copied",
      description: "Mermaid mindmap code copied to clipboard",
      variant: "default",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-orange-200 backdrop-blur-xl bg-white/90 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-green-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <GradientText>GX Mindmap Generator</GradientText>
                <span className="text-green-600 ml-2">(Beta)</span>
              </h1>
              <p className="text-sm text-orange-600">Powered by GurukulX-1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportSvg}
              variant="outline"
              className="bg-white/80 border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 hover:border-orange-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Export SVG
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* AI Prompt Section */}
            <div className="bg-white/80 backdrop-blur-xl border border-orange-200 rounded-xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                AI Prompt
              </h2>
              <div className="space-y-4">
                <Input
                  placeholder="Describe your mindmap (e.g., machine learning concepts, project management workflow...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
                />
                <Button
                  onClick={generateDiagram}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white border-0 shadow-lg disabled:opacity-50"
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
            <div className="bg-white/80 backdrop-blur-xl border border-orange-200 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                  Mermaid Code
                </h2>
                <Button
                  onClick={copyCode}
                  variant="outline"
                  size="sm"
                  className="bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={mermaidCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Enter your Mermaid mindmap code here..."
                className="min-h-[400px] font-mono text-sm bg-gray-50 border-gray-200 text-green-700 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400/20"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white/80 backdrop-blur-xl border border-orange-200 rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Mindmap Preview
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[600px] flex items-center justify-center relative overflow-hidden">
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
                  <div className="absolute bottom-20 text-center">
                    <div className="text-orange-600 font-mono text-sm mb-2 animate-pulse">Rendering Mindmap...</div>
                    <div className="flex space-x-1 justify-center">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 200}ms` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isAnimating && (
                <div className="text-center animate-fadeIn">
                  <div className="text-red-600 mb-2 text-lg">⚠️ Render Error</div>
                  <pre className="text-red-700 text-sm bg-red-50 p-4 rounded border border-red-200 max-w-md">
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
                <div className="text-gray-600 text-center animate-fadeIn">
                  <div className="text-4xl mb-4 animate-bounce">🧠</div>
                  <p className="text-lg text-gray-900 mb-2">Your mindmap will appear here</p>
                  <div className="mt-4 text-sm text-gray-500">Generate or edit code to see the magic happen</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Educational Section */}
        <div className="bg-white/70 backdrop-blur-xl border border-orange-200 rounded-xl p-6 shadow-2xl mb-6 mt-6">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">About Mindmaps</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Mindmaps are visual thinking tools that help organize information hierarchically around a central
                concept. They mirror how our brains naturally process information, making them perfect for
                brainstorming, note-taking, project planning, and knowledge mapping.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <Brain className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Central Topic</h3>
                  <p className="text-sm text-gray-600">Main idea at the center</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <Network className="h-8 w-8 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Branches</h3>
                  <p className="text-sm text-gray-600">Related subtopics radiating out</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <Lightbulb className="h-8 w-8 text-yellow-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Keywords</h3>
                  <p className="text-sm text-gray-600">Key concepts and ideas</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-3">Perfect for:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Brainstorming sessions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Project planning
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Study notes organization
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Knowledge mapping
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  Decision making
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                  Creative thinking
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white/70 backdrop-blur-xl border border-orange-200 rounded-xl p-6 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <GradientText>⚡ Ultra-Fast AI-Powered Mindmap Generation</GradientText>
            </h3>
            <p className="text-gray-700 mb-4">
              Create professional mindmaps instantly using GurukulX's lightning-fast model. Simply describe your
              concept, and watch as AI generates beautiful Mermaid mindmaps with enhanced styling.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center text-green-600">
                <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                GurukulX-1.0
              </div>
              <div className="flex items-center text-orange-600">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                Real-time Preview
              </div>
              <div className="flex items-center text-blue-600">
                <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
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