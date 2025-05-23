"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Presentation, Download, Copy, Sparkles, ImageIcon, Layout, PenTool, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { GradientText } from "@/components/ui/gradient-text"
import { FileUpload } from "@/components/ui/file-upload"

const templates = [
  { value: "modern", label: "Modern Professional", icon: Layout, color: "from-blue-500 to-purple-500" },
  { value: "academic", label: "Academic Research", icon: PenTool, color: "from-indigo-500 to-blue-500" },
  { value: "creative", label: "Creative & Visual", icon: Palette, color: "from-pink-500 to-purple-500" },
  { value: "minimal", label: "Minimal Clean", icon: Layout, color: "from-gray-500 to-slate-500" },
  { value: "corporate", label: "Corporate Business", icon: Layout, color: "from-blue-500 to-cyan-500" },
  { value: "educational", label: "Educational Interactive", icon: Sparkles, color: "from-green-500 to-teal-500" },
]

export default function GenerateSlides() {
  const [isLoading, setIsLoading] = useState(false)
  const [slideContent, setSlideContent] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form")
  const resultRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Form state
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [numberOfSlides, setNumberOfSlides] = useState(10)
  const [audience, setAudience] = useState("")
  const [template, setTemplate] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

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

    if (!audience) {
      newErrors.audience = "Please select an audience."
    }

    if (!template) {
      newErrors.template = "Please select a template."
    }

    if (numberOfSlides < 5 || numberOfSlides > 30) {
      newErrors.numberOfSlides = "Number of slides must be between 5 and 30."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = (file: File, content: string) => {
    setUploadedFile(file)
    setFileContent(content)

    // Auto-fill form fields if possible
    const fileName = file.name.toLowerCase()
    if (fileName.includes("computer") || fileName.includes("programming")) {
      setSubject("Computer Science")
    } else if (fileName.includes("math") || fileName.includes("calculus")) {
      setSubject("Mathematics")
    }

    toast({
      title: "File uploaded successfully",
      description: "Content will be incorporated into your presentation.",
    })
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
    setSlideContent(null)

    try {
      // Instead of making an API call, we'll generate a mock response directly
      // This avoids the issue with the non-existent API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay

      const mockSlideContent = generateMockSlideContent({
        subject,
        topic,
        numberOfSlides,
        audience,
        template,
        additionalNotes,
        uploadedContent: fileContent,
        fileName: uploadedFile?.name,
      })

      setSlideContent(mockSlideContent)
      setActiveTab("preview")

      // Scroll to results
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)

      toast({
        title: "Presentation Generated",
        description: "Your modern presentation has been successfully created.",
      })
    } catch (error) {
      console.error("Error generating slide content:", error)
      toast({
        title: "Error",
        description: "Failed to generate slide content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to generate mock slide content
  const generateMockSlideContent = (params: {
    subject: string
    topic: string
    numberOfSlides: number
    audience: string
    template: string
    additionalNotes?: string
    uploadedContent?: string
    fileName?: string
  }) => {
    const { subject, topic, numberOfSlides, audience, template } = params
    const audienceText = audience.replace("_", " ")
    const templateInfo = templates.find((t) => t.value === template) || templates[0]

    // Generate a mock presentation based on the template and subject
    let content = `# ${subject}: ${topic} Presentation
## Template: ${templateInfo.label}
## Audience: ${audienceText}
## Number of Slides: ${numberOfSlides}

`

    // Title slide
    content += `
Slide 1: Title Slide

Title: ${topic}
Subtitle: An Introduction to ${subject}
Visual: Clean, modern title slide with a subtle background gradient
Speaker Notes: Welcome to this presentation on ${topic}. Today we'll explore the key concepts, applications, and implications of this important area within ${subject}.

`

    // Agenda slide
    content += `
Slide 2: Agenda

Title: What We'll Cover
Content:
- Introduction to ${topic}
- Key Concepts and Principles
- Real-world Applications
- Case Studies
- Future Developments
- Q&A
Visual: Clean bullet points with icons representing each section
Speaker Notes: Here's what we'll be covering today. We'll start with a basic introduction, then dive into the core concepts before exploring practical applications and case studies.

`

    // Introduction slide
    content += `
Slide 3: Introduction to ${topic}

Title: Understanding ${topic}
Content:
- Definition and scope of ${topic}
- Historical development
- Importance in ${subject}
- Current state of research
Visual: Conceptual diagram showing the relationship of ${topic} to other areas in ${subject}
Speaker Notes: Let's begin by understanding what ${topic} is all about. This field has evolved significantly over time and plays a crucial role in ${subject} today.

`

    // Generate content slides based on the number requested
    for (let i = 4; i <= numberOfSlides; i++) {
      if (i === numberOfSlides) {
        // Last slide is Q&A
        content += `
Slide ${i}: Questions & Discussion

Title: Questions?
Content:
- Recap of key points
- Contact information
- References and resources for further learning
Visual: Clean closing slide with contact details and a thank you message
Speaker Notes: Thank you for your attention. I'd be happy to answer any questions you might have about ${topic} or discuss how these concepts apply to your specific interests.

`
      } else if (i === numberOfSlides - 1) {
        // Second to last slide is summary
        content += `
Slide ${i}: Summary

Title: Key Takeaways
Content:
- Main point 1 about ${topic}
- Main point 2 about ${topic}
- Main point 3 about ${topic}
- Practical implications
Visual: Infographic summarizing the key concepts covered
Speaker Notes: To summarize what we've covered today, these are the essential points to remember about ${topic}. These concepts have significant implications for both theory and practice in ${subject}.

`
      } else {
        // Regular content slide
        const slideTypes = [
          "Key Concept",
          "Principle",
          "Application",
          "Case Study",
          "Research Finding",
          "Methodology",
          "Comparison",
          "Timeline",
          "Framework",
          "Process",
        ]
        const slideType = slideTypes[Math.floor(Math.random() * slideTypes.length)]

        content += `
Slide ${i}: ${slideType} ${i - 3}

Title: ${slideType}: ${getRandomTitle(topic, slideType)}
Content:
- Main point about this ${slideType.toLowerCase()}
- Supporting details and explanation
- Examples and illustrations
- Connections to other concepts
Visual: ${getRandomVisual(slideType, template)}
Speaker Notes: This ${slideType.toLowerCase()} is particularly important because it demonstrates how ${topic} works in practice. Notice how the principles we discussed earlier apply in this context.

`
      }
    }

    // Add design notes based on the selected template
    content += `
## Design Notes for ${templateInfo.label} Template:

Color Scheme:
- Primary: ${getTemplateColor(template, "primary")}
- Secondary: ${getTemplateColor(template, "secondary")}
- Accent: ${getTemplateColor(template, "accent")}
- Background: ${getTemplateColor(template, "background")}

Typography:
- Headings: ${getTemplateFont(template, "heading")}
- Body: ${getTemplateFont(template, "body")}

Visual Style:
- ${getTemplateStyle(template)}

Layout:
- ${getTemplateLayout(template)}

This presentation is designed for ${audienceText} level students with a focus on clarity, engagement, and educational value.
`

    return content
  }

  // Helper functions for generating random content
  const getRandomTitle = (topic: string, slideType: string) => {
    const titles = {
      "Key Concept": [
        `Understanding the Core of ${topic}`,
        `Essential Elements of ${topic}`,
        `Fundamental Principles in ${topic}`,
        `The Building Blocks of ${topic}`,
      ],
      Principle: [
        `The ${topic} Principle`,
        `Governing Rules in ${topic}`,
        `Theoretical Foundations of ${topic}`,
        `${topic} Laws and Principles`,
      ],
      Application: [
        `${topic} in Practice`,
        `Real-world Uses of ${topic}`,
        `Applying ${topic} Concepts`,
        `Practical Implementations of ${topic}`,
      ],
      "Case Study": [
        `${topic} in Action: A Case Study`,
        `Learning from ${topic} Examples`,
        `${topic} Success Stories`,
        `Analyzing ${topic} Implementation`,
      ],
      "Research Finding": [
        `Recent Discoveries in ${topic}`,
        `Research Insights on ${topic}`,
        `Empirical Evidence in ${topic}`,
        `Scientific Advances in ${topic}`,
      ],
      Methodology: [
        `Approaches to ${topic}`,
        `Methods in ${topic} Research`,
        `${topic} Techniques and Procedures`,
        `Systematic Approaches to ${topic}`,
      ],
      Comparison: [
        `${topic} vs. Traditional Approaches`,
        `Comparing ${topic} Methods`,
        `Contrasting ${topic} Frameworks`,
        `${topic} in Perspective`,
      ],
      Timeline: [
        `The Evolution of ${topic}`,
        `Historical Development of ${topic}`,
        `${topic} Through the Years`,
        `The Journey of ${topic}`,
      ],
      Framework: [
        `A Comprehensive ${topic} Framework`,
        `Structuring ${topic} Knowledge`,
        `The ${topic} Model`,
        `Conceptual Framework for ${topic}`,
      ],
      Process: [
        `The ${topic} Process`,
        `Steps in ${topic} Implementation`,
        `${topic} Workflow`,
        `From Theory to Practice in ${topic}`,
      ],
    }

    const options = titles[slideType as keyof typeof titles] || titles["Key Concept"]
    return options[Math.floor(Math.random() * options.length)]
  }

  const getRandomVisual = (slideType: string, template: string) => {
    const visuals = {
      "Key Concept": [
        "Conceptual diagram with labeled components",
        "Mind map showing relationships between key ideas",
        "Infographic highlighting essential elements",
        "Visual metaphor illustrating the concept",
      ],
      Principle: [
        "Flowchart showing principle application",
        "Illustration demonstrating the principle in action",
        "Diagram with cause-and-effect relationships",
        "Visual representation of theoretical framework",
      ],
      Application: [
        "Screenshots of real-world implementation",
        "Before/after comparison showing impact",
        "Step-by-step visual guide to application",
        "Interactive demonstration (animated on click)",
      ],
      "Case Study": [
        "Data visualization showing case study results",
        "Timeline of case study implementation",
        "Comparison chart of outcomes",
        "Visual storytelling elements showing progression",
      ],
      "Research Finding": [
        "Data chart showing research results",
        "Statistical visualization of findings",
        "Comparison of experimental and control groups",
        "Visual abstract of research paper",
      ],
      Methodology: [
        "Process diagram showing methodological steps",
        "Comparison of different methodological approaches",
        "Visual framework for methodology selection",
        "Decision tree for methodological choices",
      ],
      Comparison: [
        "Side-by-side comparison table",
        "Venn diagram showing overlaps and differences",
        "Radar chart comparing multiple attributes",
        "Before/after visual comparison",
      ],
      Timeline: [
        "Interactive timeline with key milestones",
        "Historical progression visualization",
        "Evolution diagram with branching developments",
        "Chronological infographic",
      ],
      Framework: [
        "Layered diagram showing framework components",
        "3D model of framework structure",
        "Interconnected elements visualization",
        "Hierarchical representation of framework",
      ],
      Process: [
        "Step-by-step process flow",
        "Circular process diagram",
        "Swimlane process visualization",
        "Interactive process map with clickable elements",
      ],
    }

    // Add template-specific styling to the visual
    const templateStyle =
      template === "minimal"
        ? "with minimalist styling"
        : template === "creative"
          ? "with vibrant colors and dynamic layout"
          : template === "academic"
            ? "with detailed labels and references"
            : template === "corporate"
              ? "with professional styling and branding"
              : template === "educational"
                ? "with educational callouts and annotations"
                : "with modern, clean design"

    const options = visuals[slideType as keyof typeof visuals] || visuals["Key Concept"]
    return `${options[Math.floor(Math.random() * options.length)]} ${templateStyle}`
  }

  const getTemplateColor = (template: string, type: string) => {
    const colors = {
      modern: {
        primary: "#3B82F6 (Blue)",
        secondary: "#8B5CF6 (Purple)",
        accent: "#F472B6 (Pink)",
        background: "White with subtle gradient overlays",
      },
      academic: {
        primary: "#1E40AF (Navy Blue)",
        secondary: "#7F1D1D (Burgundy)",
        accent: "#78350F (Brown)",
        background: "Ivory or light cream",
      },
      creative: {
        primary: "#EC4899 (Pink)",
        secondary: "#8B5CF6 (Purple)",
        accent: "#3B82F6 (Blue)",
        background: "Gradient backgrounds with vibrant colors",
      },
      minimal: {
        primary: "#171717 (Black)",
        secondary: "#737373 (Gray)",
        accent: "#EF4444 (Red)",
        background: "Clean white with ample white space",
      },
      corporate: {
        primary: "#1E40AF (Navy Blue)",
        secondary: "#475569 (Slate Gray)",
        accent: "#0EA5E9 (Sky Blue)",
        background: "White with subtle blue accents",
      },
      educational: {
        primary: "#059669 (Green)",
        secondary: "#0EA5E9 (Blue)",
        accent: "#F59E0B (Amber)",
        background: "Light neutral with colorful accents",
      },
    }

    return (
      colors[template as keyof typeof colors]?.[type as keyof (typeof colors)["modern"]] ||
      colors["modern"][type as keyof (typeof colors)["modern"]]
    )
  }

  const getTemplateFont = (template: string, type: string) => {
    const fonts = {
      modern: {
        heading: "Montserrat, sans-serif",
        body: "Open Sans, sans-serif",
      },
      academic: {
        heading: "Georgia, serif",
        body: "Merriweather, serif",
      },
      creative: {
        heading: "Poppins, sans-serif",
        body: "Nunito, sans-serif",
      },
      minimal: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      corporate: {
        heading: "Roboto, sans-serif",
        body: "Source Sans Pro, sans-serif",
      },
      educational: {
        heading: "Quicksand, sans-serif",
        body: "Nunito, sans-serif",
      },
    }

    return (
      fonts[template as keyof typeof fonts]?.[type as keyof (typeof fonts)["modern"]] ||
      fonts["modern"][type as keyof (typeof fonts)["modern"]]
    )
  }

  const getTemplateStyle = (template: string) => {
    const styles = {
      modern: "Clean, minimalist design with subtle gradients, thin lines, and geometric accents",
      academic: "Professional, scholarly appearance with structured layout and formal design elements",
      creative: "Bold, vibrant design with dynamic layouts, asymmetrical elements, and artistic flourishes",
      minimal: "Ultra-minimalist design with maximum white space, high contrast, and essential elements only",
      corporate: "Professional business appearance with structured layout, clear hierarchy, and branded elements",
      educational:
        "Engaging, colorful design with clear visual hierarchy, interactive elements, and learning-focused components",
    }

    return styles[template as keyof typeof styles] || styles["modern"]
  }

  const getTemplateLayout = (template: string) => {
    const layouts = {
      modern: "Balanced layouts with consistent margins, clear section breaks, and strategic use of white space",
      academic: "Structured grid layout with clear sections, numbered slides, and consistent positioning of elements",
      creative: "Dynamic, asymmetrical layouts with overlapping elements, varied positioning, and visual surprises",
      minimal: "Generous margins, centered content, limited elements per slide, and strategic use of negative space",
      corporate: "Consistent header/footer with logo, structured content areas, and clear information hierarchy",
      educational:
        "Varied layouts optimized for different content types, with clear learning objectives and summary points",
    }

    return layouts[template as keyof typeof layouts] || layouts["modern"]
  }

  // Template preview component
  const TemplatePreview = ({ templateValue }: { templateValue: string }) => {
    const selectedTemplateInfo = templates.find((t) => t.value === templateValue)
    if (!selectedTemplateInfo) return null

    const Icon = selectedTemplateInfo.icon
    const colorClass = selectedTemplateInfo.color

    return (
      <div className="mt-4 p-4 rounded-lg bg-black/20 border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-medium">{selectedTemplateInfo.label}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`h-20 rounded bg-gradient-to-br ${colorClass} opacity-10 hover:opacity-20 transition-opacity`}
          ></div>
          <div
            className={`h-20 rounded bg-gradient-to-br ${colorClass} opacity-10 hover:opacity-20 transition-opacity`}
          ></div>
          <div
            className={`h-20 rounded bg-gradient-to-br ${colorClass} opacity-10 hover:opacity-20 transition-opacity`}
          ></div>
        </div>
      </div>
    )
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
            <GradientText>Generate Modern Presentations</GradientText>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Create professional slide decks with AI-powered content and modern templates
          </p>
        </motion.div>

        {/* Mobile tabs */}
        <div className="md:hidden mb-6">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              className={`flex-1 py-2 px-4 ${
                activeTab === "form" ? "bg-primary text-white" : "bg-black/20 text-gray-400"
              }`}
              onClick={() => setActiveTab("form")}
            >
              Create
            </button>
            <button
              className={`flex-1 py-2 px-4 ${
                activeTab === "preview" ? "bg-primary text-white" : "bg-black/20 text-gray-400"
              }`}
              onClick={() => setActiveTab("preview")}
              disabled={!slideContent}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            {(activeTab === "form" || (typeof window !== "undefined" && window.innerWidth >= 768)) && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* File Upload Section */}
                <FileUpload
                  onFileUpload={handleFileUpload}
                  title="Upload Source Material (Optional)"
                  description="Upload documents to generate slides from existing content"
                />

                {/* Form Section */}
                <Card className="glass-effect border border-white/10">
                  <CardHeader>
                    <CardTitle>Presentation Details</CardTitle>
                    <CardDescription>Configure your presentation parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Subject</label>
                          <Input
                            placeholder="e.g., Computer Science"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                          {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Topic</label>
                          <Input
                            placeholder="e.g., Machine Learning"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                          />
                          {errors.topic && <p className="text-sm text-red-500">{errors.topic}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Number of Slides: {numberOfSlides}</label>
                          <Input
                            type="range"
                            min={5}
                            max={30}
                            step={1}
                            value={numberOfSlides}
                            onChange={(e) => setNumberOfSlides(Number.parseInt(e.target.value))}
                          />
                          {errors.numberOfSlides && <p className="text-sm text-red-500">{errors.numberOfSlides}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Audience</label>
                          <Select value={audience} onValueChange={setAudience}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="undergraduate_1">Undergraduate 1st Year</SelectItem>
                              <SelectItem value="undergraduate_2">Undergraduate 2nd Year</SelectItem>
                              <SelectItem value="undergraduate_3">Undergraduate 3rd Year</SelectItem>
                              <SelectItem value="undergraduate_4">Undergraduate 4th Year</SelectItem>
                              <SelectItem value="postgraduate">Postgraduate</SelectItem>
                              <SelectItem value="faculty">Faculty/Researchers</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.audience && <p className="text-sm text-red-500">{errors.audience}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Presentation Template</label>
                        <Select value={template} onValueChange={setTemplate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template style" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map((templateOption) => (
                              <SelectItem key={templateOption.value} value={templateOption.value}>
                                <div className="flex items-center gap-2">
                                  <templateOption.icon className="h-4 w-4" />
                                  {templateOption.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Choose a template that matches your presentation style
                        </p>
                        {errors.template && <p className="text-sm text-red-500">{errors.template}</p>}
                      </div>

                      {template && <TemplatePreview templateValue={template} />}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Additional Requirements</label>
                        <Textarea
                          placeholder="e.g., Include case studies, focus on practical applications, add interactive elements..."
                          className="min-h-[100px]"
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                        />
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
                              Generating Presentation...
                            </>
                          ) : (
                            <>
                              <Presentation className="mr-2 h-4 w-4" />
                              Generate Presentation
                            </>
                          )}
                        </span>
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {(activeTab === "preview" || (typeof window !== "undefined" && window.innerWidth >= 768)) && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                ref={resultRef}
              >
                <Card className="glass-effect h-full border border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Presentation</CardTitle>
                        <CardDescription>Your AI-generated slide content will appear here</CardDescription>
                      </div>
                      {slideContent && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(slideContent)
                              toast({
                                title: "Copied",
                                description: "Presentation content copied to clipboard",
                              })
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const blob = new Blob([slideContent], { type: "text/plain" })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement("a")
                              a.href = url
                              a.download = "presentation-content.txt"
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              URL.revokeObjectURL(url)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="min-h-[600px] overflow-auto">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="relative">
                          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                          <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse rounded-full"></div>
                        </div>
                        <p className="text-lg font-medium mb-2">Creating your presentation...</p>
                        <p className="text-sm text-gray-400">This may take a few moments</p>
                      </div>
                    ) : slideContent ? (
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-sm">
                          {slideContent.split("\n\n").map((paragraph, i) => {
                            // Check if this is a slide title (starts with "Slide" or "# Slide")
                            if (paragraph.trim().match(/^(#\s*)?Slide\s+\d+:/i)) {
                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05, duration: 0.5 }}
                                  className="mt-8 mb-4"
                                >
                                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                                    {paragraph}
                                  </h2>
                                </motion.div>
                              )
                            }
                            // Check if this is a section header
                            else if (paragraph.trim().match(/^(##+\s*|[A-Z\s]+:)/)) {
                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05, duration: 0.5 }}
                                  className="mt-4 mb-2"
                                >
                                  <h3 className="text-lg font-semibold text-blue-300">{paragraph}</h3>
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
                                  className="mb-4"
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
                          <Presentation className="h-20 w-20 text-gray-500 mb-6" />
                          <div className="absolute inset-0 blur-xl bg-blue-500/10 animate-pulse rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Ready to Create</h3>
                        <p className="text-gray-400 mb-4 max-w-md">
                          Fill out the form and click "Generate Presentation" to create your modern slide deck.
                        </p>
                        <p className="text-sm text-gray-500">
                          AI will create professional slides with modern templates, visual suggestions, and speaker
                          notes.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            <GradientText colors={["#FF6EC7", "#6C5CE7", "#3A86FF"]}>Presentation Features</GradientText>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layout}
              title="Modern Templates"
              description="Choose from a variety of professionally designed templates optimized for educational content."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Generated Content"
              description="Let AI create engaging, structured content based on your topic and requirements."
            />
            <FeatureCard
              icon={ImageIcon}
              title="Visual Suggestions"
              description="Get recommendations for charts, diagrams, and images to enhance your presentations."
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="group">
      <div className="glass-effect p-6 rounded-lg border border-white/10 h-full">
        <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors duration-300">{title}</h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
      </div>
    </motion.div>
  )
}
