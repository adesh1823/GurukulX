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
} from "lucide-react"
import { Vortex } from "@/components/ui/vortex"
import { GradientText } from "@/components/ui/gradient-text"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
// Skills data for infinite scroll
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

// Fun teacher quotes
const teacherQuotes = [
  "Coffee: Because teaching is hard! ☕",
  "I survived another Monday! 🎉",
  "Teaching: Where every day is an adventure! 🚀",
  "Powered by coffee and student success! ⭐",
  "Making learning fun, one lesson at a time! 🎯",
  "Teaching is my superpower! 🦸‍♀️",
  "Smiles are contagious – pass them on! 😊",
  "Grading papers... send chocolate. 🍫",
  "Changing the world, one student at a time. 🌍",
  "It takes a big heart to shape little minds. ❤️",
  "Learning is messy – and that's okay! 🖍️",
  "Teaching is a work of heart. 💖",
  "Teachers plant the seeds of knowledge. 🌱",
  "Fueled by passion, driven by caffeine. ☕✨",
  "Keep calm and teach on. 🧘‍♀️",
  "Behind every successful student is a tired teacher. 😅",
  "Every day is a chance to inspire! 💡",
  "Mistakes are proof you are trying. ✏️",
  "Friday: A teacher's second favorite F word. 😉",
  "Teaching: The only job where you steal markers. 🖊️",
  "Today's lesson: You're doing amazing! 👏",
  "Warning: May spontaneously start talking about teaching! 🔊",
  "The future of the world is in my classroom today. 🌟",
  "If you can read this, thank a teacher! 📚",
  "I teach. What's your superpower? 🦸‍♂️",
  "Lesson plans and late nights = teacher life! 🌙",
  "A+ for effort, teacher! 📝",
  "Teaching is tough but so are you! 💪",
  "Best classroom ever: mine. 😎",
  "Smartboard warrior by day, grading ninja by night. 🥷",
  "The influence of a teacher can never be erased. 🧼",
  "Don't worry, I've got class! 🎓",
  "Chalk dust and dreams. ✨",
  "Today's agenda: changing lives. ✅",
  "I may be a teacher, but I still learn every day! 📖",
  "Alexa, grade these papers. 😂",
  "Coffee first, questions later. ☕❓",
  "This classroom runs on love and laughter. ❤️😂",
  "Teaching: It's not a job, it's a calling. 📞",
  "Oops! Did I say that out loud in class? 🙊",
  "Making learning stick like glitter in a carpet. ✨",
  "If teaching was easy, it would be called parenting. 😜",
  "Don't make me use my teacher voice! 📢",
  "Dear sleep, I miss you. Sincerely, teacher. 💤",
  "Creativity is contagious – pass it on. 🎨",
  "Smiling – it's part of my lesson plan! 😊",
  "Rainy days = extra coffee days! ☔☕",
  "I teach tiny humans. What's your excuse? 👶📚",
  "A teacher's hug can fix anything. 🤗",
  "High fives and happy vibes. ✋😄",
  "Because kids deserve magical learning. 🧙‍♂️",
  "Teachers: Making brains spark since forever. ⚡",
  "Teaching with heart, humor, and lots of sticky notes! 💛📌",
]

// Teacher mood booster data
const moodBoosters = [
  {
    title: "You're Amazing!",
    message: "Every lesson you teach plants seeds of knowledge that will grow for a lifetime! 🌱",
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Coffee Break!",
    message: "Take a moment to appreciate how awesome you are. You deserve this break! ☕",
    icon: Coffee,
    color: "from-amber-600 to-yellow-500",
  },
  {
    title: "Student Success!",
    message: "Remember that 'aha!' moment in class? That's the magic you create every day! ✨",
    icon: Lightbulb,
    color: "from-blue-400 to-purple-500",
  },
  {
    title: "You're Appreciated!",
    message: "Your dedication doesn't go unnoticed. You're shaping the future, one student at a time! 🎯",
    icon: Heart,
    color: "from-pink-400 to-red-500",
  },
  {
    title: "Celebration Time!",
    message: "Every small victory in your classroom is worth celebrating. You're doing great! 🎉",
    icon: PartyPopper,
    color: "from-purple-400 to-pink-500",
  },
]

