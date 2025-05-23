"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BookOpen, Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { GradientText } from "@/components/ui/gradient-text"

export default function CreateLessonPlan() {
  const [isLoading, setIsLoading] = useState(false)
  const [lessonPlan, setLessonPlan] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [duration, setDuration] = useState("")
  const [learningObjectives, setLearningObjectives] = useState("")

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!subject || subject.length < 2) {
      newErrors.subject = "Subject must be at least 2 characters."
    }

    if (!topic || topic.length < 2) {
      newErrors.topic = "Topic must be at least 2 characters."
    }

    if (!gradeLevel) {
      newErrors.gradeLevel = "Please select a grade level."
    }

    if (!duration) {
      newErrors.duration = "Please select a duration."
    }

    if (!learningObjectives || learningObjectives.length < 10) {
      newErrors.learningObjectives = "Learning objectives must be at least 10 characters."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Form Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setLessonPlan(null)

    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate a delay and use mock responses
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response
      const mockLessonPlan = `
# Lesson Plan: ${topic}

## Subject: ${subject}
## Grade Level: ${gradeLevel.replace("_", " ")}
## Duration: ${duration.replace("_", " ")}

## Learning Objectives:
${learningObjectives}

## Introduction/Hook (10 minutes):
- Begin with an engaging question about ${topic}
- Show a brief video clip or image related to ${topic}
- Conduct a quick poll to gauge students' prior knowledge

## Main Content (${duration === "30_minutes" ? "15" : duration === "45_minutes" ? "25" : duration === "60_minutes" ? "35" : duration === "90_minutes" ? "60" : "80"} minutes):

### Key Concept 1:
- Definition and explanation
- Examples and illustrations
- Guided practice activity

### Key Concept 2:
- Definition and explanation
- Examples and illustrations
- Guided practice activity

### Key Concept 3:
- Definition and explanation
- Examples and illustrations
- Guided practice activity

## Assessment (${duration === "30_minutes" ? "5" : duration === "45_minutes" ? "10" : duration === "60_minutes" ? "15" : duration === "90_minutes" ? "20" : "30"} minutes):
- Quick quiz on main concepts
- Group discussion questions
- Problem-solving exercise

## Conclusion (5 minutes):
- Recap of key points
- Address any remaining questions
- Preview of next lesson

## Resources Needed:
- Textbook: "Introduction to ${subject}"
- Handouts on ${topic}
- Digital presentation slides
- Video resources

## Homework/Follow-up Activities:
- Reading assignment: Chapter on ${topic}
- Practice problems related to ${topic}
- Research project on applications of ${topic} in the Indian context

## Additional Notes:
- Adapt examples to be relevant to Indian college students
- Include references to local applications and case studies
- Consider varying levels of prior knowledge among students
      `

      setLessonPlan(mockLessonPlan)

      toast({
        title: "Lesson Plan Generated",
        description: "Your lesson plan has been successfully created.",
      })
    } catch (error) {
      console.error("Error generating lesson plan:", error)
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-purple-900/5 pointer-events-none"></div>
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <GradientText>Create Lesson Plan</GradientText>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Generate a comprehensive lesson plan tailored to your specific requirements
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass-effect border border-white/10">
              <CardHeader>
                <CardTitle>Lesson Plan Details</CardTitle>
                <CardDescription>Fill in the details below to generate your custom lesson plan.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="e.g., Computer Science, Physics, Literature"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
                    <p className="text-sm text-muted-foreground">The main subject area for this lesson.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic</label>
                    <Input
                      placeholder="e.g., Data Structures, Quantum Mechanics"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                    {errors.topic && <p className="text-sm text-red-500">{errors.topic}</p>}
                    <p className="text-sm text-muted-foreground">The specific topic within the subject.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Grade Level</label>
                      <Select value={gradeLevel} onValueChange={setGradeLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="undergraduate_1">Undergraduate 1st Year</SelectItem>
                          <SelectItem value="undergraduate_2">Undergraduate 2nd Year</SelectItem>
                          <SelectItem value="undergraduate_3">Undergraduate 3rd Year</SelectItem>
                          <SelectItem value="undergraduate_4">Undergraduate 4th Year</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gradeLevel && <p className="text-sm text-red-500">{errors.gradeLevel}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30_minutes">30 Minutes</SelectItem>
                          <SelectItem value="45_minutes">45 Minutes</SelectItem>
                          <SelectItem value="60_minutes">60 Minutes</SelectItem>
                          <SelectItem value="90_minutes">90 Minutes</SelectItem>
                          <SelectItem value="120_minutes">120 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Learning Objectives</label>
                    <Textarea
                      placeholder="e.g., Students will be able to understand the concept of linked lists and implement basic operations."
                      className="min-h-[120px]"
                      value={learningObjectives}
                      onChange={(e) => setLearningObjectives(e.target.value)}
                    />
                    {errors.learningObjectives && <p className="text-sm text-red-500">{errors.learningObjectives}</p>}
                    <p className="text-sm text-muted-foreground">
                      What students should learn or be able to do after the lesson.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Generate Lesson Plan
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="glass-effect h-full border border-white/10">
              <CardHeader>
                <CardTitle>Generated Lesson Plan</CardTitle>
                <CardDescription>Your AI-generated lesson plan will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[600px] overflow-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                      <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse rounded-full"></div>
                    </div>
                    <p className="text-lg font-medium mb-2">Generating your lesson plan...</p>
                    <p className="text-sm text-gray-400">This may take a few moments</p>
                  </div>
                ) : lessonPlan ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm">
                      {lessonPlan.split("\n\n").map((paragraph, i) => {
                        // Check if this is a main heading (starts with #)
                        if (paragraph.trim().match(/^#\s+/)) {
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.5 }}
                              className="mt-8 mb-4"
                            >
                              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                                {paragraph.replace(/^#\s+/, "")}
                              </h1>
                            </motion.div>
                          )
                        }
                        // Check if this is a section header (starts with ##)
                        else if (paragraph.trim().match(/^##\s+/)) {
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.5 }}
                              className="mt-6 mb-3"
                            >
                              <h2 className="text-xl font-semibold text-blue-300">{paragraph.replace(/^##\s+/, "")}</h2>
                            </motion.div>
                          )
                        }
                        // Check if this is a subsection header (starts with ###)
                        else if (paragraph.trim().match(/^###\s+/)) {
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.5 }}
                              className="mt-4 mb-2"
                            >
                              <h3 className="text-lg font-medium text-green-300">{paragraph.replace(/^###\s+/, "")}</h3>
                            </motion.div>
                          )
                        }
                        // Regular paragraph
                        else {
                          return (
                            <motion.p
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.5 }}
                              className="mb-4 text-gray-300"
                            >
                              {paragraph}
                            </motion.p>
                          )
                        }
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="relative">
                      <BookOpen className="h-20 w-20 text-gray-500 mb-6" />
                      <div className="absolute inset-0 blur-xl bg-blue-500/10 animate-pulse rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Create</h3>
                    <p className="text-gray-400 mb-4 max-w-md">
                      Fill out the form and click "Generate Lesson Plan" to create your custom lesson plan.
                    </p>
                    <p className="text-sm text-gray-500">
                      The AI will create a structured lesson plan based on your inputs, including introduction, main
                      content, activities, assessment methods, and resources.
                    </p>
                  </div>
                )}
              </CardContent>
              {lessonPlan && (
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(lessonPlan)
                      toast({
                        title: "Copied",
                        description: "Lesson plan copied to clipboard",
                      })
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([lessonPlan], { type: "text/plain" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "lesson-plan.txt"
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
