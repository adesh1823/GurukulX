"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  FileText,
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
  Rocket,
  Home,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  Share,
  Settings,
  HelpCircle,
  MessageSquare,
  PenTool,
  Clock,
  Target,
  TrendingUp,
  Search,
  Upload,
  X,
} from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started")

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      description: "Quick start guide for new teachers",
    },
    {
      id: "lesson-planning",
      title: "Lesson Planning",
      icon: BookOpen,
      description: "Create AI-powered lesson plans",
    },
    {
      id: "student-engagement",
      title: "Student Engagement",
      icon: Users,
      description: "Tools to engage your students",
    },
    {
      id: "ai-assistants",
      title: "AI Assistants",
      icon: Brain,
      description: "Specialized AI helpers",
    },
    {
      id: "document-processing",
      title: "Document Processing",
      icon: FileText,
      description: "Upload and analyze documents",
    },
    {
      id: "best-practices",
      title: "Best Practices",
      icon: Star,
      description: "Tips for effective teaching",
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: HelpCircle,
      description: "Common issues and solutions",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-2xl font-bold">
                <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7"]}>Teacher Documentation</GradientText>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                        activeSection === section.id
                          ? "bg-purple-600/20 text-white border border-purple-500/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <section.icon className="h-4 w-4 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs opacity-70">{section.description}</div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {activeSection === "getting-started" && <GettingStartedSection />}
              {activeSection === "lesson-planning" && <LessonPlanningSection />}
              {activeSection === "student-engagement" && <StudentEngagementSection />}
              {activeSection === "ai-assistants" && <AIAssistantsSection />}
              {activeSection === "document-processing" && <DocumentProcessingSection />}
              {activeSection === "best-practices" && <BestPracticesSection />}
              {activeSection === "troubleshooting" && <TroubleshootingSection />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Section Components
function GettingStartedSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          <GradientText>Getting Started with GurukulX</GradientText>
        </h2>
        <p className="text-gray-300 text-lg">
          Welcome to GurukulX! This comprehensive guide will help you get started with our AI-powered teaching platform
          designed specifically for Indian college educators.
        </p>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Quick Start (5 Minutes)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Step 1: Choose Your Tool</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-600/10 border border-purple-500/20">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="font-medium text-white">Lesson Planning</div>
                    <div className="text-sm text-gray-400">Create comprehensive lesson plans</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 border border-blue-500/20">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Student Engagement</div>
                    <div className="text-sm text-gray-400">Interactive learning tools</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-600/10 border border-green-500/20">
                  <Brain className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white">AI Assistants</div>
                    <div className="text-sm text-gray-400">Specialized AI helpers</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Step 2: Input Your Requirements</h4>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <div className="text-sm text-gray-300 mb-2">Example Input:</div>
                  <div className="text-xs text-gray-400 font-mono bg-black/30 p-2 rounded">
                    "Create a lesson plan for Data Structures and Algorithms, focusing on Binary Trees for 2nd year
                    Computer Science students. Duration: 90 minutes."
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Be specific about subject, topic, and student level</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Include duration and learning objectives</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Key Features Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureOverview
              icon={BookOpen}
              title="Lesson Planning"
              features={[
                "AI-generated lesson plans",
                "Slide deck creation",
                "Worksheet generation",
                "Assessment tools",
              ]}
              color="purple"
            />
            <FeatureOverview
              icon={Users}
              title="Student Engagement"
              features={["Interactive quizzes", "AI tutor chatbot", "Study guides", "Progress tracking"]}
              color="blue"
            />
            <FeatureOverview
              icon={FileText}
              title="Document Processing"
              features={["PDF analysis", "Content summarization", "Research assistance", "Citation generation"]}
              color="green"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Pro Tip for Indian Educators</h4>
              <p className="text-gray-300 text-sm">
                GurukulX is specifically designed for the Indian education system. You can reference AICTE guidelines,
                NEP 2020 recommendations, and Indian case studies in your prompts for more relevant content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LessonPlanningSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          <GradientText>Lesson Planning with AI</GradientText>
        </h2>
        <p className="text-gray-300 text-lg">
          Create comprehensive, engaging lesson plans tailored to your subject and student needs using our advanced AI
          models.
        </p>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="h-5 w-5" />
            How to Create a Lesson Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Navigate to Lesson Planning</h4>
                <p className="text-gray-400 text-sm">
                  Click on "Lesson Planning" from the main navigation or use the quick access button on the homepage.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Fill in the Details</h4>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Provide the following information:</p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>• Subject/Course name</li>
                    <li>• Topic or chapter</li>
                    <li>• Student level (1st year, 2nd year, etc.)</li>
                    <li>• Duration of the class</li>
                    <li>• Learning objectives</li>
                    <li>• Any specific requirements</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Generate and Customize</h4>
                <p className="text-gray-400 text-sm">
                  Click "Generate Lesson Plan" and review the AI-created content. You can then customize, edit, or
                  regenerate specific sections as needed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Sample Lesson Plan Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <h4 className="font-semibold text-white mb-3">Generated Lesson Plan Includes:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Learning Objectives</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Prerequisites</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Introduction (5-10 mins)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Main Content (60-70 mins)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Activities & Examples</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Assessment Methods</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Homework/Assignments</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Additional Resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Advanced Features</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Generate slide presentations automatically</li>
                <li>• Create worksheets and practice problems</li>
                <li>• Include Indian case studies and examples</li>
                <li>• Align with AICTE/UGC curriculum guidelines</li>
                <li>• Export to PDF, PowerPoint, or Word formats</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StudentEngagementSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          <GradientText>Student Engagement Tools</GradientText>
        </h2>
        <p className="text-gray-300 text-lg">
          Keep your students engaged with interactive tools, AI tutors, and personalized learning experiences.
        </p>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Tutor Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            The AI tutor provides 24/7 support to your students, answering questions and providing explanations in a
            conversational manner.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Features:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Subject-specific knowledge base
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Step-by-step problem solving
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Multilingual support (Hindi, English)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Progress tracking
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Best Practices:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Encourage specific questions
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Review chat logs for insights
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Set up custom knowledge base
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Monitor student engagement
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Interactive Quizzes & Assessments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-purple-600/10 border border-purple-500/20">
              <h4 className="font-semibold text-white mb-2">Quick Polls</h4>
              <p className="text-sm text-gray-400">Real-time classroom polling for instant feedback</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-500/20">
              <h4 className="font-semibold text-white mb-2">MCQ Generator</h4>
              <p className="text-sm text-gray-400">AI-generated multiple choice questions</p>
            </div>
            <div className="p-4 rounded-lg bg-green-600/10 border border-green-500/20">
              <h4 className="font-semibold text-white mb-2">Adaptive Tests</h4>
              <p className="text-sm text-gray-400">Difficulty adjusts based on student performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AIAssistantsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          <GradientText>AI Assistants</GradientText>
        </h2>
        <p className="text-gray-300 text-lg">
          Specialized AI assistants for different subjects and tasks, powered by advanced language models.
        </p>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="h-5 w-5" />
            Coding Assistant (Qwen 2.5 Coder)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Advanced coding assistance powered by Qwen 2.5 Coder 32B, specifically designed for programming education.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Capabilities:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  Code generation and explanation
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  Bug detection and fixing
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  Algorithm optimization
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  Multiple programming languages
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Supported Languages:</h4>
              <div className="flex flex-wrap gap-2">
                {["Python", "Java", "C++", "JavaScript", "C", "SQL", "HTML/CSS", "React"].map((lang) => (
                  <span key={lang} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            General Academic Assistant (Llama 3.3)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Comprehensive academic support powered by Llama 3.3 70B for all subjects and educational needs.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-purple-600/10 border border-purple-500/20">
              <h4 className="font-semibold text-white mb-2">Content Creation</h4>
              <p className="text-sm text-gray-400">Lesson plans, assignments, and educational materials</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-500/20">
              <h4 className="font-semibold text-white mb-2">Research Support</h4>
              <p className="text-sm text-gray-400">Literature reviews, citations, and academic writing</p>
            </div>
            <div className="p-4 rounded-lg bg-green-600/10 border border-green-500/20">
              <h4 className="font-semibold text-white mb-2">Question Answering</h4>
              <p className="text-sm text-gray-400">Detailed explanations across all academic subjects</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DocumentProcessingSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          <GradientText>Document Processing</GradientText>
        </h2>
        <p className="text-gray-300 text-lg">
          Upload and analyze PDFs, Word documents, and other files to extract insights and generate educational content.
        </p>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Supported File Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-red-600/10 border border-red-500/20 text-center">
              <FileText className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="font-semibold text-white">PDF</div>
              <div className="text-xs text-gray-400">Research papers, textbooks</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-500/20 text-center">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="font-semibold text-white">Word</div>
              <div className="text-xs text-gray-400">Documents, assignments</div>
            </div>
            <div className="p-4 rounded-lg bg-green-600/10 border border-green-500/20 text-center">
              <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="font-semibold text-white">PowerPoint</div>
              <div className="text-xs text-gray-400">Presentations, slides</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-600/10 border border-purple-500/20 text-center">
              <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="font-semibold text-white">Text</div>
              <div className="text-xs text-gray-400">Plain text files</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Processing Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Analysis Tools:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" />
                  Content summarization
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" />
                  Key concept extraction
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" />
                  Question generation
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" />
                  Citation formatting
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Output Options:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-green-400" />
                  Study guides
                </li>
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-green-400" />
                  Quiz questions
                </li>
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-green-400" />
                  Lesson plans
                </li>
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-green-400" />
                  Research summaries
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BestPracticesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          <GradientText>Best Practices</GradientText>
        </h2>
        <p className="text-gray-300 text-lg">
          Tips and strategies to maximize the effectiveness of GurukulX in your classroom.
        </p>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Effective Prompting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Do's
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Be specific about learning objectives</li>
                <li>• Include student level and background</li>
                <li>• Mention time constraints</li>
                <li>• Specify Indian context when relevant</li>
                <li>• Ask for examples and case studies</li>
                <li>• Request multiple difficulty levels</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <X className="h-5 w-5 text-red-400" />
                Don'ts
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Use vague or generic requests</li>
                <li>• Forget to mention student level</li>
                <li>• Skip context about your institution</li>
                <li>• Ignore curriculum guidelines</li>
                <li>• Request inappropriate content</li>
                <li>• Expect perfect results on first try</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Classroom Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-purple-600/10 border border-purple-500/20">
              <h4 className="font-semibold text-white mb-2">Before Class</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Generate lesson plans</li>
                <li>• Create presentation slides</li>
                <li>• Prepare quiz questions</li>
                <li>• Review AI suggestions</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-500/20">
              <h4 className="font-semibold text-white mb-2">During Class</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use interactive polls</li>
                <li>• Share AI-generated examples</li>
                <li>• Demonstrate coding solutions</li>
                <li>• Answer questions with AI help</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-green-600/10 border border-green-500/20">
              <h4 className="font-semibold text-white mb-2">After Class</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Generate study materials</li>
                <li>• Create assignments</li>
                <li>• Provide AI tutor access</li>
                <li>• Analyze student performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border-yellow-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Success Story</h4>
              <p className="text-gray-300 text-sm">
                "Using GurukulX, I've reduced my lesson planning time by 60% while improving student engagement. The
                AI-generated examples are particularly helpful for explaining complex algorithms to my computer science
                students." - Prof. Sharma, IIT Delhi
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TroubleshootingSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          <GradientText>Troubleshooting</GradientText>
        </h2>
        <p className="text-gray-300 text-lg">
          Common issues and their solutions to help you get the most out of GurukulX.
        </p>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Common Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-600/10 border border-red-500/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                AI responses are too generic
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Solution:</strong> Provide more specific context about your subject, student level, and learning
                objectives.
              </p>
              <p className="text-xs text-gray-500">
                Example: Instead of "Create a math lesson," try "Create a 90-minute calculus lesson on derivatives for
                2nd year engineering students with practical applications."
              </p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-600/10 border border-yellow-500/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                Content doesn't match Indian curriculum
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Solution:</strong> Explicitly mention Indian context, AICTE guidelines, or specific university
                curriculum in your prompts.
              </p>
              <p className="text-xs text-gray-500">
                Example: "Following AICTE curriculum guidelines for computer science..."
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-600/10 border border-blue-500/20">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                File upload not working
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                <strong>Solution:</strong> Check file size (max 10MB) and format. Ensure stable internet connection.
              </p>
              <p className="text-xs text-gray-500">Supported formats: PDF, DOCX, PPTX, TXT</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Getting Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Contact Support</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>aravsaxena884@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Github className="h-4 w-4 text-purple-400" />
                  <span>github.com/arav7781</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Linkedin className="h-4 w-4 text-blue-400" />
                  <span>LinkedIn: Arav Saxena</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Response Times</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span>Email: 24-48 hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>GitHub Issues: 1-3 days</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span>LinkedIn: 12-24 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border-green-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">We're Here to Help!</h4>
              <p className="text-gray-300 text-sm">
                GurukulX is built by educators, for educators. If you're facing any issues or have suggestions for
                improvement, don't hesitate to reach out. Your feedback helps us make the platform better for all
                teachers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper component for feature overview
function FeatureOverview({
  icon: Icon,
  title,
  features,
  color,
}: {
  icon: React.ElementType
  title: string
  features: string[]
  color: string
}) {
  return (
    <div className={`p-4 rounded-lg bg-${color}-600/10 border border-${color}-500/20`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 text-${color}-400`} />
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      <ul className="space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400`}></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}
