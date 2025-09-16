"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Bot, Brain, Sparkles, Lightbulb, Zap, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { GradientText } from "@/components/ui/gradient-text"

export default function QuestionPaperGenerator() {
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState("mathematics")
  const [thinkingMode, setThinkingMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = async () => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      toast({
        title: "Empty input",
        description: "Please enter a valid query for question paper generation.",
        variant: "destructive",
      })
      return
    }

    if (!subject) {
      toast({
        title: "No subject selected",
        description: "Please select an academic subject.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/professor-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery, subject, thinkingMode }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      // Store the query parameters and response in localStorage
      localStorage.setItem("paperQuery", trimmedQuery)
      localStorage.setItem("paperSubject", subject)
      localStorage.setItem("paperThinkingMode", thinkingMode.toString())
      localStorage.setItem("paperResponse", data.response)

      toast({
        title: "Question Paper Generated",
        description: "Your question paper has been generated successfully.",
      })

      // Redirect to the editor page
      router.push("/student-engagement/chatbot/editor")
    } catch (error) {
      console.error("Error generating question paper:", error)
      toast({
        title: "Error",
        description: `Failed to generate question paper: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const sampleQueries = [
    {
      text: "Generate a question paper for Calculus with 10 questions",
      subject: "mathematics",
    },
    {
      text: "Create a set of exam questions for Organic Chemistry",
      subject: "chemistry",
    },
    {
      text: "Design a question paper for Modern Indian History",
      subject: "history",
    },
    {
      text: "Prepare a question paper for Quantum Mechanics",
      subject: "physics",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-border {
          animation: pulse 2s infinite;
        }
        .gradient-border {
          position: relative;
          border-radius: 0.75rem;
          padding: 1px;
          background: linear-gradient(60deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
        }
        .gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          padding: 1px;
          background: linear-gradient(60deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .glass-card {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 
            0 4px 30px rgba(0, 0, 0, 0.1),
            inset 0 0 1px 1px rgba(59, 130, 246, 0.1);
        }
      `}</style>

      <div className="container mx-auto py-8 px-4 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <GradientText>Question Paper Generator</GradientText> <span className="text-blue-500">(Beta)</span>
          </h2>
          <p className="text-black max-w-2xl mx-auto">
            Create and edit professional question papers with advanced mathematical notations and AI assistance
            <span className="text-blue-500"> some editor features are under testing</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <div className="gradient-border">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-black flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-blue-400" />
                  Generate Question Paper
                </CardTitle>
                <CardDescription className="text-black">
                  Enter your requirements to generate a question paper.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-black mb-1 block">Subject</label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="w-full bg-gray-50/80 border-gray-300 text-black focus:ring-blue-400">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50 border-gray-300 text-black">
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="computer_science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-black mb-1 block">Query</label>
                  <Input
                    placeholder="Type your question paper requirements..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="bg-gray-50/80 border-gray-300 text-black placeholder-gray-400 focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center">
                  <Button
                    disabled
                    variant={thinkingMode ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-1 cursor-not-allowed opacity-50 ${
                      thinkingMode
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
                        : "border-gray-300 text-black"
                    }`}
                  >
                    <Brain className="h-4 w-4" />
                    {thinkingMode ? "Thinking Mode(soon)" : "Thinking Mode(soon)"}
                  </Button>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !query.trim()}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                >
                  <span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-400/30 to-blue-600/0 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"
                    style={{ transform: "skewX(-20deg)", top: "-100%", left: "-100%", transition: "0.5s" }}
                  ></span>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      Generate Question Paper
                    </>
                  )}
                </Button>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <h3 className="text-sm font-medium text-black mb-2">Sample Queries</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {sampleQueries.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-3 border-gray-300 bg-gray-50/80 text-black hover:bg-gray-100 hover:text-black transition-all duration-200"
                        onClick={() => {
                          setQuery(sample.text)
                          setSubject(sample.subject)
                        }}
                      >
                        <Lightbulb className="h-4 w-4 mr-2 text-blue-400" />
                        {sample.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-black flex items-center">
            <ArrowRight className="h-4 w-4 mr-2" />
            After generation, you'll be taken to the editor page
          </p>
        </motion.div>
      </div>
    </div>
  )
}