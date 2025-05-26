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
} from "lucide-react"
import { Vortex } from "@/components/ui/vortex"
import { GradientText } from "@/components/ui/gradient-text"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

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

// Enhanced teacher quotes with more variety
const teacherQuotes = [
  "Brewing knowledge, one lesson at a time ☕✨",
  "Making minds sparkle since forever! 🌟",
  "Teaching: Where magic meets reality 🎭",
  "Powered by passion, fueled by coffee ⚡☕",
  "Creating tomorrow's leaders today 🚀",
  "Every student is a story waiting to unfold 📖",
  "Teaching is my superpower! What's yours? 🦸‍♀️",
  "Turning 'I can't' into 'I did it!' 💪",
  "Planting seeds of wisdom everywhere 🌱",
  "Making learning an adventure! 🗺️",
]

// Enhanced mood boosters with more interactive elements
const moodBoosters = [
  {
    title: "You're a Rockstar! 🌟",
    message: "Every lesson you teach creates ripples of knowledge that will last forever! Your impact is immeasurable.",
    icon: Crown,
    color: "from-yellow-400 via-orange-500 to-red-500",
    particles: ["⭐", "✨", "🌟", "💫"],
  },
  {
    title: "Coffee & Courage! ☕",
    message:
      "Take a moment to appreciate the incredible educator you are. You deserve all the recognition in the world!",
    icon: Coffee,
    color: "from-amber-600 via-yellow-500 to-orange-400",
    particles: ["☕", "🍪", "☀️", "🌻"],
  },
  {
    title: "Lightbulb Moments! 💡",
    message: "Remember those amazing 'aha!' moments? That's the magic you create every single day in your classroom!",
    icon: Lightbulb,
    color: "from-blue-400 via-purple-500 to-pink-500",
    particles: ["💡", "⚡", "🔥", "✨"],
  },
  {
    title: "Heart of Gold! 💖",
    message: "Your dedication and love for teaching doesn't go unnoticed. You're shaping the future with every smile!",
    icon: Heart,
    color: "from-pink-400 via-red-500 to-purple-500",
    particles: ["💖", "💝", "🌹", "🦋"],
  },
  {
    title: "Celebration Time! 🎉",
    message:
      "Every small victory, every breakthrough moment - they all deserve celebration. You're absolutely amazing!",
    icon: PartyPopper,
    color: "from-purple-400 via-pink-500 to-red-400",
    particles: ["🎉", "🎊", "🎈", "🎁"],
  },
  {
    title: "Wisdom Wizard! 🧙‍♀️",
    message: "You have the magical ability to transform confusion into clarity. That's pure wizardry right there!",
    icon: Wand2,
    color: "from-indigo-400 via-purple-500 to-blue-500",
    particles: ["🔮", "⭐", "✨", "🌙"],
  },
]

// Fun teaching facts with emojis
const teachingFacts = [
  "You inspire 30+ minds daily! 🧠✨",
  "Your patience is superhuman! 🦸‍♀️💪",
  "You make learning magical! 🎩✨",
  "Coffee is your superpower! ☕⚡",
  "You're a knowledge ninja! 🥷📚",
  "Creativity flows through you! 🎨🌊",
  "You turn chaos into learning! 🌪️➡️📖",
  "Your smile brightens days! 😊☀️",
  "You're a future architect! 🏗️🚀",
  "Teaching is your art form! 🎭🎨",
]

