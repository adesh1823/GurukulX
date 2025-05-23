"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, FileQuestion } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const questionTypes = [
  {
    id: "mcq",
    label: "Multiple Choice Questions",
  },
  {
    id: "short_answer",
    label: "Short Answer Questions",
  },
  {
    id: "long_answer",
    label: "Long Answer Questions",
  },
  {
    id: "true_false",
    label: "True/False Questions",
  },
  {
    id: "matching",
    label: "Matching Questions",
  },
  {
    id: "diagram",
    label: "Diagram-based Questions",
  },
] as const

// Define the form schema with proper types
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

// Define the type for the form values
type FormValues = z.infer<typeof formSchema>

export default function CreateWorksheet() {
  const [isLoading, setIsLoading] = useState(false)
  const [worksheet, setWorksheet] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize the form with proper default values
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

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setWorksheet(null)

    try {
      // Simulate API call for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response
      const mockWorksheet = `
# ${values.subject}: ${values.topic} Worksheet
## Grade Level: ${values.gradeLevel.replace("_", " ")}
## Difficulty: ${values.difficultyLevel}

${
  values.questionTypes.includes("mcq")
    ? `
### Multiple Choice Questions

1. What is the primary function of ${values.topic}?
   a) Function A
   b) Function B
   c) Function C
   d) Function D

2. Which of the following best describes ${values.topic}?
   a) Description A
   b) Description B
   c) Description C
   d) Description D

3. In the context of ${values.subject}, what role does ${values.topic} play?
   a) Role A
   b) Role B
   c) Role C
   d) Role D
`
    : ""
}

${
  values.questionTypes.includes("short_answer")
    ? `
### Short Answer Questions

1. Define ${values.topic} in your own words.

2. Explain the relationship between ${values.topic} and another concept in ${values.subject}.

3. What are the key characteristics of ${values.topic}?
`
    : ""
}

${
  values.questionTypes.includes("true_false")
    ? `
### True/False Questions

1. ${values.topic} is a fundamental concept in ${values.subject}. (True/False)

2. The development of ${values.topic} occurred primarily in the 20th century. (True/False)

3. ${values.topic} has no practical applications in modern technology. (True/False)
`
    : ""
}

${
  values.questionTypes.includes("matching")
    ? `
### Matching Questions

Match the following terms related to ${values.topic} with their correct descriptions:

1. Term A                 a) Description of Term C
2. Term B                 b) Description of Term A
3. Term C                 c) Description of Term B
`
    : ""
}

${
  values.questionTypes.includes("long_answer")
    ? `
### Long Answer Questions

1. Discuss the historical development of ${values.topic} and its impact on ${values.subject}.

2. Compare and contrast ${values.topic} with a related concept in ${values.subject}.

3. Analyze the practical applications of ${values.topic} in the Indian context.
`
    : ""
}

${
  values.questionTypes.includes("diagram")
    ? `
### Diagram-based Questions

1. Draw a diagram illustrating the key components of ${values.topic}.

2. Label the following diagram of ${values.topic} and explain the function of each part.

3. Using the diagram provided, explain the process of how ${values.topic} works.
`
    : ""
}

## Answer Key
(Answers would be provided here in a real worksheet)
      `

      setWorksheet(mockWorksheet)

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

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Worksheet</h1>
        <p className="text-muted-foreground">
          Generate worksheets and quizzes with various question types and difficulty levels.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Worksheet Details</CardTitle>
            <CardDescription>Fill in the details below to generate your custom worksheet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Computer Science, Physics, Literature" {...field} />
                      </FormControl>
                      <FormDescription>The main subject area for this worksheet.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Data Structures, Quantum Mechanics" {...field} />
                      </FormControl>
                      <FormDescription>The specific topic within the subject.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="undergraduate_1">Undergraduate 1st Year</SelectItem>
                            <SelectItem value="undergraduate_2">Undergraduate 2nd Year</SelectItem>
                            <SelectItem value="undergraduate_3">Undergraduate 3rd Year</SelectItem>
                            <SelectItem value="undergraduate_4">Undergraduate 4th Year</SelectItem>
                            <SelectItem value="postgraduate">Postgraduate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                            <SelectItem value="challenging">Challenging</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="questionTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Question Types</FormLabel>
                        <FormDescription>Select the types of questions to include in the worksheet.</FormDescription>
                      </div>
                      {questionTypes.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="questionTypes"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions: {field.value}</FormLabel>
                      <FormControl>
                        <Input
                          type="range"
                          min={5}
                          max={20}
                          step={1}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Select the number of questions you want to generate (5-20).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

        <Card>
          <CardHeader>
            <CardTitle>Generated Worksheet</CardTitle>
            <CardDescription>Your AI-generated worksheet will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating your worksheet...</p>
              </div>
            ) : worksheet ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{worksheet}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Fill out the form and click "Generate Worksheet" to create your custom worksheet.
                </p>
                <p className="text-xs text-muted-foreground">
                  The AI will create a worksheet with the specified question types and difficulty level.
                </p>
              </div>
            )}
          </CardContent>
          {worksheet && (
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(worksheet)
                  toast({
                    title: "Copied",
                    description: "Worksheet copied to clipboard",
                  })
                }}
              >
                Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([worksheet], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "worksheet.txt"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                Download
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
