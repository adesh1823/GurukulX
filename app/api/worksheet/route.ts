import { NextResponse } from "next/server"
import { generateWorksheet, type WorksheetParams } from "@/lib/groq"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const { subject, topic, gradeLevel, difficultyLevel, questionTypes, numberOfQuestions } = body

    if (!subject || !topic || !gradeLevel || !difficultyLevel || !questionTypes || !numberOfQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prepare parameters for the worksheet generation
    const params: WorksheetParams = {
      subject,
      topic,
      gradeLevel,
      difficultyLevel,
      questionTypes,
      numberOfQuestions,
    }

    // Generate the worksheet
    const worksheet = await generateWorksheet(params)

    return NextResponse.json({ worksheet })
  } catch (error) {
    console.error("Error generating worksheet:", error)
    return NextResponse.json({ error: "Failed to generate worksheet" }, { status: 500 })
  }
}
