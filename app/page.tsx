"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
  Code,
  Brain,
  Lightbulb,
  Zap,
  Github,
  Linkedin,
  Mail,
  Heart,
  Coffee,
  Rocket,
  Star,
  Globe,
  MessageCircle,
  PenTool,
  FileQuestion,
  Presentation,
  ClipboardList,
  Search,
  FileCheck,
  GitBranch,
  Bot,
  Smile,
  Network,
  Trophy,
  PartyPopper,
  Wand2,
  Sparkle,
  Crown,
  Sun,
  GraduationCap,
} from "lucide-react"
import { useState, useEffect } from "react"

// Skills data for scroll
const skills = [
  { icon: Code, name: "React/Next.js", color: "from-blue-500 to-cyan-500" },
  { icon: Brain, name: "AI/ML", color: "from-purple-500 to-pink-500" },
  { icon: FileText, name: "Node.js", color: "from-green-500 to-emerald-500" },
  { icon: Sparkles, name: "Python", color: "from-yellow-500 to-orange-500" },
  { icon: GitBranch, name: "TypeScript", color: "from-blue-600 to-purple-600" },
  { icon: Bot, name: "Agentic AI", color: "from-teal-500 to-blue-500" },
  { icon: Rocket, name: "Vercel", color: "from-gray-700 to-gray-900" },
  { icon: Globe, name: "Full Stack", color: "from-indigo-500 to-purple-500" },
  { icon: Network, name: "MCP Tool", color: "from-indigo-500 to-purple-500" },
]

// Teacher quotes
const teacherQuotes = [
  "Empowering minds, transforming futures ✨",
  "Education is the most powerful weapon to change the world 📚",
  "Every student has the potential to excel 🌟",
  "Teaching is the profession that creates all other professions 🎓",
  "Knowledge shared is knowledge multiplied 💡",
  "Building tomorrow's leaders today 🚀",
  "Every lesson shapes a brighter future 📖",
  "Inspiring excellence in every classroom 💪",
  "Education opens doors to endless possibilities 🔑",
  "Creating impact through quality education 🎯",
]

// Mood boosters
const moodBoosters = [
  {
    title: "You're Making a Difference! 🌟",
    message:
      "Your dedication to education is building the foundation of tomorrow. Every lesson you teach creates ripples of knowledge across generations!",
    icon: Crown,
    color: "from-orange-400 via-red-500 to-pink-500",
  },
  {
    title: "Coffee & Courage! ☕",
    message:
      "Take a moment with your coffee to appreciate the incredible educator you are. You're shaping the future, one student at a time!",
    icon: Coffee,
    color: "from-amber-600 via-orange-500 to-yellow-400",
  },
  {
    title: "Lighting Up Minds! 💡",
    message:
      "Like a beacon that lights up the darkness, you illuminate young minds with knowledge and wisdom. Your impact is immeasurable!",
    icon: Lightbulb,
    color: "from-yellow-400 via-orange-500 to-red-500",
  },
  {
    title: "Teaching with Heart! 💖",
    message:
      "Your love for teaching and dedication to students doesn't go unnoticed. You're the backbone of our educational system!",
    icon: Heart,
    color: "from-pink-400 via-red-500 to-orange-500",
  },
  {
    title: "Celebration Time! 🎉",
    message:
      "Every breakthrough moment, every 'aha!' expression on a student's face - they all deserve celebration. You're absolutely amazing!",
    icon: PartyPopper,
    color: "from-green-400 via-blue-500 to-purple-500",
  },
  {
    title: "Knowledge Champion! ⚔️",
    message:
      "You are a champion of knowledge, fighting ignorance and building a brighter future. Your mission is noble and impactful!",
    icon: Wand2,
    color: "from-blue-400 via-indigo-500 to-purple-500",
  },
]