export default function Home() {
  // Hydration-safe state initialization
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentMoodBooster, setCurrentMoodBooster] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentFact, setCurrentFact] = useState(0)
  const [moodBoosterParticles, setMoodBoosterParticles] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([])

  const Icon = moodBoosters[currentMoodBooster].icon

  // Hydration-safe parallax calculation
  const calculateParallax = useCallback(
    (depth = 20) => {
      if (!isClient || typeof window === "undefined" || isMobile) {
        return { x: 0, y: 0 }
      }

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const moveX = (mousePosition.x - centerX) / depth
      const moveY = (mousePosition.y - centerY) / depth
      return { x: moveX, y: moveY }
    },
    [isClient, mousePosition, isMobile],
  )

  // Create mood booster particles
  const createParticles = useCallback(() => {
    if (!isClient) return

    const particles = moodBoosters[currentMoodBooster].particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: particles[Math.floor(Math.random() * particles.length)],
    }))
    setMoodBoosterParticles(newParticles)
    setTimeout(() => setMoodBoosterParticles([]), 3000)
  }, [currentMoodBooster, isClient])

  useEffect(() => {
    // Set client flag after hydration
    setIsClient(true)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Only add event listeners after hydration
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    // Rotate quotes every 4 seconds
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % teacherQuotes.length)
    }, 4000)

    // Rotate mood boosters every 6 seconds
    const moodTimer = setInterval(() => {
      setCurrentMoodBooster((prev) => (prev + 1) % moodBoosters.length)
    }, 6000)

    // Rotate teaching facts every 2.5 seconds
    const factTimer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % teachingFacts.length)
    }, 2500)

    // Random celebration every 20 seconds
    const celebrationTimer = setInterval(() => {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 4000)
    }, 20000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", checkMobile)
      clearInterval(quoteTimer)
      clearInterval(moodTimer)
      clearInterval(factTimer)
      clearInterval(celebrationTimer)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Enhanced Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && isClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {/* Multiple celebration elements */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0, rotate: 720 }}
              transition={{ duration: 2, type: "tween" }}
              className="text-4xl md:text-8xl"
            >
              🎉
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: -360 }}
              exit={{ scale: 0 }}
              transition={{ duration: 2, delay: 0.2, type: "tween" }}
              className="absolute text-3xl md:text-6xl"
              style={{ top: "30%", left: "20%" }}
            >
              ⭐
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 2, delay: 0.4, type: "tween" }}
              className="absolute text-2xl md:text-5xl"
              style={{ top: "60%", right: "25%" }}
            >
              🌟
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: 0.5, type: "tween" }}
              className="absolute mt-20 text-lg md:text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent text-center px-4"
            >
              You're an Amazing Teacher! 🏆
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Enhanced Vortex Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Vortex
            backgroundColor="transparent"
            rangeY={800}
            particleCount={isMobile ? 300 : 500}
            baseHue={220}
            className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full absolute inset-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "tween" }}
              className="text-center max-w-4xl mx-auto px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="mb-6"
              >
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                  <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF", "#FFFFFF"]} animationSpeed={3}>
                    GurukulX
                  </GradientText>
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "tween" }}
                className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4"
              >
                AI-Powered Teaching Assistant for Indian Colleges
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: "tween" }}
                className="text-base md:text-lg text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto px-4"
              >
                Revolutionize your teaching with AI-generated lesson plans, content, and personalized learning tools
                designed specifically for Indian college educators.
              </motion.p>

              {/* Enhanced Fun Quote for Teachers */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, type: "tween" }}
                className="mb-8 px-4"
              >
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 1.05 }}
                  transition={{ type: "tween" }}
                  className="relative inline-block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"></div>
                  <p className="relative text-sm sm:text-base md:text-lg lg:text-xl text-yellow-300 font-medium italic px-4 sm:px-6 py-2 sm:py-3 bg-black/20 rounded-full backdrop-blur-sm border border-yellow-400/30">
                    {teacherQuotes[currentQuote]}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, type: "tween" }}
                className="flex flex-col sm:flex-row gap-4 justify-center px-4"
              >
                <Link href="/lesson-planning">
                  <Button
                    size={isMobile ? "default" : "lg"}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                    <span className="relative z-10 flex items-center">
                      Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size={isMobile ? "default" : "lg"}
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                  >
                    Explore Features
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </Vortex>
        </div>

        {/* Enhanced floating elements - Only render on client and desktop */}
        {isClient && !isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2, duration: 1, type: "tween" }}
              className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-0"
              style={{
                transform: `translate(${calculateParallax(30).x}px, ${calculateParallax(30).y}px) translate(-50%, -50%)`,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  type: "tween",
                }}
              >
                <Lightbulb className="h-16 w-16 text-yellow-300/30" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.4, duration: 1, type: "tween" }}
              className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 z-0"
              style={{
                transform: `translate(${calculateParallax(20).x}px, ${calculateParallax(20).y}px) translate(50%, 50%)`,
              }}
            >
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -15, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  type: "tween",
                }}
              >
                <Brain className="h-20 w-20 text-purple-400/30" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.6, duration: 1, type: "tween" }}
              className="absolute top-1/3 right-1/3 z-0"
              style={{
                transform: `translate(${calculateParallax(40).x}px, ${calculateParallax(40).y}px)`,
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear", type: "tween" },
                  scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", type: "tween" },
                }}
              >
                <Zap className="h-12 w-12 text-blue-300/30" />
              </motion.div>
            </motion.div>
          </>
        )}
      </section>

      {/* Enhanced Teacher Mood Booster Section */}
      <section className="py-12 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-900/5 to-orange-900/10 pointer-events-none"></div>

        {/* Enhanced floating mood elements - Only render on client and desktop */}
        {isClient && !isMobile && (
          <>
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                type: "tween",
              }}
              className="absolute top-10 right-10 text-4xl md:text-6xl z-0"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear", type: "tween" }}
              >
                ☀️
              </motion.div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                type: "tween",
                delay: 1,
              }}
              className="absolute bottom-20 left-10 text-3xl md:text-5xl z-0"
            >
              🌈
            </motion.div>
          </>
        )}

        {/* Floating particles for mood booster */}
        <AnimatePresence>
          {moodBoosterParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0, x: particle.x + "%", y: particle.y + "%" }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [particle.y + "%", particle.y - 50 + "%"],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 3, ease: "easeOut", type: "tween" }}
              className="absolute text-xl md:text-2xl pointer-events-none z-20"
            >
              {particle.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "tween" }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 px-4"
              animate={
                isClient && !isMobile
                  ? {
                      textShadow: [
                        "0 0 20px rgba(255, 215, 0, 0.5)",
                        "0 0 40px rgba(255, 105, 180, 0.5)",
                        "0 0 20px rgba(255, 215, 0, 0.5)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, type: "tween" }}
            >
              <GradientText colors={["#FFD700", "#FF69B4", "#4ECDC4", "#45B7D1", "#FF6B6B"]}>
                ✨ Teacher Mood Booster ✨
              </GradientText>
            </motion.h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Because every teacher deserves a daily dose of appreciation, joy, and magical moments! 🌟💖
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Enhanced Main Mood Booster Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "tween" }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                key={currentMoodBooster}
                initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="glass-effect rounded-3xl p-6 md:p-8 relative overflow-hidden group h-full min-h-[350px] md:min-h-[400px]"
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${moodBoosters[currentMoodBooster].color} opacity-15 group-hover:opacity-25 transition-opacity duration-500`}
                ></div>

                {/* Animated background pattern - Only render on client and desktop */}
                {isClient && !isMobile && (
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                          type: "tween",
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="relative z-10 text-center h-full flex flex-col justify-center">
                  <motion.div
                    animate={
                      isClient && !isMobile
                        ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 360],
                            y: [0, -10, 0],
                          }
                        : {}
                    }
                    transition={{
                      scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", type: "tween" },
                      rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear", type: "tween" },
                      y: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", type: "tween" },
                    }}
                    className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${moodBoosters[currentMoodBooster].color} flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl`}
                  >
                    <motion.div
                      className="h-8 w-8 md:h-12 md:w-12 text-white"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear", type: "tween" }}
                    >
                      <Icon className="h-8 w-8 md:h-12 md:w-12" />
                    </motion.div>
                  </motion.div>

                  <motion.h3
                    className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white"
                    animate={
                      isClient && !isMobile
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{
                      scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", type: "tween" },
                    }}
                  >
                    {moodBoosters[currentMoodBooster].title}
                  </motion.h3>

                  <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-6 md:mb-8 px-2 md:px-4">
                    {moodBoosters[currentMoodBooster].message}
                  </p>

                  <motion.button
                    whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowCelebration(true)
                      createParticles()
                    }}
                    className={`mx-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${moodBoosters[currentMoodBooster].color} text-white rounded-full font-semibold hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                  >
                    <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
                      <Sparkle className="h-4 w-4 md:h-5 md:w-5" />
                      Spread the Magic!
                      <PartyPopper className="h-4 w-4 md:h-5 md:w-5" />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Interactive Fun Zone */}
            <div className="space-y-4 md:space-y-6">
              {/* Enhanced Teaching Facts Ticker */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "tween" }}
                viewport={{ once: true }}
                className="glass-effect rounded-2xl p-4 md:p-6 relative overflow-hidden group"
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                <div className="relative z-10">
                  <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-center flex items-center justify-center gap-2">
                    <Trophy className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                    <GradientText>Quick Teacher Facts</GradientText>
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                  </h4>
                  <motion.div
                    key={currentFact}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, type: "tween" }}
                    className="text-center text-lg md:text-xl font-medium text-yellow-300 bg-black/20 rounded-xl p-3 md:p-4 border border-yellow-400/30"
                  >
                    {teachingFacts[currentFact]}
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Virtual Coffee Break */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, type: "tween" }}
                viewport={{ once: true }}
                className="glass-effect rounded-2xl p-4 md:p-6 relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -2 }}
                onClick={createParticles}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 group-hover:from-amber-600/20 group-hover:to-yellow-600/20 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={
                      isClient && !isMobile
                        ? {
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.1, 1],
                            y: [0, -5, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      type: "tween",
                    }}
                    className="text-3xl md:text-5xl mb-3 md:mb-4"
                  >
                    ☕
                  </motion.div>
                  <h4 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-amber-300 flex items-center justify-center gap-2">
                    <Coffee className="h-4 w-4 md:h-5 md:w-5" />
                    Virtual Coffee Break
                    <Sun className="h-4 w-4 md:h-5 md:w-5" />
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Take a moment to breathe, smile, and appreciate the incredible educator you are! ✨
                  </p>
                  <motion.div
                    className="mt-2 md:mt-3 text-xs text-amber-200 opacity-70"
                    animate={isClient ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, type: "tween" }}
                  >
                    Click for a surprise! 🎁
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "tween" }}
                viewport={{ once: true }}
                className="glass-effect rounded-2xl p-4 md:p-6 relative overflow-hidden group"
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 group-hover:from-green-600/20 group-hover:to-emerald-600/20 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={
                      isClient && !isMobile
                        ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 360],
                          }
                        : {}
                    }
                    transition={{
                      scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, type: "tween" },
                      rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear", type: "tween" },
                    }}
                    className="text-3xl md:text-5xl mb-3 md:mb-4"
                  >
                    🏆
                  </motion.div>
                  <h4 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-green-300 flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4 md:h-5 md:w-5" />
                    Today's Achievement
                    <Star className="h-4 w-4 md:h-5 md:w-5" />
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    You showed up, you cared, and you made a difference! That's pure excellence! 🌟
                  </p>
                </div>
              </motion.div>

              {/* New Inspiration Generator */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: "tween" }}
                viewport={{ once: true }}
                className="glass-effect rounded-2xl p-4 md:p-6 relative overflow-hidden group cursor-pointer"
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                onClick={() => setCurrentQuote(Math.floor(Math.random() * teacherQuotes.length))}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={
                      isClient && !isMobile
                        ? {
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{
                      rotate: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear", type: "tween" },
                      scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, type: "tween" },
                    }}
                    className="text-3xl md:text-4xl mb-3 md:mb-4"
                  >
                    💫
                  </motion.div>
                  <h4 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-purple-300 flex items-center justify-center gap-2">
                    <Wand2 className="h-4 w-4 md:h-5 md:w-5" />
                    Inspiration Generator
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                  </h4>
                  <p className="text-gray-400 text-sm">Click for instant motivation and teaching wisdom! ✨</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Floating Encouragement Bubbles - Only render on client and desktop */}
          {isClient && !isMobile && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    y: [0, -150],
                    x: [0, Math.random() * 200 - 100],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 2.5,
                    ease: "easeOut",
                    type: "tween",
                  }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                  style={{ left: `${15 + i * 12}%` }}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm md:text-lg shadow-lg">
                    {["💖", "⭐", "🌟", "✨", "🎯", "🚀", "🎉", "💫"][i]}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "tween" }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <GradientText>Complete Teaching Toolkit</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Everything you need to create engaging lessons and support your students 🎓
            </p>
          </motion.div>

          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              href="/whiteboard"
              delay={0.25}
              emoji="🖼️"
            />
            <FeatureCard
              icon={ClipboardList}
              title="Create Worksheets"
              description="Design engaging worksheets and activities"
              href="/lesson-planning/worksheets"
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
              href="/ai-assistants/coding"
              delay={0.6}
              emoji="💻"
            />
            <FeatureCard
              icon={Users}
              title="Student Engagement"
              description="Tools to boost student participation and learning"
              href="/student-engagement"
              delay={0.65}
              emoji="👥"
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-12 md:py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 pointer-events-none"></div>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "tween" }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <GradientText colors={["#FF6EC7", "#6C5CE7", "#3A86FF"]}>Interactive Teaching Tools</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Engage your students with interactive content and real-time feedback 🎯
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
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
      <section className="py-12 md:py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-blue-900/10 pointer-events-none"></div>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "tween" }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <GradientText>Powered by Advanced AI</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              GurukulX leverages cutting-edge AI models to provide the best educational assistance 🚀
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "tween" }}
              viewport={{ once: true }}
              className="card-hover p-4 md:p-6 rounded-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="feature-icon mb-4 relative">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 relative">Llama 3.3 70B</h3>
              <p className="text-gray-400 relative text-sm md:text-base">
                Advanced language model for lesson planning, content generation, and educational assistance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "tween" }}
              viewport={{ once: true }}
              className="card-hover p-4 md:p-6 rounded-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="feature-icon mb-4 relative">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 relative">Qwen 2.5 Coder 32B</h3>
              <p className="text-gray-400 relative text-sm md:text-base">
                Specialized coding model for programming assistance, code review, and technical education.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "tween" }}
              viewport={{ once: true }}
              className="card-hover p-4 md:p-6 rounded-xl relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="feature-icon mb-4 relative">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 relative">Llama Vision</h3>
              <p className="text-gray-400 relative text-sm md:text-base">
                Advanced vision capabilities for analyzing educational diagrams, charts, and visual content.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Info Section */}
      <section className="py-12 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/20 pointer-events-none"></div>

        {/* Floating background elements - Only render on client and desktop */}
        {isClient && !isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              transition={{ duration: 2, type: "tween" }}
              viewport={{ once: true }}
              className="absolute top-10 left-10 z-0"
              style={{
                transform: `translate(${calculateParallax(50).x}px, ${calculateParallax(50).y}px)`,
              }}
            >
              <div className="float-slow">
                <Rocket className="h-24 w-24 text-purple-400/20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              transition={{ duration: 2, delay: 0.5, type: "tween" }}
              viewport={{ once: true }}
              className="absolute bottom-10 right-10 z-0"
              style={{
                transform: `translate(${calculateParallax(30).x}px, ${calculateParallax(30).y}px)`,
              }}
            >
              <div className="float">
                <Star className="h-20 w-20 text-yellow-400/20" />
              </div>
            </motion.div>
          </>
        )}

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "tween" }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
              <GradientText colors={["#FF6EC7", "#6C5CE7", "#3A86FF", "#00D4FF"]}>Meet the Developer</GradientText>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Passionate about creating innovative educational technology solutions 👨‍💻
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "tween" }}
              viewport={{ once: true }}
              className="glass-effect rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-pink-600/5 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-pink-600/10 transition-all duration-500"></div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                {/* Developer Avatar and Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "tween" }}
                  viewport={{ once: true }}
                  className="text-center md:text-left"
                >
                  <motion.div
                    whileHover={{ scale: isMobile ? 1 : 1.05, rotate: isMobile ? 0 : 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative inline-block mb-6"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-1">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl md:text-4xl font-bold">
                          AS
                        </div>
                      </div>
                    </div>
                    {isClient && !isMobile && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear", type: "tween" }}
                        className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-400/30"
                      ></motion.div>
                    )}
                  </motion.div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    <GradientText>Arav Saxena</GradientText>
                  </h3>
                  <p className="text-lg md:text-xl text-purple-300 mb-4">Full Stack Developer & AI Enthusiast 🚀</p>
                  <p className="text-gray-400 mb-6 leading-relaxed text-sm md:text-base">
                    Everyone is a slave to something fear, power, love, approval. Even those who claim to be free are
                    chained by their desires. But I've accepted my chains and turned them into weapons. Because the only
                    true freedom… is choosing what you're willing to be a slave for and never breaking ✨
                  </p>

                  {/* Fun Developer Stats */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: isMobile ? 1 : 1.05 }}
                      className="text-center p-2 md:p-3 rounded-lg bg-gradient-to-br from-purple-600/10 to-blue-600/10"
                    >
                      <div className="text-lg md:text-2xl font-bold text-purple-300">6+</div>
                      <div className="text-xs md:text-sm text-gray-400">Years Experience</div>
                      <div className="text-sm md:text-lg">🎯</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: isMobile ? 1 : 1.05 }}
                      className="text-center p-2 md:p-3 rounded-lg bg-gradient-to-br from-blue-600/10 to-pink-600/10"
                    >
                      <div className="text-lg md:text-2xl font-bold text-blue-300">10+</div>
                      <div className="text-xs md:text-sm text-gray-400">Projects Built</div>
                      <div className="text-sm md:text-lg">🏆</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: isMobile ? 1 : 1.05 }}
                      className="text-center p-2 md:p-3 rounded-lg bg-gradient-to-br from-pink-600/10 to-purple-600/10"
                    >
                      <div className="text-lg md:text-2xl font-bold text-pink-300">1000+</div>
                      <div className="text-xs md:text-sm text-gray-400">Teachers to help</div>
                      <div className="text-sm md:text-lg">👩‍🏫</div>
                    </motion.div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start gap-3 md:gap-4">
                    <motion.a
                      href="https://github.com/arav7781"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: isMobile ? 1 : 1.1, y: isMobile ? 0 : -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Github className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="https://www.linkedin.com/in/arav-saxena-a081a428a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: isMobile ? 1 : 1.1, y: isMobile ? 0 : -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="mailto:aravsaxena884@gmail.com"
                      whileHover={{ scale: isMobile ? 1 : 1.1, y: isMobile ? 0 : -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="https://arav-portfolio.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: isMobile ? 1 : 1.1, y: isMobile ? 0 : -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                    >
                      <Globe className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Skills Infinite Scroll */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "tween" }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <h4 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
                    <GradientText>Technologies & Skills</GradientText>
                  </h4>

                  {/* Infinite Scroll Skills */}
                  <div className="mb-6 md:mb-8">
                    <InfiniteScrollingSkills />
                  </div>

                  {/* Fun Facts */}
                  <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                    <h5 className="text-base md:text-lg font-semibold text-gray-300">Fun Facts 😄</h5>
                    <div className="space-y-2 md:space-y-3">
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
                          transition={{ duration: 0.5, delay: 1 + index * 0.1, type: "tween" }}
                          viewport={{ once: true }}
                          className="flex items-center gap-2 md:gap-3 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer text-sm md:text-base"
                          whileHover={{ x: isMobile ? 0 : 5 }}
                        >
                          <fact.icon className="h-3 w-3 md:h-4 md:w-4 text-purple-400 flex-shrink-0" />
                          <span>{fact.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Contact CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3, type: "tween" }}
                    viewport={{ once: true }}
                    className="mt-6 md:mt-8"
                  >
                    <Link href="https://linkedin.com/in/arav-saxena-a081a428a">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 relative overflow-hidden group">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                        <span className="relative z-10 flex items-center text-sm md:text-base">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Let's Connect 🤝
                        </span>
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "tween" }}
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <div className="glass-effect rounded-2xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-colors duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4">
                <GradientText>Ready to Transform Your Teaching?</GradientText>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Join thousands of educators who are already using AI to enhance their teaching and improve student
                outcomes. 🎓✨
              </p>
              <Link href="/lesson-planning">
                <Button
                  size={isMobile ? "default" : "lg"}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 relative overflow-hidden group"
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
      <footer className="relative py-12 md:py-16 px-4 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-blue-900/10 pointer-events-none"></div>

        {/* Floating footer elements - Only render on client and desktop */}
        {isClient && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            transition={{ duration: 2, type: "tween" }}
            viewport={{ once: true }}
            className="absolute top-5 left-5 z-0"
            style={{
              transform: `translate(${calculateParallax(60).x}px, ${calculateParallax(60).y}px)`,
            }}
          >
            <div className="float-slow">
              <Star className="h-8 w-8 text-yellow-400/30" />
            </div>
          </motion.div>
        )}

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "tween" }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF"]}>GurukulX</GradientText>
              </h3>
              <p className="text-gray-400 mb-4 md:mb-6 max-w-md text-sm md:text-base">
                Empowering educators with AI-powered tools to create engaging, personalized learning experiences for
                students across Indian colleges and universities. 🎓
              </p>
              <div className="flex gap-3 md:gap-4">
                <motion.a
                  href="https://github.com/arav7781"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: isMobile ? 1 : 1.1, y: isMobile ? 0 : -2 }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-purple-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Github className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/arav-saxena-a081a428a"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: isMobile ? 1 : 1.1, y: isMobile ? 0 : -2 }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-blue-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
                <motion.a
                  href="mailto:aravsaxena884@gmail.com"
                  whileHover={{ scale: isMobile ? 1 : 1.1, y: isMobile ? 0 : -2 }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-red-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "tween" }}
              viewport={{ once: true }}
            >
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Quick Links 🔗</h4>
              <ul className="space-y-1 md:space-y-2">
                {[
                  { name: "Lesson Planning", href: "/lesson-planning" },
                  { name: "Whiteboard", href: "/whiteboard" },
                  { name: "Worksheets", href: "/lesson-planning/worksheets" },
                  { name: "AI Assistants", href: "/ai-assistants" },
                  { name: "Coding Assistant", href: "/ai-assistants/coding" },
                  { name: "Research Support", href: "/research-support/summarize" },
                ].map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, type: "tween" }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-sm md:text-base"
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
              transition={{ duration: 0.8, delay: 0.2, type: "tween" }}
              viewport={{ once: true }}
            >
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Developer 👨‍💻</h4>
              <div className="space-y-2 md:space-y-3">
                <p className="text-gray-400 text-sm md:text-base">
                  Built with <Heart className="inline h-3 w-3 md:h-4 md:w-4 text-red-400 mx-1" /> by Arav Saxena
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  Passionate about AI, education, and creating meaningful technology solutions. 🚀
                </p>
                <div className="flex gap-2 mt-3 md:mt-4">
                  <motion.a
                    href="mailto:aravsaxena884@gmail.com"
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    className="text-xs md:text-sm bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 px-2 md:px-3 py-1 rounded-full text-gray-300 hover:text-white transition-all duration-300"
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
            transition={{ duration: 0.8, delay: 0.3, type: "tween" }}
            viewport={{ once: true }}
            className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4"
          >
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © 2024 GurukulX. All rights reserved. Made with passion for education. 💖
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
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
            transition={{ duration: 1, delay: 0.5, type: "tween" }}
            viewport={{ once: true }}
            className="mt-6 md:mt-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
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
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/10 to-blue-900/10 p-3 md:p-4">
      <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-12 md:before:w-16 before:bg-gradient-to-r before:from-gray-900 before:via-gray-900/50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-12 md:after:w-16 after:bg-gradient-to-l after:from-gray-900 after:via-gray-900/50 after:to-transparent">
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
            <div
              className="flex items-center gap-3 md:gap-4"
              key={loopIdx}
              style={{ width: `${setWidth}px`, flexShrink: 0 }}
            >
              {skills.map((skill, idx) => (
                <motion.div
                  key={`${loopIdx}-${idx}`}
                  className="flex-none min-w-[100px] md:min-w-[120px]"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${skill.color} flex items-center justify-center`}
                    >
                      <skill.icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
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
      transition={{ duration: 0.8, delay, type: "tween" }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card className="card-hover h-full relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative p-4 md:p-6">
          <div className="feature-icon mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center gap-2">
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
            {emoji && <span className="text-base md:text-lg">{emoji}</span>}
          </div>
          <CardTitle className="text-base md:text-lg group-hover:text-white transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-xs md:text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative p-4 md:p-6 pt-0">
          <Link href={href} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-white hover:bg-white/10 group-hover:border-white/30 transition-all duration-300 text-xs md:text-sm"
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
      transition={{ duration: 0.8, delay, type: "tween" }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="float-slow"
    >
      <div className="rounded-xl overflow-hidden relative group h-full">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
        ></div>
        <div className="glass-effect p-4 md:p-6 h-full relative">
          <div
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <h3 className="text-lg md:text-xl font-bold group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
            {emoji && <span className="text-lg md:text-xl">{emoji}</span>}
          </div>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm md:text-base">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
