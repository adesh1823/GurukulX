"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Code, Copy, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { GradientText } from "@/components/ui/gradient-text"
import type { JSX } from "react/jsx-runtime"

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(200, 200, 200, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.7);
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.5) rgba(200, 200, 200, 0.3);
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const programmingLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML/CSS" },
]

export default function CodingAssistant() {
  const [query, setQuery] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [displayedResponse, setDisplayedResponse] = useState<string[]>([])
  const [thinkingMode, setThinkingMode] = useState(false)
  const { toast } = useToast()

  // Simulate streaming effect for response
  useEffect(() => {
    if (!response) {
      setDisplayedResponse([])
      return
    }

    const lines = response.split("\n")
    let currentIndex = 0

    // Reset displayed response
    setDisplayedResponse([])

    const interval = setInterval(() => {
      if (currentIndex < lines.length) {
        setDisplayedResponse((prev) => [...prev, lines[currentIndex]])
        currentIndex++

        // Auto-scroll to bottom of response container
        const responseContainer = document.querySelector(".response-container")
        if (responseContainer) {
          responseContainer.scrollTop = responseContainer.scrollHeight
        }
      } else {
        clearInterval(interval)
      }
    }, 50) // Faster typing effect

    return () => clearInterval(interval)
  }, [response])

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter a coding question or problem.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResponse(null)
    setDisplayedResponse([])

    try {
      const res = await fetch("/api/coding-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          language,
          thinkingMode,
        }),
      })

      if (!res.ok) {
        console.error(`API returned status: ${res.status}`)
        throw new Error(`API returned status: ${res.status}`)
      }

      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResponse(data.response)
      toast({
        title: "Code Generated",
        description: `Your coding assistance is ready! ${thinkingMode ? "(Thinking Mode)" : ""}`,
      })
    } catch (error) {
      console.error("Error getting coding assistance:", error)
      toast({
        title: "Error",
        description: "Failed to get coding assistance. Please try again.",
        variant: "destructive",
      })
      setResponse(
        `### Error\n\nFailed to generate a response for your query "${query}" in ${language}. Please check your internet connection or try a different question.`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Custom component to render markdown-like content with streaming and scrolling think box
  const renderContent = (lines: string[]) => {
    const elements: JSX.Element[] = []
    let currentCodeBlock = ""
    let inCodeBlock = false
    let codeLanguage = ""
    let inList = false
    let listItems: JSX.Element[] = []
    let inThinkBlock = false
    let thinkContent: string[] = []

    lines.forEach((line, index) => {
      // Handle <think> tags
      if (line.trim().startsWith("<think>")) {
        inThinkBlock = true
        return
      }
      if (line.trim().startsWith("</think>")) {
        inThinkBlock = false
        elements.push(
          <div
            key={`think-${index}`}
            className="mb-4 p-4 border border-blue-500 rounded-lg bg-blue-50 shadow-md h-48 overflow-y-auto custom-scrollbar"
          >
            <div className="flex flex-col space-y-2">
              {thinkContent.map((thinkLine, i) => (
                <motion.p
                  key={`think-line-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-black leading-relaxed"
                >
                  {thinkLine}
                </motion.p>
              ))}
            </div>
          </div>,
        )
        thinkContent = []
        return
      }
      if (inThinkBlock) {
        thinkContent.push(line)
        return
      }

      // Handle code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${index}`} className="mb-4">
              <div className="text-sm text-gray-600 mb-1 font-medium">{codeLanguage}</div>
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto border">
                <pre className="text-sm">
                  <code className="text-black">{currentCodeBlock}</code>
                </pre>
              </div>
            </div>,
          )
          currentCodeBlock = ""
          inCodeBlock = false
          codeLanguage = ""
        } else {
          inCodeBlock = true
          codeLanguage = line.replace("```", "").trim() || "code"
        }
        return
      }

      if (inCodeBlock) {
        currentCodeBlock += line + "\n"
        return
      }

      // Handle list termination
      if (inList && !line.startsWith("- ") && !line.startsWith("* ") && line.trim() !== "") {
        elements.push(
          <ul key={`list-${index}`} className="list-disc pl-6 mb-4">
            {listItems}
          </ul>,
        )
        listItems = []
        inList = false
      }

      // Handle headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={index}
            className="text-2xl font-bold mb-4 text-black"
          >
            {line.replace("# ", "")}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-xl font-semibold mb-3 text-black">
            {line.replace("## ", "")}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-lg font-medium mb-2 text-black">
            {line.replace("### ", "")}
          </h3>,
        )
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        inList = true
        listItems.push(
          <li key={`item-${index}`} className="mb-1 text-black">
            {line.replace(/^[*-] /, "")}
          </li>,
        )
      } else if (line.trim() === "") {
        if (!inList) {
          elements.push(<div key={index} className="h-2"></div>)
        }
      } else if (line.trim() !== "") {
        elements.push(
          <p key={index} className="mb-3 text-black leading-relaxed">
            {line}
          </p>,
        )
      }
    })

    // Handle remaining list or think content
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key="list-final" className="list-disc pl-6 mb-4">
          {listItems}
        </ul>,
      )
    }
    if (inThinkBlock && thinkContent.length > 0) {
      elements.push(
        <div
          key="think-final"
          className="mb-4 p-4 border border-blue-500 rounded-lg bg-blue-50 shadow-md h-48 overflow-y-auto custom-scrollbar"
        >
          <div className="flex flex-col space-y-2">
            {thinkContent.map((thinkLine, i) => (
              <motion.p
                key={`think-line-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-black leading-relaxed"
              >
                {thinkLine}
              </motion.p>
            ))}
          </div>
        </div>,
      )
    }

    return <div className="prose max-w-none">{elements}</div>
  }

  const sampleQueries = [
    "Create a function to implement binary search in arrays",
    "Explain object-oriented programming with examples",
    "How to handle async/await in JavaScript",
    "Write a Python script for data analysis",
    "Create a REST API endpoint with error handling",
  ]

  return (
    <div className="min-h-screen p-6 bg-white">
      <style jsx global>
        {scrollbarStyles}
      </style>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            AI Coding Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get expert coding help powered by Qwen models</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-black">Ask Your Coding Question</CardTitle>
                <CardDescription className="text-gray-600">
                  Get detailed explanations, code examples, and best practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-black">Programming Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-white text-black border-gray-300 hover:border-gray-400 focus:border-blue-500">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black border-gray-300">
                      {programmingLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="hover:bg-gray-100 text-black">
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-black">Your Question</label>
                  <Textarea
                    placeholder="e.g., How do I implement a binary search algorithm? or Explain the concept of closures in JavaScript..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[150px] bg-white text-black border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting Assistance...
                      </>
                    ) : (
                      <>
                        <Code className="mr-2 h-4 w-4" />
                        Get Coding Help
                      </>
                    )}
                  </Button>
                  <Button
                    disabled
                    title="Coming Soon"
                    className="flex-1 bg-gray-400 text-white flex items-center justify-center cursor-not-allowed opacity-50"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Thinking Mode(Coming Soon)
                  </Button>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 text-black">Sample Questions:</h3>
                  <div className="space-y-2">
                    {sampleQueries.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-3 border-gray-300 text-black hover:bg-gray-50 bg-white"
                        onClick={() => setQuery(sample)}
                      >
                        {sample}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white border border-gray-200 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-black">AI Response</CardTitle>
                <CardDescription className="text-gray-600">Detailed coding assistance and explanations</CardDescription>
              </CardHeader>
              <CardContent className="h-[600px] overflow-y-auto relative response-container custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                    <p className="text-lg font-medium mb-2 text-black">Analyzing your code question...</p>
                    <p className="text-sm text-gray-600">
                      Powered by Qwen {thinkingMode ? "QWQ 32B" : "2.5 Coder 32B"}
                    </p>
                  </div>
                ) : displayedResponse.length > 0 ? (
                  <div className="space-y-4 pr-2 custom-scrollbar">
                    {renderContent(displayedResponse)}
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-black hover:bg-gray-50"
                        onClick={() => {
                          navigator.clipboard.writeText(response || "")
                          toast({
                            title: "Copied",
                            description: "Code response copied to clipboard",
                          })
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Response
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Code className="h-20 w-20 text-gray-400 mb-6" />
                    <h3 className="text-xl font-semibold mb-2 text-black">Ready to Help</h3>
                    <p className="text-gray-600 mb-4 max-w-md">
                      Ask any programming question and get detailed explanations with code examples.
                    </p>
                    <p className="text-sm text-gray-500">
                      Powered by Qwen {thinkingMode ? "QWQ 32B" : "2.5 Coder 32B"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}