// Teaching facts
const teachingFacts = [
  "You inspire 30+ minds daily! 🧠✨",
  "Your patience builds the future! 💪",
  "You make learning engaging! 🎯",
  "Coffee fuels your dedication! ☕⚡",
  "You're a knowledge champion! 🏆📚",
  "Creativity flows through your lessons! 🎨",
  "You turn challenges into opportunities! 💡",
  "Your smile brightens classrooms! 😊☀️",
  "You're building tomorrow's leaders! 🚀",
  "Teaching is your superpower! 🦸‍♀️",
]

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentMoodBooster, setCurrentMoodBooster] = useState(0)
  const [currentFact, setCurrentFact] = useState(0)

  const Icon = moodBoosters[currentMoodBooster].icon

  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Rotate quotes every 4 seconds
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % teacherQuotes.length)
    }, 4000)

    // Rotate mood boosters every 6 seconds
    const moodTimer = setInterval(() => {
      setCurrentMoodBooster((prev) => (prev + 1) % moodBoosters.length)
    }, 6000)

    // Rotate teaching facts every 3 seconds
    const factTimer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % teachingFacts.length)
    }, 3000)

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearInterval(quoteTimer)
      clearInterval(moodTimer)
      clearInterval(factTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ff6b35' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='0' cy='30' r='4'/%3E%3Ccircle cx='60' cy='30' r='4'/%3E%3Ccircle cx='30' cy='0' r='4'/%3E%3Ccircle cx='30' cy='60' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="text-center">
            {/* Brand Header */}
            <div className="mb-8">
              <div className="flex justify-center items-center gap-2 mb-6">
                <div className="w-8 h-2 bg-orange-500 rounded"></div>
                <div className="w-8 h-2 bg-white border border-gray-300 rounded"></div>
                <div className="w-8 h-2 bg-green-600 rounded"></div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                  GurukulX
                </span>
              </h1>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span>AI-Powered Teaching Assistant for India</span>
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>

            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-6 md:mb-8 max-w-4xl mx-auto px-4 font-medium">
              Revolutionize Your Teaching with AI
            </p>

            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto px-4 leading-relaxed">
              Designed specifically for Indian college educators. Create AI-powered lesson plans, generate content, and
              access personalized teaching tools that enhance your classroom experience.
            </p>

            {/* Current Quote Display */}
            <div className="mb-8 px-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200/50 to-yellow-200/50 rounded-2xl blur-xl"></div>
                <p className="relative text-sm sm:text-base md:text-lg text-gray-700 font-medium px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200 shadow-lg">
                  {teacherQuotes[currentQuote]}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 mb-12">
              <Link href="/lesson-planning">
                <Button
                  size={isMobile ? "default" : "lg"}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-xl"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size={isMobile ? "default" : "lg"}
                  variant="outline"
                  className="w-full sm:w-auto border-orange-300 text-orange-700 hover:bg-orange-50 shadow-lg bg-transparent"
                >
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-200 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">10+</div>
                <div className="text-xs md:text-sm text-gray-600">AI Tools</div>
                <div className="text-lg">🤖</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-200 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">1000+</div>
                <div className="text-xs md:text-sm text-gray-600">Teachers</div>
                <div className="text-lg">👩‍🏫</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">24/7</div>
                <div className="text-xs md:text-sm text-gray-600">Support</div>
                <div className="text-lg">🛟</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Mood Booster Section */}
      <section className="py-12 md:py-20 px-4 relative overflow-hidden bg-gradient-to-b from-orange-50/50 to-yellow-50/50">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 px-4">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-yellow-600 bg-clip-text text-transparent">
                ✨ Teacher Appreciation Hub ✨
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Because every teacher deserves daily recognition, encouragement, and moments of inspiration! 🌟💖
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Main Mood Booster Card */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 relative overflow-hidden group h-full min-h-[350px] md:min-h-[400px] border border-orange-200 shadow-xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${moodBoosters[currentMoodBooster].color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10 text-center h-full flex flex-col justify-center">
                  <div
                    className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${moodBoosters[currentMoodBooster].color} flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl`}
                  >
                    <Icon className="h-8 w-8 md:h-12 md:w-12 text-white" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                    {moodBoosters[currentMoodBooster].title}
                  </h3>

                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8 px-2 md:px-4">
                    {moodBoosters[currentMoodBooster].message}
                  </p>

                  <button
                    className={`mx-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${moodBoosters[currentMoodBooster].color} text-white rounded-full font-semibold hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                  >
                    <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                      <Sparkle className="h-4 w-4 md:h-5 md:w-5" />
                      Spread the Joy!
                      <PartyPopper className="h-4 w-4 md:h-5 md:w-5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Fun Zone */}
            <div className="space-y-4 md:space-y-6">
              {/* Teaching Facts Ticker */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 relative overflow-hidden group border border-blue-200 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 group-hover:from-blue-200/50 group-hover:to-purple-200/50 transition-all duration-300"></div>
                <div className="relative z-10">
                  <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-center flex items-center justify-center gap-2">
                    <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Quick Teacher Facts
                    </span>
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </h4>
                  <div className="text-center text-lg md:text-xl font-medium text-orange-700 bg-orange-50/80 rounded-xl p-3 md:p-4 border border-orange-200">
                    {teachingFacts[currentFact]}
                  </div>
                </div>
              </div>

              {/* Virtual Coffee Break */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 relative overflow-hidden group cursor-pointer border border-amber-200 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 group-hover:from-amber-200/50 group-hover:to-yellow-200/50 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl md:text-5xl mb-3 md:mb-4">☕</div>
                  <h4 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-amber-700 flex items-center justify-center gap-2">
                    <Coffee className="h-4 w-4 md:h-5 md:w-5" />
                    Virtual Coffee Break
                    <Sun className="h-4 w-4 md:h-5 md:w-5" />
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Take a moment to breathe, smile, and appreciate the incredible educator you are! ✨
                  </p>
                  <div className="mt-2 md:mt-3 text-xs text-amber-600 opacity-70">Click for a surprise! 🎁</div>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 relative overflow-hidden group border border-green-200 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 group-hover:from-green-200/50 group-hover:to-emerald-200/50 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl md:text-5xl mb-3 md:mb-4">🏆</div>
                  <h4 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-green-700 flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4 md:h-5 md:w-5" />
                    Today's Achievement
                    <Star className="h-4 w-4 md:h-5 md:w-5" />
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    You showed up, you cared, and you made a difference! That's pure excellence! 🌟
                  </p>
                </div>
              </div>

              {/* Inspiration Generator */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 relative overflow-hidden group cursor-pointer border border-purple-200 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 group-hover:from-purple-200/50 group-hover:to-pink-200/50 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl md:text-4xl mb-3 md:mb-4">💫</div>
                  <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-purple-700 flex items-center justify-center gap-2">
                    <Wand2 className="h-4 w-4 md:h-5 md:w-5" />
                    Inspiration Generator
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                  </h4>
                  <p className="text-gray-600 text-sm">Click for instant motivation and teaching wisdom! ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 md:py-20 px-4 relative overflow-hidden bg-gradient-to-b from-white to-blue-50"
      >
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                Complete Teaching Toolkit
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to create engaging lessons and support your students 🎓
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FeatureCard
              icon={BookOpen}
              title="Lesson Planning"
              description="Create comprehensive lesson plans with AI assistance"
              href="/lesson-planning"
              emoji="📚"
            />
            <FeatureCard
              icon={FileQuestion}
              title="Question Paper Generator"
              description="Generate custom question papers and assessments"
              href="/lesson-planning/chatbot"
              emoji="❓"
            />
            <FeatureCard
              icon={PenTool}
              title="Create Lesson Plan"
              description="Design detailed lesson plans with templates"
              href="/lesson-planning/create"
              emoji="✏️"
            />
            <FeatureCard
              icon={Presentation}
              title="Whiteboard"
              description="Interactive digital whiteboard for teaching"
              href="/whiteboard"
              emoji="🖼️"
            />
            <FeatureCard
              icon={ClipboardList}
              title="Create Worksheets"
              description="Design engaging worksheets and activities"
              href="/lesson-planning/worksheets"
              emoji="📝"
            />
            <FeatureCard
              icon={Search}
              title="Research Support"
              description="AI-powered research assistance and insights"
              href="/research-support"
              emoji="🔍"
            />
            <FeatureCard
              icon={FileCheck}
              title="Summarize Papers"
              description="Quickly summarize academic papers and documents"
              href="/research-support/summarize"
              emoji="📄"
            />
            <FeatureCard
              icon={FileText}
              title="Paraphrase & Grammar"
              description="Improve writing with AI-powered tools"
              href="/research-support/paraphrase"
              emoji="✍️"
            />
            <FeatureCard
              icon={GitBranch}
              title="Flowchart"
              description="Create visual flowcharts and diagrams"
              href="/research-support/flowchart"
              emoji="🔄"
            />
            <FeatureCard
              icon={Bot}
              title="AI Assistants"
              description="Multiple AI assistants for different subjects"
              href="/ai-assistants"
              emoji="🤖"
            />
            <FeatureCard
              icon={Code}
              title="Coding Assistant"
              description="Advanced coding help for programming courses"
              href="/ai-assistants/coding"
              emoji="💻"
            />
            <FeatureCard
              icon={Users}
              title="Student Engagement"
              description="Tools to boost student participation and learning"
              href="/student-engagement"
              emoji="👥"
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-12 md:py-20 px-4 relative bg-gradient-to-b from-blue-50 to-green-50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Interactive Teaching Tools
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Engage your students with interactive content and real-time feedback 🎯
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
            <InteractiveCard
              title="Real-time Quizzes"
              description="Create interactive quizzes with automatic grading and instant feedback for students."
              icon={Zap}
              color="from-pink-500 to-red-500"
              emoji="⚡"
            />
            <InteractiveCard
              title="Concept Visualizations"
              description="Generate interactive visualizations to explain complex concepts in an engaging way."
              icon={Brain}
              color="from-blue-500 to-purple-500"
              emoji="🧠"
            />
            <InteractiveCard
              title="Adaptive Learning"
              description="Personalized learning paths that adapt to each student's progress and understanding."
              icon={Lightbulb}
              color="from-yellow-500 to-orange-500"
              emoji="💡"
            />
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-12 md:py-20 px-4 relative bg-gradient-to-b from-green-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                Powered by Advanced AI
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              GurukulX leverages cutting-edge AI models to provide the best educational assistance 🚀
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl relative group border border-blue-200 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 relative">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 relative text-gray-800">Llama 3.3 70B</h3>
              <p className="text-gray-600 relative text-sm md:text-base">
                Advanced language model for lesson planning, content generation, and educational assistance.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl relative group border border-green-200 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-100/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mb-4 relative">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 relative text-gray-800">Qwen 2.5 Coder 32B</h3>
              <p className="text-gray-600 relative text-sm md:text-base">
                Specialized coding model for programming assistance, code review, and technical education.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl relative group border border-purple-200 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 relative">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 relative text-gray-800">Llama Vision</h3>
              <p className="text-gray-600 relative text-sm md:text-base">
                Advanced vision capabilities for analyzing educational diagrams, charts, and visual content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Info Section */}
      <section className="py-12 md:py-20 px-4 relative overflow-hidden bg-gradient-to-b from-purple-50 to-orange-50">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-purple-600 bg-clip-text text-transparent">
                Meet the Developer
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Passionate about creating innovative educational technology solutions 👨‍💻
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-hidden group border border-orange-200 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-red-100/30 to-purple-100/30 group-hover:from-orange-200/40 group-hover:via-red-200/40 group-hover:to-purple-200/40 transition-all duration-500"></div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                {/* Developer Avatar and Info */}
                <div className="text-center md:text-left">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-1">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-2xl md:text-4xl font-bold">
                          AS
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Arav Saxena
                    </span>
                  </h3>
                  <p className="text-lg md:text-xl text-orange-600 mb-4">Full Stack Developer & AI Enthusiast 🚀</p>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                    Passionate about leveraging technology to solve real-world problems in education. With 6+ years of
                    experience in full-stack development and AI, I'm dedicated to creating tools that empower educators
                    and enhance learning experiences.
                  </p>

                  {/* Developer Stats */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                    <div className="text-center p-2 md:p-3 rounded-lg bg-gradient-to-br from-orange-100/50 to-red-100/50 border border-orange-200">
                      <div className="text-lg md:text-2xl font-bold text-orange-600">2+</div>
                      <div className="text-xs md:text-sm text-gray-600">Years Experience</div>
                      <div className="text-sm md:text-lg">🎯</div>
                    </div>
                    <div className="text-center p-2 md:p-3 rounded-lg bg-gradient-to-br from-blue-100/50 to-purple-100/50 border border-blue-200">
                      <div className="text-lg md:text-2xl font-bold text-blue-600">10+</div>
                      <div className="text-xs md:text-sm text-gray-600">Projects</div>
                      <div className="text-sm md:text-lg">🏆</div>
                    </div>
                    <div className="text-center p-2 md:p-3 rounded-lg bg-gradient-to-br from-green-100/50 to-teal-100/50 border border-green-200">
                      <div className="text-lg md:text-2xl font-bold text-green-600">1000+</div>
                      <div className="text-xs md:text-sm text-gray-600">Teachers Helped</div>
                      <div className="text-sm md:text-lg">👩‍🏫</div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start gap-3 md:gap-4">
                    <a
                      href="https://github.com/arav7781"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center hover:from-orange-500 hover:to-red-500 transition-all duration-300 group shadow-lg"
                    >
                      <Github className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/arav-saxena-a081a428a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center hover:from-orange-500 hover:to-red-500 transition-all duration-300 group shadow-lg"
                    >
                      <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="mailto:aravsaxena884@gmail.com"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center hover:from-orange-500 hover:to-red-500 transition-all duration-300 group shadow-lg"
                    >
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://arav-portfolio.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center hover:from-orange-500 hover:to-red-500 transition-all duration-300 group shadow-lg"
                    >
                      <Globe className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Skills and Info */}
                <div className="space-y-6">
                  <h4 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Technologies & Skills
                    </span>
                  </h4>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {skills.slice(0, 9).map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-300 border border-orange-200/50"
                      >
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${skill.color} flex items-center justify-center`}
                        >
                          <skill.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-700 text-center font-medium">{skill.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fun Facts */}
                  <div className="space-y-3">
                    <h5 className="text-base md:text-lg font-semibold text-gray-700">Fun Facts 😄</h5>
                    <div className="space-y-2">
                      {[
                        { icon: Coffee, text: "Powered by coffee and curiosity ☕" },
                        { icon: Heart, text: "Loves open source contributions ❤️" },
                        { icon: Rocket, text: "Always exploring new technologies 🚀" },
                        { icon: Smile, text: "Making teachers smile, one feature at a time 😊" },
                      ].map((fact, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-gray-600 hover:text-gray-700 transition-colors text-sm md:text-base"
                        >
                          <fact.icon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                          <span>{fact.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact CTA */}
                  <div className="mt-8">
                    <Link href="https://linkedin.com/in/arav-saxena-a081a428a">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-lg">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Let's Connect 🤝
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 relative bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden group border border-orange-200 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-red-100/30 group-hover:from-orange-200/40 group-hover:to-red-200/40 transition-colors duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                  Ready to Transform Your Teaching?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Join thousands of educators who are already using AI to enhance their teaching and improve student
                outcomes. 🎓✨
              </p>
              <Link href="/lesson-planning">
                <Button
                  size={isMobile ? "default" : "lg"}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-xl"
                >
                  Start Creating 🚀 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 md:py-16 px-4 border-t border-orange-200 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent">
                  GurukulX
                </span>
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6 max-w-md text-sm md:text-base">
                Empowering educators with AI-powered tools to create engaging, personalized learning experiences for
                students across Indian colleges and universities. 🎓
              </p>
              <div className="flex gap-3 md:gap-4">
                <a
                  href="https://github.com/arav7781"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 hover:bg-orange-200 flex items-center justify-center transition-all duration-300"
                >
                  <Github className="h-4 w-4 md:h-5 md:w-5 text-gray-600 hover:text-orange-600 transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/in/arav-saxena-a081a428a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 hover:bg-blue-200 flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-gray-600 hover:text-blue-600 transition-colors" />
                </a>
                <a
                  href="mailto:aravsaxena884@gmail.com"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 hover:bg-red-200 flex items-center justify-center transition-all duration-300"
                >
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-600 hover:text-red-600 transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">Quick Links 🔗</h4>
              <ul className="space-y-1 md:space-y-2">
                {[
                  { name: "Lesson Planning", href: "/lesson-planning" },
                  { name: "Whiteboard", href: "/whiteboard" },
                  { name: "Worksheets", href: "/lesson-planning/worksheets" },
                  { name: "AI Assistants", href: "/ai-assistants" },
                  { name: "Coding Assistant", href: "/ai-assistants/coding" },
                  { name: "Research Support", href: "/research-support/summarize" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-orange-600 transition-colors duration-300 text-sm md:text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Developer Info */}
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">Developer 👨‍💻</h4>
              <div className="space-y-2 md:space-y-3">
                <p className="text-gray-600 text-sm md:text-base">
                  Built with <Heart className="inline h-3 w-3 md:h-4 md:w-4 text-red-500 mx-1" /> by Arav Saxena
                </p>
                <p className="text-gray-600 text-xs md:text-sm">
                  Passionate about AI, education, and creating meaningful technology solutions. 🚀
                </p>
                <div className="flex gap-2 mt-3 md:mt-4">
                  <a
                    href="mailto:aravsaxena884@gmail.com"
                    className="text-xs md:text-sm bg-gradient-to-r from-orange-200 to-red-200 hover:from-orange-300 hover:to-red-300 px-2 md:px-3 py-1 rounded-full text-gray-700 hover:text-gray-800 transition-all duration-300"
                  >
                    Contact Dev 📧
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-6 md:pt-8 border-t border-orange-200 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-gray-600 text-xs md:text-sm text-center md:text-left">
              © 2024 GurukulX. All rights reserved. Made with passion for education. 💖
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-orange-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-orange-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-orange-600 transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Bottom border */}
          <div className="mt-6 md:mt-8 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  emoji?: string
}

function FeatureCard({ icon: Icon, title, description, href, emoji }: FeatureCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm h-full relative group border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-red-100/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="relative p-4 md:p-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
        <CardTitle className="text-base md:text-lg group-hover:text-orange-700 transition-colors duration-300 text-gray-800 flex items-center gap-2">
          {title}
          {emoji && <span className="text-base md:text-lg">{emoji}</span>}
        </CardTitle>
        <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-xs md:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="relative p-4 md:p-6 pt-0">
        <Link href={href} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 group-hover:border-orange-400 transition-all duration-300 text-xs md:text-sm bg-transparent"
          >
            <span className="flex items-center">
              Explore
              <ArrowRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

interface InteractiveCardProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  emoji?: string
}

function InteractiveCard({ title, description, icon: Icon, color, emoji }: InteractiveCardProps) {
  return (
    <div className="rounded-xl overflow-hidden relative group h-full hover:-translate-y-1 transition-transform duration-300">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
      ></div>
      <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 h-full relative border border-orange-200 shadow-lg">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <h3 className="text-lg md:text-xl font-bold group-hover:text-gray-800 transition-colors duration-300 text-gray-700">
            {title}
          </h3>
          {emoji && <span className="text-lg md:text-xl">{emoji}</span>}
        </div>
        <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm md:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}
