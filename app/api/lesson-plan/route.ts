import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

export const maxDuration = 30

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, gradeLevel, duration, learningObjectives } = await req.json()

    // Validate required fields
    if (!subject || !topic || !gradeLevel || !duration || !learningObjectives) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Convert duration to readable format
    const durationMap: Record<string, string> = {
      "30_minutes": "30 minutes",
      "45_minutes": "45 minutes",
      "60_minutes": "60 minutes",
      "90_minutes": "90 minutes",
      "120_minutes": "120 minutes",
    }

    // Convert grade level to readable format
    const gradeLevelMap: Record<string, string> = {
      undergraduate_1: "Undergraduate 1st Year",
      undergraduate_2: "Undergraduate 2nd Year",
      undergraduate_3: "Undergraduate 3rd Year",
      undergraduate_4: "Undergraduate 4th Year",
      postgraduate: "Postgraduate",
    }

    const readableDuration = durationMap[duration] || duration
    const readableGradeLevel = gradeLevelMap[gradeLevel] || gradeLevel

    // Calculate time allocations based on duration
    const totalMinutes = parseInt(duration.split("_")[0])
    const introTime = Math.max(5, Math.floor(totalMinutes * 0.15))
    const mainContentTime = Math.floor(totalMinutes * 0.65)
    const assessmentTime = Math.floor(totalMinutes * 0.15)
    const conclusionTime = Math.max(5, totalMinutes - introTime - mainContentTime - assessmentTime)

    const systemPrompt = `You are an expert educational consultant specializing in creating comprehensive lesson plans for Indian higher education institutions. You understand the Indian academic context, cultural nuances, and pedagogical approaches suitable for Indian students.

Create detailed, practical lesson plans that:
- Follow Indian educational standards and practices
- Include culturally relevant examples and case studies
- Consider the diverse learning backgrounds of Indian students
- Incorporate both traditional and modern teaching methodologies
- Reference Indian contexts, examples, and applications where relevant
- Use clear, structured formatting with proper headings and sections
- Include practical activities and assessments suitable for Indian classrooms`

    const userPrompt = `Create a comprehensive lesson plan with the following specifications:

**Subject:** ${subject}
**Topic:** ${topic}
**Grade Level:** ${readableGradeLevel}
**Duration:** ${readableDuration}
**Learning Objectives:** ${learningObjectives}

**Time Allocation:**
- Introduction/Hook: ${introTime} minutes
- Main Content: ${mainContentTime} minutes
- Assessment: ${assessmentTime} minutes
- Conclusion: ${conclusionTime} minutes

Please create a detailed lesson plan that includes:

1. **Lesson Overview** - Brief summary and context
2. **Learning Objectives** - Clear, measurable outcomes
3. **Prerequisites** - What students should know beforehand
4. **Introduction/Hook** - Engaging opening activity
5. **Main Content** - Detailed content delivery with multiple sections
6. **Activities** - Interactive exercises and practical applications
7. **Assessment Methods** - How to evaluate student understanding
8. **Conclusion** - Summary and next steps
9. **Resources Required** - Materials, technology, references
10. **Homework/Follow-up** - Extended learning activities
11. **Adaptations for Indian Context** - Local examples, cultural considerations
12. **Additional Notes** - Tips for effective delivery

Make sure to:
- FORMAT the response in clear markdown with proper headings and bullet points.
- Use Indian examples, case studies, and cultural references where appropriate
- Consider the diverse academic backgrounds of Indian students
- Include both individual and group activities
- Suggest technology integration where feasible
- Provide assessment rubrics or criteria
- Include references to Indian educational frameworks (NEP 2020, etc.)
- Suggest ways to connect the topic to real-world Indian applications

Format the response in clear markdown with proper headings and bullet points.`

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return NextResponse.json({
      lessonPlan: result.choices[0].message.content,
      metadata: {
        subject,
        topic,
        gradeLevel: readableGradeLevel,
        duration: readableDuration,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating lesson plan:", error)
    return NextResponse.json({ error: "Failed to generate lesson plan. Please try again." }, { status: 500 })
  }
}