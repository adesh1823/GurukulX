import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Presentation, FileQuestion, BookOpen } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"

export default function LessonPlanningPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="mt-1 text-5xl font-bold mb-2 text-center"><GradientText>Lesson Planning & Content Generation</GradientText></h1>
        <p className="text-muted-foreground">
          Create AI-generated lesson plans, slide decks, and worksheets tailored to your curriculum and learning
          objectives.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="md:col-span-2 lg:col-span-1 h-[300px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg">
          <div className="text-center">
            <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-bold">Lesson Planning</h3>
            <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
              Create comprehensive lesson plans tailored to your curriculum
            </p>
          </div>
        </div>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle>AI Reader</CardTitle>
            <CardDescription>
              किसी भी भारतीय भाषा में टेक्स्ट का ऑडियो जनरेट करें।  
              (Generate audio from text in any Indian language.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our AI generated audio for any text in any Indian language.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/lesson-planning/create" className="w-full">
              <Button className="w-full">AI Reader</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle>Lesson Planning</CardTitle>
            <CardDescription>
              Generate comprehensive lesson plans based on your subject, topic, and learning objectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our AI creates structured lesson plans with introductions, main content, activities, assessments, and
              resources.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/lesson-planning/create" className="w-full">
              <Button className="w-full">Create Lesson Plan</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <FileQuestion className="h-6 w-6" />
            </div>
            <CardTitle>Create Flowcharts</CardTitle>
            <CardDescription>
              Generate flowcharts and diagrams with various question types and difficulty levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create flowcharts and diagrams with adjustable difficulty for student assessment.Get edior acess to the flowchart according to your needs.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/research-support/flowchart" className="w-full">
              <Button className="w-full">Create flowcharts</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <FileQuestion className="h-6 w-6" />
            </div>
            <CardTitle>Create Mindmaps</CardTitle>
            <CardDescription>
              Generate mindmaps with just typing your prompt 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create mindmaps with adjustable difficulty.Get edior acess to the mindmap according to your needs.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/research-support/mindmap" className="w-full">
              <Button className="w-full">Create mindmaps</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <FileQuestion className="h-6 w-6" />
            </div>
            <CardTitle>Create Sequence Diagram</CardTitle>
            <CardDescription>
              Generate Sequence Diagram with just typing your prompt 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create Sequence Diagram with adjustable difficulty.Get edior acess to the Sequence Diagram according to your needs.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/research-support/sequencediagram" className="w-full">
              <Button className="w-full">Create Sequence Diagram</Button>
            </Link>
          </CardFooter>
        </Card>


        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <FileQuestion className="h-6 w-6" />
            </div>
            <CardTitle>Create Worksheets</CardTitle>
            <CardDescription>
              Generate worksheets and quizzes with various question types and difficulty levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create MCQs, short answers, and diagram-based questions with adjustable difficulty for student assessment.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/lesson-planning/worksheets" className="w-full">
              <Button className="w-full">Create Worksheet</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <FileQuestion className="h-6 w-6" />
            </div>
            <CardTitle>Create Question paper</CardTitle>
            <CardDescription>
              Generate Questions with various types and difficulty levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create MCQs, short answers, and diagram-based questions with adjustable difficulty for student assessment.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/student-engagement/chatbot" className="w-full">
              <Button className="w-full">Create Question paper</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <Presentation className="h-6 w-6" />
            </div>
            <CardTitle>Whiteboard</CardTitle>
            <CardDescription>Create interactive whiteboard content for presentations based on your topic outline.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get AI-generated whiteboard content with titles, main points, and visual suggestions ready for your
              presentations.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/lesson-planning/whiteboard" className="w-full">
              <Button className="w-full">Whiteboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-accent rounded-lg">
        <h2 className="text-xl font-bold mb-4">Why Use AI for Lesson Planning?</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Save hours of preparation time with AI-generated content</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Ensure comprehensive coverage of curriculum requirements</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Get fresh ideas and approaches to teaching familiar topics</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span>Easily customize generated content to match your teaching style</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
