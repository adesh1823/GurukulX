"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, ArrowDown, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GradientText } from "@/components/ui/gradient-text"
import mammoth from "mammoth"

export default function SummarizePapers() {
  const [paperText, setPaperText] = useState("")
  const [summaryLength, setSummaryLength] = useState("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle line-by-line animation when summary changes
  useEffect(() => {
    if (!summary) {
      setDisplayedLines([])
      return
    }

    // Split summary into lines (by newline or sentence-ending punctuation)
    const lines = summary
      .split(/\n+|\.\s+/)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    setDisplayedLines([]) // Reset displayed lines

    // Add lines one by one with a delay
    lines.forEach((line, index) => {
      setTimeout(() => {
        setDisplayedLines(prev => [...prev, line])
      }, index * 500) // 500ms delay per line
    })
  }, [summary])

  // Handle file upload and text extraction
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsLoading(true)
    setPaperText("") // Clear existing text

    try {
      let extractedText = ""

      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Handle Word (.docx) extraction
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        extractedText = result.value
      } else {
        throw new Error("Unsupported file type. Please upload a Word (.docx) file.")
      }

      setPaperText(extractedText)
      toast({
        title: "File Processed",
        description: `Text extracted from ${file.name}. Ready to summarize.`,
      })
    } catch (error) {
      console.error("Error extracting text:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to extract text from file. Please try again.",
        variant: "destructive",
      })
      setFileName(null)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Reset file input
      }
    }
  }

  const handleSummarize = async () => {
    if (!paperText.trim()) {
      toast({
        title: "Empty input",
        description: "Please paste research paper text or upload a file to summarize.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setSummary(null)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paperText,
          summaryLength,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch summary")
      }

      const data = await response.json()
      setSummary(data.summary)

      toast({
        title: "Summary Generated",
        description: "Your research paper has been successfully summarized.",
      })
    } catch (error) {
      console.error("Error summarizing text:", error)
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2 text-center">
          <GradientText>Summarize Research Papers</GradientText>
        </h1>
        <p className="text-muted-foreground text-center">
          Upload a Word file or paste research paper text to get a concise, easy-to-understand summary.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Research Paper Input</CardTitle>
            <CardDescription>
              Upload a Word (.docx) file, or paste the text of the research paper you want to summarize.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <input
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
              {fileName && (
                <span className="text-sm text-muted-foreground">
                  Uploaded: {fileName}
                </span>
              )}
            </div>
            <Textarea
              placeholder="Paste research paper text here, or upload a file above..."
              value={paperText}
              onChange={(e) => setPaperText(e.target.value)}
              className="min-h-[200px]"
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Summary Length:</span>
              <Select value={summaryLength} onValueChange={setSummaryLength} disabled={isLoading}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (1-2 paragraphs)</SelectItem>
                  <SelectItem value="medium">Medium (3-4 paragraphs)</SelectItem>
                  <SelectItem value="detailed">Detailed (5+ paragraphs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSummarize} disabled={isLoading || !paperText.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                "Summarize Paper"
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-center">
          <ArrowDown className="h-8 w-8 text-muted-foreground" />
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              A simplified summary of the research paper in easy-to-understand terms.
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating summary...</p>
              </div>
            ) : displayedLines.length > 0 ? (
              <div className="prose prose-sm max-w-none text-black">
                {displayedLines.map((line, index) => (
                  <p key={index} className="mb-2 animate-fade-in">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Your summary will appear here after you submit a research paper.
                </p>
                <p className="text-xs text-muted-foreground">
                  The AI will break down complex research into simple, understandable language.
                </p>
              </div>
            )}
          </CardContent>
          {displayedLines.length > 0 && (
            <CardFooter className="flex justify-end gap-2 bg-white">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(displayedLines.join("\n"))
                  toast({
                    title: "Copied",
                    description: "Summary copied to clipboard",
                  })
                }}
              >
                Copy to Clipboard
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      <div className="mt-12 p-6 bg-accent rounded-lg">
        <h2 className="text-xl font-bold mb-4">Tips for Better Summaries</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Upload files with clear text content for accurate extraction</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Include the abstract and conclusion for more accurate summaries</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Paste the full text or upload complete documents for comprehensive analysis</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Choose the appropriate summary length based on your needs</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>For technical papers, include the methodology section for better context</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// CSS for fade-in animation
const styles = `
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-in forwards;
}
`

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}