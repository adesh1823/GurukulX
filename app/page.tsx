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
  Star,
  Github,
  Linkedin,
  Mail,
  Heart,
  Trophy,
  Rocket,
  Award,
  Globe,
  Database,
  Cpu,
  Eye,
  Mic,
} from "lucide-react"
import { Vortex } from "@/components/ui/vortex"
import { GradientText } from "@/components/ui/gradient-text"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import ChatFeatures from "@/components/whatsapp"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

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

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  // Calculate parallax effect based on mouse position
  const calculateParallax = (depth = 20) => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const moveX = (mousePosition.x - centerX) / depth
    const moveY = (mousePosition.y - centerY) / depth
    return { x: moveX, y: moveY }
  }

  return (
    <div className="min-h-screen">
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
                  TeachAI
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
              <GradientText>Key Features</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powered by advanced AI models including Llama 3.3 and Qwen 2.5 Coder
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={BookOpen}
              title="Lesson Planning"
              description="AI-generated lesson plans, slide decks, and worksheets with modern templates."
              href="/lesson-planning"
              delay={0.1}
            />
            <FeatureCard
              icon={Users}
              title="Question Paper Generator"
              description="Question paper generation, custom editing recommendations, and automated paper generation."
              href="/student-engagement/chatbot"
              delay={0.2}
            />
            <FeatureCard
              icon={FileText}
              title="Document Processing"
              description="Upload PDFs and Word documents for summarization, analysis, and content generation."
              href="/research-support/summarize"
              delay={0.3}
            />
            <FeatureCard
              icon={Code}
              title="Coding Assistant"
              description="Advanced coding help powered by Qwen 2.5 Coder for programming courses."
              href="/ai-assistants/coding"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Chat Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 pointer-events-none"></div>
        <ChatFeatures />
      </section>

      {/* Interactive Demo Section */}
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
              <GradientText colors={["#FF6EC7", "#6C5CE7", "#3A86FF"]}>Interactive Teaching Tools</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Engage your students with interactive content and real-time feedback
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <InteractiveCard
              title="Real-time Quizzes"
              description="Create interactive quizzes with automatic grading and instant feedback for students."
              icon={Zap}
              color="from-pink-500 to-red-500"
              delay={0.1}
            />
            <InteractiveCard
              title="Concept Visualizations"
              description="Generate interactive visualizations to explain complex concepts in an engaging way."
              icon={Brain}
              color="from-blue-500 to-purple-500"
              delay={0.3}
            />
            <InteractiveCard
              title="Adaptive Learning"
              description="Personalized learning paths that adapt to each student's progress and understanding."
              icon={Lightbulb}
              color="from-yellow-500 to-orange-500"
              delay={0.5}
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
              TeachAI leverages cutting-edge AI models to provide the best educational assistance
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
              <h3 className="text-xl font-bold mb-3 relative">LLAMA4 Scout Vision</h3>
              <p className="text-gray-400 relative">
                Advanced vision capabilities for analyzing educational diagrams, charts, and visual content.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Spotlight Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/20 to-blue-900/10 pointer-events-none"></div>

        {/* Floating background elements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="absolute top-10 left-10 z-0"
          style={{ x: calculateParallax(50).x, y: calculateParallax(50).y }}
        >
          <div className="float-slow">
            <Rocket className="h-24 w-24 text-purple-400/30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute bottom-10 right-10 z-0"
          style={{ x: calculateParallax(40).x, y: calculateParallax(40).y }}
        >
          <div className="float">
            <Trophy className="h-20 w-20 text-yellow-400/30" />
          </div>
        </motion.div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText colors={["#FF6EC7", "#6C5CE7", "#3A86FF", "#00D4FF"]}>Meet the Creator</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Passionate about AI innovation and educational technology
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="glass-effect rounded-3xl p-8 md:p-12 relative overflow-hidden group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-pink-600/5 group-hover:from-purple-600/10 group-hover:via-blue-600/10 group-hover:to-pink-600/10 transition-all duration-700"></div>

              <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                {/* Profile Section */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center md:text-left"
                >
                  <div className="relative mb-6 inline-block">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-white mx-auto md:mx-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <span className="relative z-10">AS</span>
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7"]}>Arav Saxena</GradientText>
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm">He/Him</p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs font-medium">
                      AI Researcher
                    </span>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                      Full-Stack Dev
                    </span>
                    <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-xs font-medium">
                      Hackathon Finalist
                    </span>
                  </div>

                  <div className="flex gap-3 justify-center md:justify-start">
                    <motion.a
                      href="https://github.com/arav7781"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-purple-600/20 flex items-center justify-center transition-all duration-300"
                    >
                      <Github className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    </motion.a>
                    <motion.a
                      href="https://linkedin.com/in/arav-saxena-a081a428a"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600/20 flex items-center justify-center transition-all duration-300"
                    >
                      <Linkedin className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    </motion.a>
                    <motion.a
                      href="mailto:aravsaxena884@gmail.com"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600/20 flex items-center justify-center transition-all duration-300"
                    >
                      <Mail className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Achievements & Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/10">
                      <div className="text-2xl font-bold text-purple-300 mb-1">7+</div>
                      <div className="text-xs text-gray-400">AI Apps Built</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-green-600/10 border border-white/10">
                      <div className="text-2xl font-bold text-blue-300 mb-1">11+</div>
                      <div className="text-xs text-gray-400">AI Models Trained</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-600/10 to-yellow-600/10 border border-white/10">
                      <div className="text-2xl font-bold text-green-300 mb-1">4+</div>
                      <div className="text-xs text-gray-400">LLMs Fine-tuned</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-600/10 to-red-600/10 border border-white/10">
                      <div className="text-2xl font-bold text-yellow-300 mb-1">🥉</div>
                      <div className="text-xs text-gray-400">Recent Win</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-white">Latest Achievement</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      🏆 3rd Prize at Hack Your Path 6.0 - National Level Hackathon
                    </p>
                  </div>
                </motion.div>

                {/* Expertise & Tech Stack */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      <span>AI Expertise</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: Brain, label: "Agentic AI", color: "purple" },
                        { icon: Mic, label: "Voice AI", color: "blue" },
                        { icon: Eye, label: "Vision AI", color: "green" },
                        { icon: Globe, label: "LLMs", color: "pink" },
                      ].map((tech, index) => (
                        <motion.div
                          key={tech.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                          viewport={{ once: true }}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full bg-${tech.color}-600/20 text-${tech.color}-300 text-xs`}
                        >
                          <tech.icon className="h-3 w-3" />
                          <span>{tech.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-400" />
                      <span>Tech Stack</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: Code, label: "React/Next.js", color: "blue" },
                        { icon: Database, label: "Node.js", color: "green" },
                        { icon: Cpu, label: "Python", color: "yellow" },
                        { icon: Brain, label: "TensorFlow", color: "orange" },
                      ].map((tech, index) => (
                        <motion.div
                          key={tech.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                          viewport={{ once: true }}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full bg-${tech.color}-600/20 text-${tech.color}-300 text-xs`}
                        >
                          <tech.icon className="h-3 w-3" />
                          <span>{tech.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    viewport={{ once: true }}
                    className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-semibold text-white">Current Focus</span>
                    </div>
                    <p className="text-xs text-gray-300">
                      🔬 Exploring Google A2A & Microsoft MCP for next-gen AI applications
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                viewport={{ once: true }}
                className="mt-8 pt-6 border-t border-white/10 text-center relative z-10"
              >
                <p className="text-gray-300 italic text-sm md:text-base">
                  "Passionate about blending innovation with practicality to create meaningful AI solutions for
                  education"
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-xs text-gray-400">Symbiosis International University</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-400">BTech AI (2023-2027)</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
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
                outcomes.
              </p>
              <Link href="/lesson-planning">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                  <span className="relative z-10 flex items-center">
                    Start Creating{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative py-12 md:py-16 px-4 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-blue-900/10 pointer-events-none"></div>

        {/* Floating footer elements - Only render on client and desktop */}

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
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-purple-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Github className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/arav-saxena-a081a428a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-blue-600/20 flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-white transition-colors" />
                </motion.a>
                <motion.a
                  href="mailto:aravsaxena884@gmail.com"
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

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  delay?: number
}

function FeatureCard({ icon: Icon, title, description, href, delay = 0 }: FeatureCardProps) {
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
          <div className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl group-hover:text-white transition-colors duration-300">{title}</CardTitle>
          <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="relative">
          <Link href={href} className="w-full">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 group-hover:border-white/30 transition-all duration-300"
            >
              <span className="flex items-center">
                Explore
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
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
}

function InteractiveCard({ title, description, icon: Icon, color, delay = 0 }: InteractiveCardProps) {
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
          <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">{title}</h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
