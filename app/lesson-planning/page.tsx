import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Presentation, FileQuestion, BookOpen } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"

export default function LessonPlanningPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="mt-1 text-5xl font-bold mb-2 text-center text-black"><GradientText>Lesson Planning & Content Generation</GradientText></h1>
        <p className="text-black">
          Create AI-generated lesson plans, slide decks, and worksheets tailored to your curriculum and learning
          objectives.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="md:col-span-2 lg:col-span-1 h-[300px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg">
          <div className="text-center">
            <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-bold text-black">Lesson Planning</h3>
            <p className="mt-2 text-black max-w-xs mx-auto">
              Create comprehensive lesson plans tailored to your curriculum
            </p>
          </div>
        </div>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle className="text-black">Voice Bot</CardTitle>
            <CardDescription className="text-black">
              learn practicing interview questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
              Our AI creates structured interview questions with introductions, main content, activities, assessments, and
              resources.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/Voicebot" className="w-full">
              <Button className="w-full">Voice Bot</Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="card-hover">
          <CardHeader>
            <div className="feature-icon">
              <BookOpen className="h-6 w-6" />
            </div>
            <CardTitle className="text-black">AI Reader</CardTitle>
            <CardDescription className="text-black">
              किसी भी भारतीय भाषा में टेक्स्ट का ऑडियो जनरेट करें।  
              (Generate audio from text in any Indian language.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
            <CardTitle className="text-black">Lesson Planning</CardTitle>
            <CardDescription className="text-black">
              Generate comprehensive lesson plans based on your subject, topic, and learning objectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
            <CardTitle className="text-black">Create Flowcharts</CardTitle>
            <CardDescription className="text-black">
              Generate flowcharts and diagrams with various question types and difficulty levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
            <CardTitle className="text-black">Create Mindmaps</CardTitle>
            <CardDescription className="text-black">
              Generate mindmaps with just typing your prompt 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
            <CardTitle className="text-black">Create Sequence Diagram</CardTitle>
            <CardDescription className="text-black">
              Generate Sequence Diagram with just typing your prompt 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
            <CardTitle className="text-black">Create Worksheets</CardTitle>
            <CardDescription className="text-black">
              Generate worksheets and quizzes with various question types and difficulty levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
            <CardTitle className="text-black">Create Question paper</CardTitle>
            <CardDescription className="text-black">
              Generate Questions with various types and difficulty levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
            <CardTitle className="text-black">Whiteboard</CardTitle>
            <CardDescription className="text-black">Create interactive whiteboard content for presentations based on your topic outline.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
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
        <h2 className="text-xl font-bold mb-4 text-black">Why Use AI for Lesson Planning?</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span className="text-black">Save hours of preparation time with AI-generated content</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span className="text-black">Ensure comprehensive coverage of curriculum requirements</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span className="text-black">Get fresh ideas and approaches to teaching familiar topics</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span className="text-black">Easily customize generated content to match your teaching style</span>
          </li>
        </ul>
      </div>
    </div>
  )
}