// Fun teaching facts
const teachingFacts = [
  "Teachers touch the future! 🚀",
  "You inspire 30+ minds daily! 🧠",
  "Your patience is superhuman! 🦸‍♀️",
  "You make learning magical! ✨",
  "Coffee is your superpower! ☕",
  "You're a knowledge ninja! 🥷",
  "Creativity flows through you! 🎨",
  "You turn chaos into learning! 🌪️",
  "Your smile brightens days! 😊",
  "You're a future architect! 🏗️",
]

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentMoodBooster, setCurrentMoodBooster] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentFact, setCurrentFact] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    // Set loaded after a small delay to trigger animations
    const timer = setTimeout(() => setIsLoaded(true), 100)

    // Rotate quotes every 3 seconds
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % teacherQuotes.length)
    }, 3000)

    // Rotate mood boosters every 5 seconds
    const moodTimer = setInterval(() => {
      setCurrentMoodBooster((prev) => (prev + 1) % moodBoosters.length)
    }, 5000)

    // Rotate teaching facts every 2 seconds
    const factTimer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % teachingFacts.length)
    }, 2000)

    // Random celebration every 15 seconds
    const celebrationTimer = setInterval(() => {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }, 15000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
      clearInterval(quoteTimer)
      clearInterval(moodTimer)
      clearInterval(factTimer)
      clearInterval(celebrationTimer)
    }
  }, [])

  // Calculate parallax effect based on mouse position
  const calculateParallax = (depth = 20) => {
    if (typeof window === "undefined") return { x: 0, y: 0 }
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const moveX = (mousePosition.x - centerX) / depth
    const moveY = (mousePosition.y - centerY) / depth
    return { x: moveX, y: moveY }
  }

  return (
    <div className="min-h-screen">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0, rotate: 720 }}
              transition={{ duration: 1, type: "spring" }}
              className="text-8xl"
            >
              🎉
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute mt-20 text-2xl font-bold text-yellow-300"
            >
              You're Awesome, Teacher! 🌟
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Vortex Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Vortex
          backgroundColor="transparent"
          rangeY={800}
          particleCount={500}
          baseHue={220}
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-6">
                <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF", "#FFFFFF"]} animationSpeed={3}>
                  GurukulX
                </GradientText>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              AI-Powered Teaching Assistant for Indian Colleges
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Revolutionize your teaching with AI-generated lesson plans, content, and personalized learning tools
              designed specifically for Indian college educators.
            </motion.p>

            {/* Fun Quote for Teachers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-8"
            >
              <motion.p
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg text-yellow-300 font-medium italic"
              >
                {teacherQuotes[currentQuote]}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/lesson-planning">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                  <span className="relative z-10 flex items-center">
                    Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </Vortex>

        {/* Floating elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-0"
          style={{ x: calculateParallax(30).x, y: calculateParallax(30).y }}
        >
          <div className="float-slow">
            <Lightbulb className="h-16 w-16 text-yellow-300/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 z-0"
          style={{ x: calculateParallax(20).x, y: calculateParallax(20).y }}
        >
          <div className="float">
            <Brain className="h-20 w-20 text-purple-400/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute top-1/3 right-1/3 z-0"
          style={{ x: calculateParallax(40).x, y: calculateParallax(40).y }}
        >
          <div className="float-fast">
            <Zap className="h-12 w-12 text-blue-300/30" />
          </div>
        </motion.div>
      </section>

      {/* Teacher Mood Booster Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/5 to-orange-900/10 pointer-events-none"></div>
        
        {/* Floating mood elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 text-4xl z-0"
        >
          ☀️
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-10 text-3xl z-0"
        >
          🌈
        </motion.div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText colors={["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"]}>Teacher Mood Booster</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Because every teacher deserves a daily dose of appreciation and joy! 🌟
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Main Mood Booster Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                key={currentMoodBooster}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-effect rounded-2xl p-8 relative overflow-hidden group h-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${moodBoosters[currentMoodBooster].color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut"
                    }}
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${moodBoosters[currentMoodBooster].color} flex items-center justify-center mx-auto mb-6`}
                  >
                    <motion.div className={`h-10 w-10 text-white ${moodBoosters[currentMoodBooster].icon}`} key={currentMoodBooster}></motion.div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {moodBoosters[currentMoodBooster].title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {moodBoosters[currentMoodBooster].message}
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCelebration(true)}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Spread the Joy! 🎉
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Interactive Fun Zone */}
            <div className="space-y-6">
              {/* Teaching Facts Ticker */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="relative z-10">
                  <h4 className="text-lg font-semibold mb-4 text-center">
                    <GradientText>Quick Teacher Facts</GradientText>
                  </h4>
                  <motion.div
                    key={currentFact}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-xl font-medium text-yellow-300"
                  >
                    {teachingFacts[currentFact]}
                  </motion.div>
                </div>
              </motion.div>

              {/* Virtual Coffee Break */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 group-hover:from-amber-600/20 group-hover:to-yellow-600/20 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut"
                    }}
                    className="text-4xl mb-3"
                  >
                    ☕
                  </motion.div>
                  <h4 className="text-lg font-semibold mb-2 text-amber-300">Virtual Coffee Break</h4>
                  <p className="text-gray-400 text-sm">Take a moment to breathe and appreciate yourself!</p>
                </div>
              </motion.div>

              {/* Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                      rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
                    }}
                    className="text-4xl mb-3"
                  >
                    🏆
                  </motion.div>
                  <h4 className="text-lg font-semibold mb-2 text-green-300">Today's Achievement</h4>
                  <p className="text-gray-400 text-sm">You showed up and made a difference!</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating Encouragement Bubbles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -100],
                  x: [0, Math.random() * 100 - 50]
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 2,
                  ease: "easeOut"
                }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                style={{ left: `${20 + i * 15}%` }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm">
                  {['💖', '⭐', '🌟', '✨', '🎯', '🚀'][i]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText>Complete Teaching Toolkit</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create engaging lessons and support your students 🎓
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FeatureCard
              icon={BookOpen}
              title="Lesson Planning"
              description="Create comprehensive lesson plans with AI assistance"
              href="/lesson-planning"
              delay={0.1}
              emoji="📚"
            />
            <FeatureCard
              icon={FileQuestion}
              title="Question Paper Gen"
              description="Generate custom question papers and assessments"
              href="/lesson-planning/chatbot"
              delay={0.15}
              emoji="❓"
            />
            <FeatureCard
              icon={PenTool}
              title="Create Lesson Plan"
              description="Design detailed lesson plans with templates"
              href="/lesson-planning/create"
              delay={0.2}
              emoji="✏️"
            />
            <FeatureCard
              icon={Presentation}
              title="Whiteboard"
              description="Interactive digital whiteboard for teaching"
              href="/lesson-planning/whiteboard"
              delay={0.25}
              emoji="🖼️"
            />
            <FeatureCard
              icon={ClipboardList}
              title="Create Worksheets"
              description="Design engaging worksheets and activities"
              href="lesson-planning/worksheets"
              delay={0.3}
              emoji="📝"
            />
            <FeatureCard
              icon={Search}
              title="Research Support"
              description="AI-powered research assistance and insights"
              href="/research-support"
              delay={0.35}
              emoji="🔍"
            />
            <FeatureCard
              icon={FileCheck}
              title="Summarize Papers"
              description="Quickly summarize academic papers and documents"
              href="/research-support/summarize"
              delay={0.4}
              emoji="📄"
            />
            <FeatureCard
              icon={FileText}
              title="Paraphrase & Grammar"
              description="Improve writing with AI-powered tools"
              href="/research-support/paraphrase"
              delay={0.45}
              emoji="✍️"
            />
            <FeatureCard
              icon={GitBranch}
              title="Flowchart"
              description="Create visual flowcharts and diagrams"
              href="/research-support/flowchart"
              delay={0.5}
              emoji="🔄"
            />
            <FeatureCard
              icon={Bot}
              title="AI Assistants"
              description="Multiple AI assistants for different subjects"
              href="/ai-assistants"
              delay={0.55}
              emoji="🤖"
            />
            <FeatureCard
              icon={Code}
              title="Coding Assistant"
              description="Advanced coding help for programming courses"
              href="/ai-assistants/coding-assistant"
              delay={0.6}
              emoji="💻"
            />
            <FeatureCard
              icon={Users}
              title="Student Engagement"
              description="Tools to boost student participation and learning"
              href=""
              delay={0.65}
              emoji="👥"
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 pointer-events-none"></div>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText colors={["#FF6EC7", "#6C5CE7", "#3A86FF"]}>Interactive Teaching Tools</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Engage your students with interactive content and real-time feedback 🎯
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <InteractiveCard
              title="Real-time Quizzes"
              description="Create interactive quizzes with automatic grading and instant feedback for students."
              icon={Zap}
              color="from-pink-500 to-red-500"
              delay={0.1}
              emoji="⚡"
            />
            <InteractiveCard
              title="Concept Visualizations"
              description="Generate interactive visualizations to explain complex concepts in an engaging way."
              icon={Brain}
              color="from-blue-500 to-purple-500"
              delay={0.3}
              emoji="🧠"
            />
            <InteractiveCard
              title="Adaptive Learning"
              description="Personalized learning paths that adapt to each student's progress and understanding."
              icon={Lightbulb}
              color="from-yellow-500 to-orange-500"
              delay={0.5}
              emoji="💡"
            />
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-blue-900/10 pointer-events-none"></div>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText>Powered by Advanced AI</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              GurukulX leverages cutting-edge AI models to provide the best educational assistance 🚀
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card-hover p-6 rounded-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="feature-icon mb-4 relative">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative">Llama 3.3 70B</h3>
              <p className="text-gray-400 relative">
                Advanced language model for lesson planning, content generation, and educational assistance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card-hover p-6 rounded-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="feature-icon mb-4 relative">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative">Qwen 2.5 Coder 32B</h3>
              <p className="text-gray-400 relative">
                Specialized coding model for programming assistance, code review, and technical education.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="card-hover p-6 rounded-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="feature-icon mb-4 relative">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative">llama4 scout vision</h3>
              <p className="text-gray-400 relative">
                Advanced vision capabilities for analyzing educational diagrams, charts, and visual content.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Info Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/20 pointer-events-none"></div>

        {/* Floating background elements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="absolute top-10 left-10 z-0"
          style={{ x: calculateParallax(50).x, y: calculateParallax(50).y }}
        >
          <div className="float-slow">
            <Rocket className="h-24 w-24 text-purple-400/20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute bottom-10 right-10 z-0"
          style={{ x: calculateParallax(30).x, y: calculateParallax(30).y }}
        >
          <div className="float">
            <Star className="h-20 w-20 text-yellow-400/20" />
          </div>
        </motion.div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText colors={["#FF6EC7", "#6C5CE7", "#3A86FF", "#00D4FF"]}>Meet the Developer</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Passionate about creating innovative educational technology solutions 👨‍💻
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-effect rounded-3xl p-8 md:p-12 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-pink-600/5 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-pink-600/10 transition-all duration-500"></div>

              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                {/* Developer Avatar and Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center md:text-left"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative inline-block mb-6"
                  >
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-1">
                    <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center overflow-hidden">
                      <Image
                        src="/DSC00677.JPG"
                        alt="Arav Saxena"
                        width={100}
                        height={100}
                        className="object-cover rounded-full"
                      />
                    </div>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-400/30"
                    ></motion.div>
                  </motion.div>

                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    <GradientText>Arav Saxena</GradientText>
                  </h3>
                  <p className="text-xl text-purple-300 mb-4">Full Stack Developer & AI Enthusiast 🚀</p>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                  Everyone is a slave to something fear, power, love, approval.
                  Even those who claim to be free are chained by their desires.
                  But I've accepted my chains and turned them into weapons.
                  Because the only true freedom… is choosing what you're willing to be a slave for nd never breaking ✨
                  </p>

                  {/* Fun Developer Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-600/10 to-blue-600/10"
                    >
                      <div className="text-2xl font-bold text-purple-300">6+</div>
                      <div className="text-sm text-gray-400">Years Experience in coding</div>
                      <div className="text-lg">🎯</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-600/10 to-pink-600/10"
                    >
                      <div className="text-2xl font-bold text-blue-300">10+</div>
                      <div className="text-sm text-gray-400">Projects Built</div>
                      <div className="text-lg">🏆</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 rounded-lg bg-gradient-to-br from-pink-600/10 to-purple-600/10"
                    >
                      <div className="text-2xl font-bold text-pink-300">1000+</div>
                      <div className="text-sm text-gray-400">Targeted teachers helped by 2025</div>
                      <div className="text-lg">👩‍🏫</div>
                    </motion.div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start gap-4">
                    <motion.a
                      href="https://github.com/arav7781"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Github className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="https://www.linkedin.com/in/arav-saxena-a081a428a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Linkedin className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="mailto:aravsaxena884@gmail.com"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Mail className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="https://arav-portfolio.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Globe className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Skills Infinite Scroll */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <h4 className="text-2xl font-bold mb-6 text-center text-blue">
                    <GradientText>Technologies & Skill</GradientText>
                  </h4>



                  {/* Infinite Scroll Skills */}
                  <div className="mb-8">
                    <InfiniteScrollingSkills />
                  </div>

                  {/* Fun Facts */}
                  <div className="mt-8 space-y-4">
                    <h5 className="text-lg font-semibold text-gray-300">Fun Facts 😄</h5>
                    <div className="space-y-3">
                      {[
                        { icon: Coffee, text: "Powered by coffee and curiosity ☕", emoji: "☕" },
                        { icon: Heart, text: "Loves open source contributions ❤️", emoji: "❤️" },
                        { icon: Rocket, text: "Always exploring new technologies 🚀", emoji: "🚀" },
                        { icon: Smile, text: "Making teachers smile, one feature at a time 😊", emoji: "😊" },
                      ].map((fact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <fact.icon className="h-4 w-4 text-purple-400" />
                          <span>{fact.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Contact CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                    viewport={{ once: true }}
                    className="mt-8"
                  >
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 relative overflow-hidden group">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                      <span className="relative z-10 flex items-center">
                        
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <Link href="https://linkedin.com/in/arav-saxena-a081a428a">
                        Let's Connect 🤝
                        </Link>
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <div className="glass-effect rounded-2xl p-12 max-w-4xl mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-colors duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <GradientText>Ready to Transform Your Teaching?</GradientText>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of educators who are already using AI to enhance their teaching and improve student
                outcomes. 🎓✨
              </p>
              <Link href="/lesson-planning">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                  <span className="relative z-10 flex items-center">
                    Start Creating 🚀{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-blue-900/10 pointer-events-none"></div>

        {/* Floating footer elements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="absolute top-5 left-5 z-0"
          style={{ x: calculateParallax(60).x, y: calculateParallax(60).y }}
        >
          <div className="float-slow">
            <Star className="h-8 w-8 text-yellow-400/30" />
          </div>
        </motion.div>

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <h3 className="text-2xl font-bold mb-4">
                <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF"]}>GurukulX</GradientText>
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering educators with AI-powered tools to create engaging, personalized learning experiences for
                students across Indian colleges and universities. 🎓
              </p>
              <div className="flex gap-4">
                <motion.a
                  href="https://github.com/arav7781"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-purple-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Github className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/arav-saxena-a081a428a"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
                <motion.a
                  href="mailto:aravsaxena884@gmail.com"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Mail className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links 🔗</h4>
              <ul className="space-y-2">
                {[
                  { name: "Lesson Planning", href: "/lesson-planning" },
                  { name: "Question Papers", href: "/question-paper" },
                  { name: "Worksheets", href: "/worksheets" },
                  { name: "AI Assistants", href: "/ai-assistants" },
                  { name: "Coding Assistant", href: "ai-assistants/coding-assistant" },
                  { name: "Research Support", href: "/research-support/summarize" },
                  { name: "Flowchart Builder", href: "/research-support/flowchart" },
            

                ].map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Developer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white">Developer 👨‍💻</h4>
              <div className="space-y-3">
                <p className="text-gray-400">
                  Built with <Heart className="inline h-4 w-4 text-red-400 mx-1" /> by Arav Saxena
                </p>
                <p className="text-gray-400 text-sm">
                  Passionate about AI, education, and creating meaningful technology solutions. 🚀
                </p>
                <div className="flex gap-2 mt-4">
                  <motion.a
                    href="mailto:aravsaxena884@gmail.com"
                    whileHover={{ scale: 1.05 }}
                    className="text-sm bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 px-3 py-1 rounded-full text-gray-300 hover:text-white transition-all duration-300"
                  >
                    Contact Dev 📧
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-gray-400 text-sm">
              © 2024 GurukulX. All rights reserved. Made with passion for education. 💖
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </motion.div>

          {/* Animated bottom border */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
          />
        </div>
      </footer>
    </div>
  )
}

// Infinite Scrolling Skills Component
function InfiniteScrollingSkills() {
  const skillWidth = 120
  const gap = 16
  const skillsPerSet = skills.length
  const setWidth = skillsPerSet * skillWidth + (skillsPerSet - 1) * gap

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/10 to-blue-900/10 p-4">
      <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-16 before:bg-gradient-to-r before:from-gray-900 before:via-gray-900/50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-16 after:bg-gradient-to-l after:from-gray-900 after:via-gray-900/50 after:to-transparent">
        <motion.div
          className="flex"
          animate={{
            x: [-setWidth, 0],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: skills.length * 3,
              ease: "linear",
            },
          }}
        >
          {[...Array(2)].map((_, loopIdx) => (
            <div className="flex items-center gap-4" key={loopIdx} style={{ width: `${setWidth}px`, flexShrink: 0 }}>
              {skills.map((skill, idx) => (
                <motion.div
                  key={`${loopIdx}-${idx}`}
                  className="flex-none min-w-[120px]"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${skill.color} flex items-center justify-center`}
                    >
                      <skill.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-300 text-center font-medium">{skill.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  delay?: number
  emoji?: string
}

function FeatureCard({ icon: Icon, title, description, href, delay = 0, emoji }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="card-hover h-full relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative">
          <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center gap-2">
            <Icon className="h-6 w-6" />
            {emoji && <span className="text-lg">{emoji}</span>}
          </div>
          <CardTitle className="text-lg group-hover:text-white transition-colors duration-300">{title}</CardTitle>
          <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative">
          <Link href={href} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-white hover:bg-white/10 group-hover:border-white/30 transition-all duration-300"
            >
              <span className="flex items-center">
                Explore
                <ArrowRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

interface InteractiveCardProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  delay?: number
  emoji?: string
}

function InteractiveCard({ title, description, icon: Icon, color, delay = 0, emoji }: InteractiveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="float-slow"
    >
      <div className="rounded-xl overflow-hidden relative group h-full">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
        ></div>
        <div className="glass-effect p-6 h-full relative">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">{title}</h3>
            {emoji && <span className="text-xl">{emoji}</span>}
          </div>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
