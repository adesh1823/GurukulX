"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, ArrowDown, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"
const pdfjsLib = require('pdfjs-dist/build/pdf')
import mammoth from "mammoth"
import dynamic from "next/dynamic"



// Set up pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`

export default function ParaphraseText() {
  const [inputText, setInputText] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [paraphrasedText, setParaphrasedText] = useState<string | null>(null)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Word count limit
  const MAX_WORDS = 250

  // Handle text input with word count limit
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const words = text.split(/\s+/).filter(word => word.length > 0)
    if (words.length > MAX_WORDS) {
      toast({
        title: "Word Limit Exceeded",
        description: `Input cannot exceed ${MAX_WORDS} words. Please shorten your text.`,
        variant: "destructive",
      })
      // Keep only the first 250 words
      const truncatedText = words.slice(0, MAX_WORDS).join(" ")
      setInputText(truncatedText)
      setWordCount(MAX_WORDS)
    } else {
      setInputText(text)
      setWordCount(words.length)
    }
  }

  // Handle line-by-line animation when paraphrasedText changes
  useEffect(() => {
    if (!paraphrasedText) {
      setDisplayedLines([])
      return
    }

    // Split paraphrasedText into lines (by newline or sentence-ending punctuation)
    const lines = paraphrasedText
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
  }, [paraphrasedText])

  // Handle file upload and text extraction
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsLoading(true)
    setInputText("") // Clear existing text
    setWordCount(0)

    try {
      let extractedText = ""

      if (file.type === "application/pdf") {
        // Handle PDF extraction
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ""

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ")
          fullText += pageText + "\n"
        }
        extractedText = fullText
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Handle Word (.docx) extraction
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        extractedText = result.value
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or Word (.docx) file.")
      }

      // Truncate to 250 words if necessary
      const words = extractedText.split(/\s+/).filter(word => word.length > 0)
      if (words.length > MAX_WORDS) {
        extractedText = words.slice(0, MAX_WORDS).join(" ")
        toast({
          title: "Word Limit Applied",
          description: `Uploaded file text was truncated to ${MAX_WORDS} words.`,
          variant: "destructive",
        })
      }

      setInputText(extractedText)
      setWordCount(Math.min(words.length, MAX_WORDS))
      toast({
        title: "File Processed",
        description: `Text extracted from ${file.name}. Ready to paraphrase.`,
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

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please paste text or upload a file to paraphrase.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setParaphrasedText(null)

    try {
      const response = await fetch("/api/paraphraser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch paraphrase")
      }

      const data = await response.json()
      setParaphrasedText(data.paraphrasedText)

      toast({
        title: "Paraphrase Generated",
        description: "Your text has been successfully paraphrased.",
      })
    } catch (error) {
      console.error("Error paraphrasing text:", error)
      toast({
        title: "Error",
        description: "Failed to paraphrase text. Please try again.",
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
          <GradientText>Paraphrase Text</GradientText>
        </h1>
        <p className="text-red-500 text-center">
        This is currently not very effective if you're simply looking to paraphrase text with targeting 0% AI detection. Use with caution
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>
              Upload a PDF or Word (.docx) file, or paste text to paraphrase. Maximum 250 words.
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
                accept=".pdf,.docx"
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
            <div>
              <Textarea
                placeholder="Paste text here, or upload a file above (max 250 words)..."
                value={inputText}
                onChange={handleTextChange}
                className="min-h-[200px]"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Word count: {wordCount}/{MAX_WORDS}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleParaphrase} disabled={isLoading || !inputText.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Paraphrasing...
                </>
              ) : (
                "Paraphrase Text"
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-center">
          <ArrowDown className="h-8 w-8 text-muted-foreground" />
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-black">Paraphrased Text</CardTitle>
            <CardDescription>
              A paraphrased version of the input text, matching the input word count (up to 250 words).
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating paraphrase...</p>
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
                  Your paraphrased text will appear here after you submit the input.
                </p>
                <p className="text-xs text-muted-foreground">
                  The AI will rephrase the text while maintaining the original meaning and word count.
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
                    description: "Paraphrased text copied to clipboard",
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
        <h2 className="text-xl font-bold mb-4">Tips for Better Paraphrasing</h2>
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
            <span>Ensure the text is well-structured and grammatically correct for better results</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Input is limited to 250 words; longer files will be truncated</span>
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