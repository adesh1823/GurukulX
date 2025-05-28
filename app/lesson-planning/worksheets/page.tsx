"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, FileQuestion, Download, Copy, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"

// Define available question types
const questionTypes = [
  { id: "mcq", label: "Multiple Choice Questions" },
  { id: "short_answer", label: "Short Answer Questions" },
  { id: "long_answer", label: "Long Answer Questions" },
  { id: "true_false", label: "True/False Questions" },
  { id: "matching", label: "Matching Questions" },
  { id: "diagram", label: "Diagram-based Questions" },
] as const

// Define the form schema with validation
const formSchema = z.object({
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  gradeLevel: z.string({
    required_error: "Please select a grade level.",
  }),
  difficultyLevel: z.string({
    required_error: "Please select a difficulty level.",
  }),
  questionTypes: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one question type.",
  }),
  numberOfQuestions: z.number().min(5).max(20),
})

// Type for form values inferred from the schema
type FormValues = z.infer<typeof formSchema>

export default function CreateWorksheet() {
  const [isLoading, setIsLoading] = useState(false)
  const [worksheet, setWorksheet] = useState<string[]>([])
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [formData, setFormData] = useState<FormValues | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [isInitialRender, setIsInitialRender] = useState(true)
  const { toast } = useToast()

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      topic: "",
      gradeLevel: "",
      difficultyLevel: "",
      questionTypes: [],
      numberOfQuestions: 10,
    },
  })

  // Animate worksheet lines only on initial render
  useEffect(() => {
    if (worksheet.length > 0) {
      setDisplayedLines([])
      worksheet.forEach((line, index) => {
        setTimeout(
          () => {
            setDisplayedLines((prev) => [...prev, line])
          },
          isInitialRender ? index * 300 : 0, // Apply delay only on initial render
        )
      })
    }
  }, [worksheet, isInitialRender])

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setWorksheet([])
    setDisplayedLines([])
    setFormData(values)
    setEditMode(false)
    setIsInitialRender(true) // Enable animation for new worksheet

    try {
      const response = await fetch("/api/worksheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate worksheet")
      }

      // Clean and split the worksheet into lines
      const cleanedLines = data.worksheet
        .split("\n")
        .map((line: string) => line.replace(/[#*`]/g, "").trim())
        .filter((line: string) => line.length > 0)

      setWorksheet(cleanedLines)

      toast({
        title: "Worksheet Generated",
        description: "Your worksheet has been successfully created.",
      })
    } catch (error) {
      console.error("Error generating worksheet:", error)
      toast({
        title: "Error",
        description: "Failed to generate worksheet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate and download PDF
  const handleDownloadText = () => {
    if (!formData || worksheet.length === 0) return

    // Create the content for the text file
    const content =
      `Worksheet: ${formData.subject} - ${formData.topic}\n` +
      `Grade: ${formData.gradeLevel}, Difficulty: ${formData.difficultyLevel}\n` +
      `Questions:\n` +
      worksheet.join("\n")

    // Create a Blob with the text content
    const blob = new Blob([content], { type: "text/plain" })

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob)

    // Create a temporary link element for downloading
    const link = document.createElement("a")
    link.href = url
    link.download = "worksheet.txt" // Download as a .txt file
    document.body.appendChild(link)
    link.click()

    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-12 px-4">
        {/* Header with animated gradient */}
        <div className="mb-12 relative">
          <div className="absolute -top-20 left-0 right-0 h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 opacity-20 blur-3xl rounded-full"></div>
          <h1 className="text-6xl font-bold mb-4 text-center  z-10">
            <GradientText>Create Worksheet</GradientText>
          </h1>
          <p className="text-gray-300 text-center text-xl max-w-2xl mx-auto">
            Generate interactive worksheets and quizzes with various question types and difficulty levels.
          </p>
        </div>

        {/* Form Card */}
        <Card className="mb-12 border-0 bg-gray-900/70 backdrop-blur-sm shadow-xl shadow-purple-900/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 opacity-50"></div>
          <CardHeader className="relative z-10 border-b border-gray-800">
            <CardTitle className="text-2xl text-cyan-300">Worksheet Details</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details below to generate your custom worksheet.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Subject & Topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Computer Science, Physics"
                            {...field}
                            className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          The main subject area for this worksheet.
                        </FormDescription>
                        <FormMessage className="text-pink-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Topic</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Data Structures, Quantum Mechanics"
                            {...field}
                            className="bg-gray-800/50 border-gray-700 focus:border-purple-500 text-white"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          The specific topic within the subject.
                        </FormDescription>
                        <FormMessage className="text-pink-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Grade Level and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Grade Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="undergraduate_1">Undergraduate 1st Year</SelectItem>
                            <SelectItem value="undergraduate_2">Undergraduate 2nd Year</SelectItem>
                            <SelectItem value="undergraduate_3">Undergraduate 3rd Year</SelectItem>
                            <SelectItem value="undergraduate_4">Undergraduate 4th Year</SelectItem>
                            <SelectItem value="postgraduate">Postgraduate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-pink-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                            <SelectItem value="challenging">Challenging</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-pink-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Question Types */}
                <FormField
                  control={form.control}
                  name="questionTypes"
                  render={() => (
                    <FormItem className="bg-gray-800/30 p-6 rounded-lg border border-gray-800">
                      <div className="mb-4">
                        <FormLabel className="text-xl text-cyan-300">Question Types</FormLabel>
                        <FormDescription className="text-gray-400">
                          Select the types of questions to include.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {questionTypes.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="questionTypes"
                            render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}
                                    className="border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-300">{item.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage className="text-pink-400 mt-2" />
                    </FormItem>
                  )}
                />

                {/* Number of Questions */}
                <FormField
                  control={form.control}
                  name="numberOfQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-gray-200">Number of Questions</FormLabel>
                        <span className="text-2xl font-bold text-cyan-400">{field.value}</span>
                      </div>
                      <FormControl>
                        <div className="relative pt-1">
                          <Input
                            type="range"
                            min={5}
                            max={20}
                            step={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                          <div className="flex justify-between text-xs text-gray-400 px-1 pt-2">
                            <span>5</span>
                            <span>10</span>
                            <span>15</span>
                            <span>20</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Select the number of questions (5-20).
                      </FormDescription>
                      <FormMessage className="text-pink-400" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Worksheet"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Worksheet Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <Loader2 className="h-16 w-16 animate-spin text-cyan-400 relative z-10" />
            </div>
            <p className="text-gray-300 mt-6 text-xl font-light">Generating your worksheet...</p>
            <div className="mt-4 flex space-x-2">
              <span className="h-3 w-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-3 w-3 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-3 w-3 bg-cyan-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        ) : editMode ? (
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto border">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Edit Worksheet</h2>
            <p className="text-sm text-gray-600 mb-6">Modify the content below:</p>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-64 p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            ></textarea>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  const newLines = editContent
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0)
                  setWorksheet(newLines)
                  setEditMode(false)
                  setIsInitialRender(false) // Disable animation after saving
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="border-gray-300 text-white hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : displayedLines.length > 0 ? (
          <div className="relative bg-white p-12 rounded-xl shadow-xl max-w-4xl mx-auto border overflow-hidden">
            {/* Worksheet Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{formData?.subject}</h1>
              <h2 className="text-2xl text-gray-600 mb-4">{formData?.topic}</h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <strong>Grade:</strong> {formData?.gradeLevel?.replace(/_/g, " ")}
                </div>
                <div>
                  <strong>Difficulty:</strong> {formData?.difficultyLevel}
                </div>
                <div>
                  <strong>Name:</strong> _________________________
                </div>
                <div>
                  <strong>Date:</strong> _________________________
                </div>
              </div>
            </div>

            {/* Action Buttons - Floating */}
            <div className="absolute top-4 right-4 flex gap-2 print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditContent(worksheet.join("\n"))
                  setEditMode(true)
                }}
                className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(worksheet.join("\n"))
                  toast({
                    title: "Copied",
                    description: "Worksheet copied to clipboard",
                  })
                }}
                className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadText}
                className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 text-gray-700 shadow-lg"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>

            {/* Worksheet Content */}
            <div className="space-y-3">
              {displayedLines.map((line, index) => (
                <div key={index} className="worksheet-line">
                  <div
                    className={`text-gray-800 text-lg leading-relaxed ${isInitialRender ? "animate-text-reveal" : ""}`}
                    style={
                      isInitialRender
                        ? {
                            animationDelay: `${index * 0.15}s`,
                          }
                        : {}
                    }
                  >
                    {line}
                  </div>
                  {isInitialRender && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 animate-line-reveal opacity-30"
                      style={{
                        animationDelay: `${index * 0.15}s`,
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>End of Worksheet</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full opacity-20 blur-xl"></div>
              <FileQuestion className="h-24 w-24 text-gray-500 relative z-10" />
            </div>
            <h3 className="mt-8 text-2xl font-light text-gray-300">No Worksheet Generated Yet</h3>
            <p className="text-gray-400 mt-4 max-w-md">
              Fill out the form and click "Generate Worksheet" to create your custom worksheet.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              The AI will create a worksheet with the specified question types and difficulty level.
            </p>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes text-reveal {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes line-reveal {
          0% {
            transform: scaleX(1);
            opacity: 0.5;
          }
          50% {
            transform: scaleX(1);
            opacity: 0.3;
          }
          100% {
            transform: scaleX(0);
            opacity: 0;
          }
        }
        
        .animate-text-reveal {
          animation: text-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform: translateY(20px);
          opacity: 0;
        }
        
        .animate-line-reveal {
          animation: line-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: left;
        }
        
        .worksheet-line {
          position: relative;
          padding: 0.5rem 0;
          overflow: hidden;
        }

        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
