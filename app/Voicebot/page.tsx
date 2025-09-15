"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import "@livekit/components-styles"

// Message component for chat display with Indian educational theme ok
const Message: React.FC<{ type: "agent" | "user"; text: string }> = ({ type, text }) => {
  return (
    <div className="flex items-start space-x-3 mb-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
          type === "agent" ? "bg-orange-500" : "bg-green-600"
        }`}
      >
        {type === "agent" ? "🎓" : "👤"}
      </div>
      <div
        className={`flex-1 p-3 rounded-lg ${
          type === "agent" ? "bg-orange-50 border-l-4 border-orange-500" : "bg-green-50 border-l-4 border-green-600"
        }`}
      >
        <p className="text-gray-800 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}

// Voice Assistant Component with clean Indian educational design
const VoiceAssistantInterface: React.FC = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant()
  const localParticipant = useLocalParticipant()
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  })

  const [messages, setMessages] = useState<
    Array<{ id?: string; text: string; type: "agent" | "user"; firstReceivedTime: number }>
  >([])

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" as const })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" as const })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime)
    setMessages(allMessages)
  }, [agentTranscriptions, userTranscriptions])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
      <div className="bg-gradient-to-r from-orange-500 to-green-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">🎓 Educational Voice Assistant</h2>
            <p className="text-orange-100 mt-1">शिक्षा आवाज सहायक - Learning Made Easy</p>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              state === "listening"
                ? "bg-green-500 text-white"
                : state === "thinking"
                  ? "bg-yellow-500 text-gray-800"
                  : state === "speaking"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-800"
            }`}
          >
            {state === "listening"
              ? "🎤 Listening"
              : state === "thinking"
                ? "🤔 Thinking"
                : state === "speaking"
                  ? "🗣️ Speaking"
                  : "✅ Ready"}
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-6 border-b border-orange-200">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md">
            <BarVisualizer state={state} barCount={12} trackRef={audioTrack} className="h-16" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
        <VoiceAssistantControlBar />
        <p className="text-sm text-gray-600 mt-2 text-center">
          <span className="font-semibold">📚 Learn:</span> Ask any academic question, get interview preparation, or seek study guidance from Professor Alex.
        </p>
      </div>

      <div ref={chatContainerRef} className="h-96 overflow-y-auto p-6 bg-white">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🎓</span>
            </div>
            <p className="text-xl font-semibold mb-2 text-orange-600">Welcome to Educational Voice Assistant</p>
            <p className="text-lg mb-2 text-green-600">शिक्षा आवाज सहायक में आपका स्वागत है</p>
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600 font-semibold">📖 Academic Help</span>
                <p className="text-gray-600 mt-1">Math, Science, Languages, History</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-600 font-semibold">💼 Interview Prep</span>
                <p className="text-gray-600 mt-1">Technical & Behavioral Questions</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-semibold">📚 Study Methods</span>
                <p className="text-gray-600 mt-1">Learning Techniques & Strategies</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-purple-600 font-semibold">🏫 Teaching Support</span>
                <p className="text-gray-600 mt-1">Lesson Planning & Classroom Tips</p>
              </div>
            </div>
            <p className="text-sm mt-4 text-gray-500">
              🗣️ Start speaking or ask: "Explain photosynthesis" or "Help me prepare for a job interview"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <Message key={msg.id || index} type={msg.type} text={msg.text} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const EducationalAssistantPage: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const connectToAgent = useCallback(async () => {
    setIsConnecting(true)
    try {
      const userName = `student-${Math.random().toString(36).substring(7)}`
      const response = await fetch(
        `https://aravsaxena884-GurukulVoice.hf.space/getToken?name=${encodeURIComponent(userName)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to get token")
      }

      const tokenData = await response.text()
      setToken(tokenData)
      setIsConnected(true)
    } catch (error) {
      console.error("Connection error:", error)
      alert("Failed to connect to educational assistant. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectFromAgent = useCallback(() => {
    setIsConnected(false)
    setToken(null)
  }, [])

  if (isConnected && token) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Indian flag colors border */}
        <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
        
        <div className="container mx-auto px-4 py-8">
          <a
            href="/"
            className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </a>

          <LiveKitRoom
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://app-zq7e4mya.livekit.cloud"}
            token={token}
            connect={true}
            video={false}
            audio={true}
            onDisconnected={disconnectFromAgent}
            className="w-full"
          >
            <RoomAudioRenderer />
            <VoiceAssistantInterface />
          </LiveKitRoom>
        </div>
        
        <div className="absolute top-6 right-6">
          <button 
            onClick={disconnectFromAgent}
            className="text-gray-600 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Bottom flag border */}
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Indian flag colors header */}
      <div className="h-3 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
      
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl">🎓</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              Educational Voice Assistant
            </h1>
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">
              शिक्षा आवाज सहायक
            </h2>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Your AI-powered mentor for academic learning, interview preparation, and educational guidance
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              शैक्षणिक शिक्षा, साक्षात्कार की तैयारी और शैक्षिक मार्गदर्शन के लिए आपका AI-संचालित गुरु
            </p>
            
            <button
              onClick={connectToAgent}
              disabled={isConnecting}
              className="px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isConnecting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Connecting...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <span>🗣️ Start Voice Learning</span>
                </span>
              )}
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-all duration-300">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-semibold mb-2 text-orange-600">Mathematics</h3>
              <p className="text-gray-600 text-sm">Algebra, Calculus, Statistics, Geometry</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">Sciences</h3>
              <p className="text-gray-600 text-sm">Physics, Chemistry, Biology, Computer Science</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-300">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Interview Prep</h3>
              <p className="text-gray-600 text-sm">Technical, Behavioral, Mock Interviews</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300">
              <div className="text-4xl mb-3">🏫</div>
              <h3 className="text-lg font-semibold mb-2 text-purple-600">Teaching Support</h3>
              <p className="text-gray-600 text-sm">Lesson Plans, Classroom Management</p>
            </div>
          </div>

          {/* Subject Areas */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold mb-4 text-orange-700">📖 Academic Subjects</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Languages & Literature</li>
                <li>• History & Social Studies</li>
                <li>• Business & Economics</li>
                <li>• Engineering Basics</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold mb-4 text-green-700">🎯 Study Skills</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Effective Learning Techniques</li>
                <li>• Exam Preparation Strategies</li>
                <li>• Time Management</li>
                <li>• Research & Citation</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">💡 Career Guidance</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Resume & Portfolio Tips</li>
                <li>• Confidence Building</li>
                <li>• Industry Insights</li>
                <li>• Professional Development</li>
              </ul>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="bg-gradient-to-r from-orange-50 via-white to-green-50 rounded-xl p-8 border-2 border-orange-200 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">💬 Try Asking:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="bg-white p-3 rounded-lg border border-orange-200 text-gray-700">
                  "Explain the concept of photosynthesis"
                </p>
                <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-700">
                  "Help me solve this algebra problem"
                </p>
                <p className="bg-white p-3 rounded-lg border border-blue-200 text-gray-700">
                  "Prepare me for a technical interview"
                </p>
              </div>
              <div className="space-y-2">
                <p className="bg-white p-3 rounded-lg border border-purple-200 text-gray-700">
                  "What are effective study techniques?"
                </p>
                <p className="bg-white p-3 rounded-lg border border-orange-200 text-gray-700">
                  "Explain quantum physics simply"
                </p>
                <p className="bg-white p-3 rounded-lg border border-green-200 text-gray-700">
                  "How do I improve my presentation skills?"
                </p>
              </div>
            </div>
          </div>

          {/* Educational Notice */}
          <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200 text-blue-800 max-w-3xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <h4 className="font-semibold mb-2">Educational Support Notice</h4>
                <p className="text-sm">
                  Professor Alex provides educational guidance and information. For formal academic credit or official certification, 
                  please consult with your educational institutions. Always verify important information through official academic sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom flag border */}
      <div className="h-3 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
    </div>
  )
}

export default EducationalAssistantPage