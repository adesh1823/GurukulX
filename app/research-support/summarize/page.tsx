"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SummarizePapers() {
  const [paperText, setPaperText] = useState("")
  const [summaryLength, setSummaryLength] = useState("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSummarize = async () => {
    if (!paperText.trim()) {
      toast({
        title: "Empty input",
        description: "Please paste the research paper text to summarize.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setSummary(null)

    try {
      // In a production environment, this would be a real API call
      // For now, we'll simulate a delay and use a mock response
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock summary based on the input text
      const wordCount = paperText.split(/\s+/).length
      const firstFewWords = paperText.split(/\s+/).slice(0, 20).join(" ")

      let mockSummary = ""

      if (summaryLength === "short") {
        mockSummary = `This is a short summary of the research paper that begins with "${firstFewWords}...". The paper contains approximately ${wordCount} words and appears to discuss academic research. In a fully implemented system, I would provide a 1-2 paragraph concise summary highlighting the key findings and methodology.`
      } else if (summaryLength === "medium") {
        mockSummary = `This is a medium-length summary of the research paper that begins with "${firstFewWords}...". The paper contains approximately ${wordCount} words and appears to discuss academic research.

In a fully implemented system, I would provide a 3-4 paragraph summary covering:
1. The main research question and objectives
2. The methodology used in the study
3. The key findings and results
4. The implications and conclusions

This would give you a comprehensive overview of the paper while simplifying technical terminology and complex concepts.`
      } else {
        mockSummary = `This is a detailed summary of the research paper that begins with "${firstFewWords}...". The paper contains approximately ${wordCount} words and appears to discuss academic research.

In a fully implemented system, I would provide a comprehensive 5+ paragraph summary covering:
1. The background and context of the research
2. The specific research questions and objectives
3. The theoretical framework and methodology
4. The data collection and analysis procedures
5. The key findings and results
6. The discussion of implications
7. The limitations of the study
8. The conclusions and recommendations for future research

This detailed summary would preserve the nuance of the original paper while making it more accessible and easier to understand.`
      }

      setSummary(mockSummary)

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
        <h1 className="text-3xl font-bold mb-2">Summarize Research Papers</h1>
        <p className="text-muted-foreground">Paste research paper text to get a concise, easy-to-understand summary.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Research Paper Text</CardTitle>
            <CardDescription>Paste the text of the research paper you want to summarize.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste research paper text here..."
              value={paperText}
              onChange={(e) => setPaperText(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Summary Length:</span>
              <Select value={summaryLength} onValueChange={setSummaryLength}>
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

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>A simplified summary of the research paper in easy-to-understand terms.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating summary...</p>
              </div>
            ) : summary ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{summary}</div>
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
          {summary && (
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(summary)
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
            <span>Include the abstract and conclusion for more accurate summaries</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Paste the full text for more comprehensive analysis</span>
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
