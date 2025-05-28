"use client"

import { useState, useEffect } from "react"
import mermaid from "mermaid"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Download, Loader2, Copy, Zap, Info, Users, MessageSquare, Clock, Activity, ArrowBigDownDash, FileCode2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { saveAs } from "file-saver"
import { GradientText } from "@/components/ui/gradient-text"

// Default sequence diagram
const DEFAULT_DIAGRAM = `sequenceDiagram
  participant A as Alice
  participant B as Bob
  A->>B: Hello Bob, how are you?
  B-->>A: Great!
  A-)B: See you later!`

export default function SequenceDiagramGenerator() {
  const [prompt, setPrompt] = useState("")
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_DIAGRAM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [renderedSvg, setRenderedSvg] = useState("")
  const [error, setError] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)

  useEffect(() => {
    // Initialize Mermaid for sequence diagrams
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
      sequence: {
        useMaxWidth: true,
        diagramMarginX: 50,
        diagramMarginY: 10,
        boxTextMargin: 5,
        boxMargin: 10,
        actorMargin: 50,
        actorFontSize: 14,
        actorFontFamily: "Inter, sans-serif",
        messageFontSize: 14,
        messageFontFamily: "Inter, sans-serif",
      },
    })
    renderDiagram(mermaidCode)
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
      setError(err instanceof Error ? err.message : "Failed to render sequence diagram.")
      toast({
        title: "Render Error",
        description:
          "Invalid Mermaid sequence diagram code. Ensure it starts with 'sequenceDiagram', defines participants, and uses correct message syntax (e.g., A->>B: Message).",
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
          "Please enter a description of the sequence diagram you want to create (e.g., user authentication flow, API interaction).",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/sequencediagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate sequence diagram")
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setMermaidCode(data.diagram)
      await renderDiagram(data.diagram)

      toast({
        title: "Sequence diagram generated",
        description: "Your sequence diagram has been generated successfully using Groq Llama 3.3",
      })
    } catch (error) {
      console.error("Error generating sequence diagram:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate sequence diagram. Please try again.",
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
        title: "No sequence diagram to export",
        description: "Please generate or create a valid sequence diagram first",
        variant: "destructive",
      })
      return
    }

    const svgBlob = new Blob([renderedSvg], { type: "image/svg+xml;charset=utf-8" })
    const filename = `sequence-diagram-${Date.now()}.svg`
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
      description: "Mermaid sequence diagram code copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-center">
                <GradientText>GX Sequence Diagram Generator</GradientText><span className="text-yellow-500"> (Beta)</span>
              </h1>
              <p className="text-sm text-slate-400">Powered by GurukulX-1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportSvg}
              variant="outline"
              className="bg-slate-800/80 border-slate-600/50 text-slate-200 hover:bg-slate-700/80"
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
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                AI Prompt
              </h2>
              <div className="space-y-4">
                <Input
                  placeholder="Describe your sequence diagram (e.g., user authentication flow, API interaction...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-emerald-400"
                />
                <Button
                  onClick={generateDiagram}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating with GurukulX...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Sequence Diagram
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 animate-pulse"></span>
                  Mermaid Sequence Diagram Code
                </h2>
                <Button
                  onClick={copyCode}
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/80 border-slate-600/50 text-slate-200 hover:bg-slate-700/80"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={mermaidCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Enter your Mermaid sequence diagram code here..."
                className="min-h-[400px] font-mono text-sm bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>
              Sequence Diagram Preview
            </h2>
            <div className="bg-slate-950/90 border border-slate-700/50 rounded-lg p-6 min-h-[600px] flex items-center justify-center relative overflow-hidden">
              {/* Futuristic Loading Animation */}
              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="w-32 h-32 border-4 border-transparent border-t-purple-500 border-r-blue-500 rounded-full animate-spin"></div>

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 w-24 h-24 border-2 border-transparent border-t-emerald-400 border-l-cyan-400 rounded-full animate-spin animate-reverse"></div>

                    {/* Center glowing dot */}
                    <div className="absolute inset-1/2 w-4 h-4 -ml-2 -mt-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>

                    {/* Scanning lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rotate-90">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse delay-300"></div>
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
                    <div className="text-cyan-400 font-mono text-sm mb-2 animate-pulse">
                      Rendering Sequence Diagram...
                    </div>
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
                <div className="text-center animate-fadeIn">
                  <div className="text-red-400 mb-2">⚠️ Render Error</div>
                  <pre className="text-red-300 text-sm bg-red-900/20 p-4 rounded border border-red-800/50 max-w-md">
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
                <div className="text-slate-400 text-center animate-fadeIn">
                  <div className="text-4xl mb-4 animate-bounce">📊</div>
                  <p>Your sequence diagram will appear here</p>
                  <div className="mt-4 text-xs text-slate-500">Generate or edit code to see the magic happen</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl mb-6 pt-2">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">About Sequence Diagrams</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Sequence diagrams are powerful visual tools that illustrate how different entities (participants)
                interact with each other over time. They show the order of messages exchanged between participants,
                making them perfect for documenting APIs, user flows, and system interactions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                  <Users className="h-8 w-8 text-emerald-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Participants</h3>
                  <p className="text-sm text-slate-400">Actors, systems, or objects that interact</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                  <MessageSquare className="h-8 w-8 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Messages</h3>
                  <p className="text-sm text-slate-400">Communications between participants</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                  <Clock className="h-8 w-8 text-purple-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Timeline</h3>
                  <p className="text-sm text-slate-400">Chronological order of interactions</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                <Activity className="h-8 w-8 text-orange-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Activations</h3>
                <p className="text-sm text-slate-400">Periods when participants are actively performing actions</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                <ArrowBigDownDash className="h-8 w-8 text-red-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Deactivations</h3>
                <p className="text-sm text-slate-400">Ending points of active participant execution</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                <FileCode2 className="h-8 w-8 text-yellow-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Diagram Code</h3>
                <p className="text-sm text-slate-400">Editable code that defines your sequence diagram</p>
                </div>
                
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Example Diagrams</h3>
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                  <img
                    src="/seq2.png"
                    alt="Simple sequence diagram example with Alice and Bob"
                    className="w-full rounded border border-slate-600/30 mb-2"
                  />
                  <p className="text-xs text-slate-400">Simple two-participant interaction</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                  <img
                    src="/sequence.png"
                    alt="Complex sequence diagram with multiple participants"
                    className="w-full rounded border border-slate-600/30 mb-2"
                  />
                  <p className="text-xs text-slate-400">Multi-participant conversation flow</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">
              <GradientText>⚡ Ultra-Fast AI-Powered Sequence Diagram Generation</GradientText>
            </h3>
            <p className="text-slate-300 mb-4">
              Create professional sequence diagrams instantly using GurukulX's lightning-fast model. Simply
              describe the interaction, and watch as AI generates beautiful Mermaid sequence diagrams.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center text-emerald-400">
                <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></span>
                GurukulX-1.0
              </div>
              <div className="flex items-center text-indigo-400">
                <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                Real-time Preview
              </div>
              <div className="flex items-center text-purple-400">
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
      
      @keyframes slideInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes slideInRight {
        from { 
          opacity: 0; 
          transform: translateX(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.8s ease-out;
      }
      
      .animate-slideInUp {
        animation: slideInUp 1s ease-out;
      }
      
      .animate-slideInLeft {
        animation: slideInLeft 0.8s ease-out;
      }
      
      .animate-slideInRight {
        animation: slideInRight 0.8s ease-out;
      }
      
      .animate-reverse {
        animation-direction: reverse;
      }
      
      /* Staggered animation for diagram elements */
      .diagram-container svg .actor {
        animation: slideInUp 0.6s ease-out;
      }
      
      .diagram-container svg .actor:nth-child(1) { animation-delay: 0.1s; }
      .diagram-container svg .actor:nth-child(2) { animation-delay: 0.2s; }
      .diagram-container svg .actor:nth-child(3) { animation-delay: 0.3s; }
      .diagram-container svg .actor:nth-child(4) { animation-delay: 0.4s; }
      
      .diagram-container svg .messageLine0,
      .diagram-container svg .messageLine1 {
        animation: slideInLeft 0.8s ease-out;
        animation-delay: 0.5s;
        animation-fill-mode: both;
      }
      
      .diagram-container svg .messageText {
        animation: fadeIn 1s ease-out;
        animation-delay: 0.7s;
        animation-fill-mode: both;
      }
      
      /* Glowing effect for active elements */
      .diagram-container svg .actor rect {
        filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
      }
      
      .diagram-container svg .messageLine0,
      .diagram-container svg .messageLine1 {
        filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4));
      }
    `}</style>
    </div>
  )
}
