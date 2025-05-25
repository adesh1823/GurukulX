"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { GradientText } from "@/components/ui/gradient-text";

// Define available question types
const questionTypes = [
  { id: "mcq", label: "Multiple Choice Questions" },
  { id: "short_answer", label: "Short Answer Questions" },
  { id: "long_answer", label: "Long Answer Questions" },
  { id: "true_false", label: "True/False Questions" },
  { id: "matching", label: "Matching Questions" },
  { id: "diagram", label: "Diagram-based Questions" },
] as const;

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
});

// Type for form values inferred from the schema
type FormValues = z.infer<typeof formSchema>;

export default function CreateWorksheet() {
  const [isLoading, setIsLoading] = useState(false);
  const [worksheet, setWorksheet] = useState<string[]>([]);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isInitialRender, setIsInitialRender] = useState(true);
  const { toast } = useToast();

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
  });

  // Animate worksheet lines only on initial render
  useEffect(() => {
    if (worksheet.length > 0) {
      setDisplayedLines([]);
      worksheet.forEach((line, index) => {
        setTimeout(
          () => {
            setDisplayedLines((prev) => [...prev, line]);
          },
          isInitialRender ? index * 300 : 0 // Apply delay only on initial render
        );
      });
    }
  }, [worksheet, isInitialRender]);

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setWorksheet([]);
    setDisplayedLines([]);
    setFormData(values);
    setEditMode(false);
    setIsInitialRender(true); // Enable animation for new worksheet

    try {
      const response = await fetch("/api/worksheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate worksheet");
      }

      // Clean and split the worksheet into lines
      const cleanedLines = data.worksheet
        .split("\n")
        .map((line: string) => line.replace(/[#*`]/g, "").trim())
        .filter((line: string) => line.length > 0);

      setWorksheet(cleanedLines);

      toast({
        title: "Worksheet Generated",
        description: "Your worksheet has been successfully created.",
      });
    } catch (error) {
      console.error("Error generating worksheet:", error);
      toast({
        title: "Error",
        description: "Failed to generate worksheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Generate and download PDF
  const handleDownloadText = () => {
    if (!formData || worksheet.length === 0) return;
  
    // Create the content for the text file
    const content = `Worksheet: ${formData.subject} - ${formData.topic}\n` +
                    `Grade: ${formData.gradeLevel}, Difficulty: ${formData.difficultyLevel}\n` +
                    `Questions:\n` +
                    worksheet.map((line, index) => `${index + 1}. ${line}`).join("\n");
  
    // Create a Blob with the text content
    const blob = new Blob([content], { type: "text/plain" });
  
    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);
  
    // Create a temporary link element for downloading
    const link = document.createElement("a");
    link.href = url;
    link.download = "worksheet.txt"; // Download as a .txt file
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2 text-center">
          <GradientText>Create Worksheet</GradientText>
        </h1>
        <p className="text-muted-foreground text-center">
          Generate worksheets and quizzes with various question types and difficulty levels.
        </p>
      </div>

      {/* Form Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Worksheet Details</CardTitle>
          <CardDescription>Fill in the details below to generate your custom worksheet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science, Physics" {...field} />
                    </FormControl>
                    <FormDescription>The main subject area for this worksheet.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Topic */}
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

              {/* Grade Level and Difficulty */}
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

              {/* Question Types */}
              <FormField
                control={form.control}
                name="questionTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Question Types</FormLabel>
                      <FormDescription>Select the types of questions to include.</FormDescription>
                    </div>
                    {questionTypes.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="questionTypes"
                        render={({ field }) => (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== item.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Questions */}
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
                    <FormDescription>Select the number of questions (5-20).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
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

      {/* Worksheet Display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-black">Generating your worksheet...</p>
        </div>
      ) : editMode ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl text-black font-bold mb-4">Edit Worksheet</h2>
          <p className="text-sm text-black mb-6">Modify the content below:</p>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-64 p-2 border rounded mb-4"
          ></textarea>
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => {
                const newLines = editContent
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0);
                setWorksheet(newLines);
                setEditMode(false);
                setIsInitialRender(false); // Disable animation after saving
              }}
            >
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : displayedLines.length > 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl text-black font-bold mb-4">
            Worksheet: {formData?.subject} - {formData?.topic}
          </h2>
          <p className="text-sm text-black mb-6">
            Grade: {formData?.gradeLevel}, Difficulty: {formData?.difficultyLevel}
          </p>
          <div className="space-y-4">
            {displayedLines.map((line, index) => (
              <p
                key={index}
                className={`text-black ${isInitialRender ? "animate-fade-in" : ""}`}
                style={isInitialRender ? { animationDelay: `${index * 0.3}s` } : {}}
              >
                {line}
              </p>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditContent(worksheet.join("\n"));
                setEditMode(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(worksheet.join("\n"));
                toast({
                  title: "Copied",
                  description: "Worksheet copied to clipboard",
                });
              }}
            >
              Copy to Clipboard
            </Button>
            <Button variant="outline" onClick={handleDownloadText}>
              Download Text
            </Button>
          </div>
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

      {/* Animation Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}