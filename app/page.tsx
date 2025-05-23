"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText, ArrowRight, Sparkles, Code, Brain, Lightbulb, Zap } from "lucide-react"
import { Vortex } from "@/components/ui/vortex"
import { GradientText } from "@/components/ui/gradient-text"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

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
              title="Student Engagement"
              description="AI tutor chatbot, adaptive learning recommendations, and automated study guides."
              href="/student-engagement"
              delay={0.2}
            />
            <FeatureCard
              icon={FileText}
              title="Document Processing"
              description="Upload PDFs and Word documents for summarization, analysis, and content generation."
              href="/research-support"
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
              <h3 className="text-xl font-bold mb-3 relative">Vision Models</h3>
              <p className="text-gray-400 relative">
                Advanced vision capabilities for analyzing educational diagrams, charts, and visual content.
              </p>
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
