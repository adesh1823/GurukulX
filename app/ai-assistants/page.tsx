import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mic, ImageIcon, Bot, Sparkles, ArrowRight, Brain, Code, Lightbulb } from "lucide-react"

export default function AIAssistantsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="mb-12 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-8 h-2 bg-orange-500 rounded"></div>
            <div className="w-8 h-2 bg-white border border-gray-300 rounded"></div>
            <div className="w-8 h-2 bg-green-600 rounded"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">AI Assistants</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful AI assistants to help with various teaching tasks, from analyzing images to voice-enabled commands.
          </p>
        </div>

        <div className="relative h-[300px] mb-12 rounded-xl overflow-hidden bg-gradient-to-r from-blue-100/50 to-purple-100/50 flex items-center justify-center border border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Assistants</h2>
            <p className="text-gray-600">Intelligent tools to enhance your teaching experience</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Voice Assistant</CardTitle>
              <CardDescription className="text-gray-600">
                Use voice commands to generate content and control your teaching tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Simply speak your requests, like "Generate a quiz on photosynthesis" or "Create a lesson plan for
                calculus."
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/ai-assistants/voice" className="w-full">
                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                  Try Voice Assistant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Vision Assistant</CardTitle>
              <CardDescription className="text-gray-600">
                Upload images and get AI-powered analysis and explanations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Analyze diagrams, charts, or educational images to get detailed explanations and insights.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/ai-assistants/vision" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Try Vision Assistant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Customize Assistant</CardTitle>
              <CardDescription className="text-gray-600">
                Train the AI on your teaching style for personalized outputs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create a custom AI assistant that understands your preferences, teaching methods, and subject expertise.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/ai-assistants/customize" className="w-full">
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  Customize Assistant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">Coding Assistant</CardTitle>
              <CardDescription className="text-gray-600">
                Advanced programming help powered by Qwen 2.5 Coder 32B.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get expert coding assistance, code reviews, and programming education support for technical courses.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/ai-assistants/coding" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  Try Coding Assistant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-gray-800">TTS Learning</CardTitle>
              <CardDescription className="text-gray-600">
                Convert educational content to engaging audio experiences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Transform text-based learning materials into high-quality audio with multilingual support and emotional
                tones.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/ai-assistants/tts-learning" className="w-full">
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white">
                  Try TTS Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 p-8 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            How AI Assistants Help Educators
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Save time by using voice commands instead of typing</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Quickly analyze visual educational materials</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Get personalized assistance tailored to your teaching style</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
                <span className="text-gray-700">Enhance classroom engagement with interactive AI tools</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
