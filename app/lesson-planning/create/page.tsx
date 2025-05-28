"use client"
import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  BookOpen,
  Download,
  Copy,
  Sparkles,
  GraduationCap,
  Type,
  Palette,
  Bold,
  Italic,
  Underline,
  ImageIcon,
  Edit,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { GradientText } from "@/components/ui/gradient-text"

const Index = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [lessonPlan, setLessonPlan] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  // Form state
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [duration, setDuration] = useState("")
  const [learningObjectives, setLearningObjectives] = useState("")

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Styling states for editor
  const [selectedFont, setSelectedFont] = useState("serif")
  const [fontSize, setFontSize] = useState([16])
  const [textColor, setTextColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fontOptions = [
    { value: "serif", label: "Times New Roman", className: "font-serif" },
    { value: "sans", label: "Arial", className: "font-sans" },
    { value: "mono", label: "Courier New", className: "font-mono" },
    { value: "playfair", label: "Playfair Display", className: "font-playfair" },
    { value: "inter", label: "Inter", className: "font-inter" },
    { value: "roboto", label: "Roboto", className: "font-roboto" },
  ]

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
    setMetadata(null)

    try {
      const response = await fetch("/api/lesson-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic,
          gradeLevel,
          duration,
          learningObjectives,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate lesson plan")
      }

      const data = await response.json()
      setLessonPlan(data.lessonPlan)
      setMetadata(data.metadata)

      toast({
        title: "Lesson Plan Generated",
        description: "Your AI-powered lesson plan has been successfully created for Indian academic context.",
      })
    } catch (error) {
      console.error("Error generating lesson plan:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate lesson plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (lessonPlan) {
      navigator.clipboard.writeText(lessonPlan)
      toast({
        title: "Copied",
        description: "Lesson plan copied to clipboard",
      })
    }
  }

  const downloadPlan = () => {
    if (lessonPlan && metadata) {
      // Create a hidden iframe for PDF generation
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      document.body.appendChild(iframe)

      const doc = iframe.contentWindow?.document
      if (!doc) {
        toast({
          title: "Download Error",
          description: "Failed to create PDF. Please try again.",
          variant: "destructive",
        })
        document.body.removeChild(iframe)
        return
      }

      // Prepare content with metadata and lesson plan
      const content = `
        <html>
          <head>
            <title>Lesson Plan - ${metadata.topic}</title>
            <style>
              body {
                font-family: Times New Roman, serif;
                margin: 20px;
                line-height: 1.6;
                color: #000000;
              }
              h1 {
                font-size: 24px;
                font-weight: bold;
                color: #fb923c;
              }
              h2 {
                font-size: 18px;
                font-weight: 600;
                color: #4ade80;
              }
              h3 {
                font-size: 16px;
                font-weight: 500;
                color: #60a5fa;
              }
              p {
                margin-bottom: 12px;
              }
              ul {
                margin-left: 20px;
                margin-bottom: 12px;
              }
              li {
                margin-bottom: 4px;
              }
              .metadata {
                margin-bottom: 20px;
                padding: 10px;
                border: 1px solid #ccc;
                background-color: #f9f9f9;
              }
              img {
                max-width: 100%;
                height: auto;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="metadata">
              <h1>${metadata.subject} - ${metadata.topic}</h1>
              <p><strong>Generated on:</strong> ${new Date(metadata.generatedAt).toLocaleDateString("en-IN")}</p>
              <p><strong>Grade Level:</strong> ${metadata.gradeLevel}</p>
              <p><strong>Duration:</strong> ${metadata.duration}</p>
            </div>
            ${lessonPlan.replace(/\n/g, "<br>").replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, '<img src="$2" alt="$1">')}
          </body>
        </html>
      `

      try {
        // Write content to iframe
        doc.open()
        doc.write(content)
        doc.close()

        // Wait for content to load, then trigger print
        setTimeout(() => {
          iframe.contentWindow?.focus()
          iframe.contentWindow?.print()
          // Clean up iframe after print dialog is triggered
          setTimeout(() => {
            document.body.removeChild(iframe)
          }, 1000)
        }, 500)

        toast({
          title: "Download Initiated",
          description: "Please select 'Save as PDF' in the print dialog to download your lesson plan.",
        })
      } catch (error) {
        console.error("Error during PDF generation:", error)
        toast({
          title: "Download Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive",
        })
        document.body.removeChild(iframe)
      }
    }
  }

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const imageMarkdown = `\n\n![${file.name}](${imageUrl})\n\n`

        setLessonPlan((prev) => (prev ? prev + imageMarkdown : imageMarkdown))
        toast({
          title: "Image Added",
          description: "The image has been added to your lesson plan.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const insertFormatting = (format: string) => {
    if (!textareaRef.current || !isEditing) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = lessonPlan?.substring(start, end) || ""

    let formattedText = ""

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      default:
        return
    }

    const newContent = (lessonPlan?.substring(0, start) || "") + formattedText + (lessonPlan?.substring(end) || "")

    setLessonPlan(newContent)

    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
      }
    }, 0)
  }

  const getSelectedFontClass = () => {
    const font = fontOptions.find((f) => f.value === selectedFont)
    return font ? font.className : "font-serif"
  }

  const getTextStyle = () => ({
    fontSize: `${fontSize[0]}px`,
    color: textColor,
    backgroundColor: backgroundColor,
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
    textDecoration: isUnderline ? "underline" : "none",
  })

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }

  return (
    <div className="min-h-screen p-6 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <style>{`
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
        
        .markdown-content h1 {
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(to right, #fb923c, #4ade80, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #4ade80;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .markdown-content h3 {
          font-size: 1.25rem;
          font-weight: 500;
          color: #60a5fa;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .markdown-content p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          color: #000000;
        }
        
        .markdown-content strong {
          font-weight: 600;
          color: #fb923c;
        }
        
        .markdown-content ul {
          margin-left: 1rem;
          margin-bottom: 0.75rem;
        }
        
        .markdown-content li {
          margin-bottom: 0.25rem;
          color: #000000;
          position: relative;
        }
        
        .markdown-content li::before {
          content: "•";
          color: #4ade80;
          position: absolute;
          left: -1rem;
        }
        
        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin: 1rem 0;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/2 via-green-900/5 to-blue-900/2 pointer-events-none"></div>
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-purple-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <GradientText>GX Lesson Planner</GradientText>
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Create comprehensive lesson plans tailored for Indian higher education with AI-powered insights and
            culturally relevant content
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Sparkles className="h-4 w-4 mr-2" />
            Optimized for Indian Academic Context & NEP 2020 Guidelines
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
                  Lesson Plan Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in the details below to generate your custom lesson plan optimized for Indian students and
                  academic standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Subject</label>
                    <Input
                      placeholder="e.g., Computer Science, Physics, Literature, Economics"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.subject && <p className="text-sm text-red-400">{errors.subject}</p>}
                    <p className="text-sm text-gray-400">The main subject area for this lesson.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Topic</label>
                    <Input
                      placeholder="e.g., Data Structures, Quantum Mechanics, Indian Constitution"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.topic && <p className="text-sm text-red-400">{errors.topic}</p>}
                    <p className="text-sm text-gray-400">The specific topic within the subject.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Grade Level</label>
                      <Select value={gradeLevel} onValueChange={setGradeLevel}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
                      {errors.gradeLevel && <p className="text-sm text-red-400">{errors.gradeLevel}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Duration</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
                      {errors.duration && <p className="text-sm text-red-400">{errors.duration}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Learning Objectives</label>
                    <Textarea
                      placeholder="e.g., Students will understand the fundamentals of linked lists, implement basic operations, and analyze their applications in Indian software industry contexts."
                      className="min-h-[120px] bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      value={learningObjectives}
                      onChange={(e) => setLearningObjectives(e.target.value)}
                    />
                    {errors.learningObjectives && <p className="text-sm text-red-400">{errors.learningObjectives}</p>}
                    <p className="text-sm text-gray-400">
                      What students should learn or be able to do after the lesson. Be specific and measurable.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 hover:from-orange-700 hover:via-green-700 hover:to-blue-700 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600/40 via-green-600/40 to-blue-600/40 group-hover:scale-150 transition-transform duration-500 rounded-md blur-md opacity-0 group-hover:opacity-100"></span>
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating AI Lesson Plan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate AI Lesson Plan
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-green-500" />
                    Editable Lesson Plan
                  </div>
                  {lessonPlan && (
                    <Button variant="outline" size="sm" onClick={toggleEditMode} className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Eye className="h-4 w-4" />
                          Preview
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          Edit
                        </>
                      )}
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your AI-generated lesson plan optimized for Indian academic context. Click Edit to modify content or
                  use Preview to see formatted output.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px] overflow-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
                      <div className="absolute inset-0 blur-xl bg-orange-500/20 animate-pulse rounded-full"></div>
                    </div>
                    <p className="text-lg font-medium mb-2 text-white">Creating your personalized lesson plan...</p>
                    <p className="text-sm text-gray-400 text-center max-w-md">
                      Our AI is crafting a comprehensive lesson plan with Indian cultural context, practical examples,
                      and NEP 2020 alignment
                    </p>
                  </div>
                ) : lessonPlan ? (
                  <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-gray-400" />
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                          <SelectTrigger className="w-[180px] bg-gray-700/50 border-gray-600">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Size:</span>
                        <div className="w-24">
                          <Slider
                            value={fontSize}
                            onValueChange={setFontSize}
                            max={32}
                            min={10}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-8">{fontSize[0]}px</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={isBold ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setIsBold(!isBold)
                            insertFormatting("bold")
                          }}
                          className="h-8 w-8 p-0"
                          disabled={!isEditing}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={isItalic ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setIsItalic(!isItalic)
                            insertFormatting("italic")
                          }}
                          className="h-8 w-8 p-0"
                          disabled={!isEditing}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={isUnderline ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setIsUnderline(!isUnderline)
                            insertFormatting("underline")
                          }}
                          className="h-8 w-8 p-0"
                          disabled={!isEditing}
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-gray-400" />
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded border-none cursor-pointer"
                          title="Text Color"
                        />
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-8 h-8 rounded border-none cursor-pointer"
                          title="Background Color"
                        />
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={handleAddImage}
                        disabled={!isEditing}
                      >
                        <ImageIcon className="h-4 w-4" />
                        Add Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    {/* Content Area */}
                    <div
                      className={`${getSelectedFontClass()}`}
                      style={{
                        ...getTextStyle(),
                        minHeight: "500px",
                        borderRadius: "12px",
                        padding: "2rem",
                        backgroundColor: "#ffffff",
                        boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {metadata && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-green-500/10 rounded-lg border border-orange-500/20">
                          <h4 className="text-sm font-medium text-orange-600 mb-2">Lesson Plan Details</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>Subject: {metadata.subject}</div>
                            <div>Grade: {metadata.gradeLevel}</div>
                            <div>Duration: {metadata.duration}</div>
                            <div>Generated: {new Date(metadata.generatedAt).toLocaleDateString("en-IN")}</div>
                          </div>
                        </div>
                      )}

                      {isEditing ? (
                        <Textarea
                          ref={textareaRef}
                          value={lessonPlan}
                          onChange={(e) => setLessonPlan(e.target.value)}
                          className="w-full min-h-[400px] border-none resize-none focus:ring-0 focus:outline-none bg-transparent text-black"
                          style={getTextStyle()}
                          placeholder="Edit your lesson plan here..."
                        />
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{lessonPlan}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="relative">
                      <BookOpen className="h-20 w-20 text-gray-500 mb-6" />
                      <div className="absolute inset-0 blur-xl bg-green-500/10 animate-pulse rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Ready to Create</h3>
                    <p className="text-gray-400 mb-4 max-w-md">
                      Fill out the form and click "Generate AI Lesson Plan" to create your custom lesson plan optimized
                      for Indian academic context.
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>✓ Culturally relevant examples and case studies</p>
                      <p>✓ NEP 2020 aligned pedagogical approaches</p>
                      <p>✓ Interactive activities for diverse learning styles</p>
                      <p>✓ Assessment methods suitable for Indian classrooms</p>
                    </div>
                  </div>
                )}
              </CardContent>
              {lessonPlan && (
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={downloadPlan}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
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

export default Index