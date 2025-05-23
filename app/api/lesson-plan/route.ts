import { NextResponse } from "next/server"
import { generateLessonPlan, type LessonPlanParams } from "@/lib/groq"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const { subject, topic, gradeLevel, duration, learningObjectives } = body

    if (!subject || !topic || !gradeLevel || !duration || !learningObjectives) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prepare parameters for the lesson plan generation
    const params: LessonPlanParams = {
      subject,
      topic,
      gradeLevel,
      duration,
      learningObjectives,
    }

    // Generate the lesson plan
    const lessonPlan = await generateLessonPlan(params)

    return NextResponse.json({ lessonPlan })
  } catch (error) {
    console.error("Error generating lesson plan:", error)
    return NextResponse.json({ error: "Failed to generate lesson plan" }, { status: 500 })
  }
}
