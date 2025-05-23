import { NextResponse } from "next/server"
import { generateSlideContent, type SlideGenerationParams } from "@/lib/groq"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const { subject, topic, numberOfSlides, audience, template, additionalNotes, uploadedContent, fileName } = body

    if (!subject || !topic || !numberOfSlides || !audience || !template) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Prepare parameters for the slide content generation
    const params: SlideGenerationParams = {
      subject,
      topic,
      numberOfSlides,
      audience,
      template,
      additionalNotes: additionalNotes || "",
    }

    // If there's uploaded content, include it in the generation
    let enhancedNotes = additionalNotes || ""
    if (uploadedContent && fileName) {
      enhancedNotes += `\n\nSource Material from ${fileName}:\n${uploadedContent}\n\nPlease incorporate key concepts and information from this source material into the presentation, maintaining the high-quality Gemma-like presentation style.`
    }

    // Add specific instructions for Indian educational context
    enhancedNotes += `\n\nThis presentation is specifically for Indian college education. Please include:
    1. Examples relevant to Indian context and industries
    2. References to Indian educational standards where appropriate
    3. Culturally relevant analogies and case studies
    4. Connections to Indian innovation and research when possible
    5. Consideration for diverse learning backgrounds in Indian higher education`

    params.additionalNotes = enhancedNotes

    // Generate the slide content using Groq
    const slideContent = await generateSlideContent(params)

    return NextResponse.json({ slideContent })
  } catch (error) {
    console.error("Error generating slide content:", error)
    return NextResponse.json({ error: "Failed to generate slide content" }, { status: 500 })
  }
}
