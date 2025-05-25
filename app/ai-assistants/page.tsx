import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mic, ImageIcon, Bot, Sparkles } from "lucide-react"
import type { FC } from "react"
import { GradientText } from "@/components/ui/gradient-text"

const AIAssistantsPage: FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="mt-1 text-5xl font-bold mb-2 text-center"> <GradientText>AI Assistants</GradientText></h1>
        <p className="text-muted-foreground">
          Powerful AI assistants to help with various teaching tasks, from analyzing images to voice-enabled commands.
        </p>
      </div>

      <div className="relative h-[300px] mb-12 rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 to-purple-600/5 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-centre">AI Assistants</h2>
          <p className="mt-2">Intelligent tools to enhance your teaching experience</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
      <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <Bot className="h-6 w-6" />
            </div>
            <CardTitle>Coding Assistant</CardTitle>
            <CardDescription>
              Generate, debug, and understand code for your educational projects with Gurukul-1.0.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Powered by Gurukul-1.0, the Coding Assistant helps educators and students create code for interactive
              learning tools, debug complex algorithms, and understand programming concepts through clear explanations
              and examples. Whether you're building a web app for classroom engagement or teaching Python basics, this
              assistant provides tailored code snippets and guidance.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/ai-assistants/coding" className="w-full">
              <Button className="w-full">Try Coding Assistant</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="card-hover relative">
          <CardHeader>
            <div className="feature-icon">
              <Mic className="h-6 w-6" />
            </div>
            <CardTitle>Voice Assistant</CardTitle>
            <CardDescription>
              Use voice commands to generate content and control your teaching tools.{" "}
              <span className="text-yellow-500 font-semibold">Coming Soon</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Simply speak your requests, like "Generate a quiz on photosynthesis" or "Create a lesson plan for
              calculus."
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Try Voice Assistant
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-hover relative">
          <CardHeader>
            <div className="feature-icon">
              <ImageIcon className="h-6 w-6" />
            </div>
            <CardTitle>Vision Assistant</CardTitle>
            <CardDescription>
              Upload images and get AI-powered analysis and explanations.{" "}
              <span className="text-yellow-500 font-semibold">Coming Soon</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze diagrams, charts, or educational images to get detailed explanations and insights.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Try Vision Assistant
            </Button>
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

export default AIAssistantsPage