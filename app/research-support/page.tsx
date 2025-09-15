import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Search, BookOpen, Youtube, ArrowRight, Sparkles, Brain, Lightbulb } from "lucide-react"

export default function ResearchSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="mb-12 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-8 h-2 bg-orange-500 rounded"></div>
            <div className="w-8 h-2 bg-white border border-gray-300 rounded"></div>
            <div className="w-8 h-2 bg-green-600 rounded"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Research Support Tools</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered research assistance to help you analyze, summarize, and understand academic content more
            efficiently.
          </p>
        </div>

        <div className="relative h-[300px] mb-12 rounded-xl overflow-hidden bg-gradient-to-r from-purple-100/50 to-blue-100/50 flex items-center justify-center border border-purple-200">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Research Support</h2>
            <p className="text-gray-600">Intelligent tools for academic research and analysis</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Summarize Papers</CardTitle>
              <CardDescription className="text-gray-600">
                Get concise summaries of research papers and academic documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Upload research papers and get AI-generated summaries that highlight key findings and methodologies.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/research-support/summarize" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Summarize Papers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-4">
                <Youtube className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">YouTube Summarizer</CardTitle>
              <CardDescription className="text-gray-600">
                Extract key insights from educational YouTube videos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Paste YouTube URLs to get comprehensive summaries with timestamps and key takeaways.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/research-support/youtube-summarize" className="w-full">
                <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white">
                  Summarize Videos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Paraphrase & Grammar</CardTitle>
              <CardDescription className="text-gray-600">
                Improve your writing with AI-powered paraphrasing and grammar tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Enhance your academic writing with intelligent paraphrasing and comprehensive grammar checking.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/research-support/paraphrase" className="w-full">
                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                  Improve Writing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Flowchart Generator</CardTitle>
              <CardDescription className="text-gray-600">
                Create visual flowcharts and diagrams for complex concepts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Transform complex processes and ideas into clear, visual flowcharts and diagrams.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/research-support/flowchart" className="w-full">
                <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white">
                  Create Flowchart
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Literature Review</CardTitle>
              <CardDescription className="text-gray-600">
                AI-assisted literature review and citation analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get help organizing and analyzing multiple research papers for comprehensive literature reviews.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/research-support/literature" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  Start Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Research Ideas</CardTitle>
              <CardDescription className="text-gray-600">
                Generate research questions and explore new topics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Discover new research directions and generate innovative research questions in your field.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/research-support/ideas" className="w-full">
                <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white">
                  Explore Ideas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 p-8 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-orange-600" />
            Why Use AI for Research Support?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Process large volumes of research papers quickly and efficiently</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Extract key insights and findings from complex academic content</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">
                  Improve writing quality with advanced grammar and style suggestions
                </span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Visualize complex concepts with automated diagram generation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Stay updated with the latest research trends and methodologies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">
                  Generate new research ideas and explore interdisciplinary connections
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
