
import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Brain,
  Lightbulb,
  Calculator,
  BookOpen,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  Trash2,
  Sparkles,
} from "lucide-react"
import { GradientText } from "./ui/gradient-text"

interface AIMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: number
}

interface AIAssistantProps {
  showAiPanel: boolean
  setShowAiPanel: (show: boolean) => void
  exportWhiteboardData: () => any
}

export function AIAssistant({ showAiPanel, setShowAiPanel, exportWhiteboardData }: AIAssistantProps) {
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your AI teaching assistant. I can help with lesson planning, content explanation, solving doubts, and analyzing your whiteboard content. How can I assist you today?",
      timestamp: Date.now(),
    },
  ])
  const [aiInput, setAiInput] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [aiMode, setAiMode] = useState("general")
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  
  const { toast } = useToast()

  const aiModes = [
    { id: "general", label: "General Help", icon: Brain },
    { id: "lesson_suggestion", label: "Lesson Ideas", icon: Lightbulb },
    { id: "content_help", label: "Content Help", icon: BookOpen },
    { id: "doubt_solving", label: "Solve Doubts", icon: HelpCircle },
    { id: "formula_recognition", label: "Math/Science", icon: Calculator },
  ]

  // AI Functions - Updated to use API routes
  const sendAiMessage = async () => {
    if (!aiInput.trim()) return

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

    try {
      const whiteboardData = exportWhiteboardData()
      const response = await fetch("/api/whiteboard/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          context: `Current whiteboard has ${whiteboardData.metadata.totalStrokes} strokes and ${whiteboardData.metadata.totalTexts} text elements. Background: ${whiteboardData.metadata.background}.`,
          type: aiMode,
        }),
      })

      const data = await response.json()

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response || "I'm sorry, I couldn't process your request right now. Please try again.",
        timestamp: Date.now(),
      }

      setAiMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI Error:", error)
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: Date.now(),
      }
      setAiMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAiLoading(false)
    }
  }

  // Voice recording - Updated
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
          }
        } catch (error) {
          console.error("Speech-to-text error:", error)
          toast({
            title: "Voice Recognition Error",
            description: "Could not convert speech to text",
            variant: "destructive",
          })
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)

      toast({
        title: "Recording Started",
        description: "Speak your question now...",
      })

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

  // Text-to-speech - Updated
  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true)

      // Try using the API first
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
      toast({
        title: "Speech Error",
        description: "Failed to generate speech",
        variant: "destructive",
      })
    }
  }

  // Capture whiteboard for AI analysis - Updated
  const captureWhiteboard = async () => {
    try {
      const canvas = document.querySelector('canvas')
      if (!canvas) return

      const dataUrl = canvas.toDataURL("image/png")

      const response = await fetch("/api/whiteboard/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: dataUrl,
          prompt: "Analyze this whiteboard content and provide educational insights.",
        }),
      })

      const data = await response.json()

      const aiMessage: AIMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: `📸 **Whiteboard Analysis:**\n\n${data.analysis}`,
        timestamp: Date.now(),
      }

      setAiMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Vision analysis error:", error)
      toast({
        title: "Analysis Error",
        description: "Could not analyze whiteboard content",
        variant: "destructive",
      })
    }
  }

  return (
    <AnimatePresence>
      {showAiPanel && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col z-30 shadow-lg"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <GradientText className="text-gradient-to-r from-purple-500 to-blue-500">GurukulX-1.0</GradientText>
              </h3>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.type === "assistant" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(message.content)}
                      className="mt-2 h-6 p-1"
                      disabled={isSpeaking}
                    >
                      {/* {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />} */}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}

            {isAiLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    <span className="text-sm text-purple-400">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 mb-2">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className="h-8 w-8 p-0"
                title={isRecording ? "Stop Recording" : "Voice Input"}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={captureWhiteboard}
                title="Analyze Whiteboard"
              >
                <Camera className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setAiMessages([aiMessages[0]]) // Keep welcome message
                  toast({
                    title: "Chat Cleared",
                    description: "AI conversation history cleared",
                  })
                }}
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask AI for help..."
                className="flex-1 min-h-[40px] max-h-[120px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendAiMessage()
                  }
                }}
              />
              <Button onClick={sendAiMessage} disabled={!aiInput.trim() || isAiLoading} className="h-10 w-10 p-0">
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
