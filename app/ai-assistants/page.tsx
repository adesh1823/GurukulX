import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mic, ImageIcon, Bot, Sparkles } from "lucide-react"

export default function AIAssistantsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Assistants</h1>
        <p className="text-muted-foreground">
          Powerful AI assistants to help with various teaching tasks, from analyzing images to voice-enabled commands.
        </p>
      </div>

      <div className="relative h-[300px] mb-12 rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 to-purple-600/5 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold">AI Assistants</h2>
          <p className="mt-2">Intelligent tools to enhance your teaching experience</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <Mic className="h-6 w-6" />
            </div>
            <CardTitle>Voice Assistant</CardTitle>
            <CardDescription>Use voice commands to generate content and control your teaching tools.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Simply speak your requests, like "Generate a quiz on photosynthesis" or "Create a lesson plan for
              calculus."
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/ai-assistants/voice" className="w-full">
              <Button className="w-full">Try Voice Assistant</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <ImageIcon className="h-6 w-6" />
            </div>
            <CardTitle>Vision Assistant</CardTitle>
            <CardDescription>Upload images and get AI-powered analysis and explanations.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze diagrams, charts, or educational images to get detailed explanations and insights.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/ai-assistants/vision" className="w-full">
              <Button className="w-full">Try Vision Assistant</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <Bot className="h-6 w-6" />
            </div>
            <CardTitle>Customize Assistant</CardTitle>
            <CardDescription>Train the AI on your teaching style for personalized outputs.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create a custom AI assistant that understands your preferences, teaching methods, and subject expertise.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/ai-assistants/customize" className="w-full">
              <Button className="w-full">Customize Assistant</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-accent rounded-lg">
        <h2 className="text-xl font-bold mb-4">How AI Assistants Help Educators</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Save time by using voice commands instead of typing</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Quickly analyze visual educational materials</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Get personalized assistance tailored to your teaching style</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Enhance classroom engagement with interactive AI tools</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
