import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Validate Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set")
      return NextResponse.json({ error: "Server configuration error: Missing Groq API key" }, { status: 500 })
    }

    // Parse request body
    const { text, language = "en-IN" } = await request.json()
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string." }, { status: 400 })
    }

    if (text.length > 10000) {
      return NextResponse.json({ error: "Text is too long. Maximum 10,000 characters allowed." }, { status: 400 })
    }

    // Determine if translation is needed
    const needsTranslation = language !== "en-IN" && !isTextInLanguage(text, language)

    // Define system prompt for AI
    let systemPrompt = `You are an expert educational content processor specializing in preparing text for audio narration. Your task is to:

1. Clean and enhance the text for better audio delivery
2. Add appropriate pauses and emphasis markers
3. Expand abbreviations and acronyms for clarity
4. Improve sentence structure for natural speech flow
5. Add pronunciation guides for technical terms if needed
6. Maintain the educational value and accuracy of the content
7. Format the text to be engaging when spoken aloud

Guidelines:
- Use natural, conversational language suitable for teachers and students
- Add brief explanatory phrases for complex concepts
- Ensure smooth transitions between topics
- Add emphasis on *key learning points* for clarity
- Format numbers and dates for clear pronunciation (e.g., "twenty-twenty-five" instead of "2025")
- Keep the content engaging and suitable for audio delivery
- Maintain the original meaning and educational objectives
- Avoid using markdown code blocks (e.g., \`\`\`), headers, or bullet points
- Return only the processed text without additional explanations`

    // Add translation instruction if needed
    if (needsTranslation) {
      const languageName = getLanguageName(language)
      systemPrompt += `\n\nIMPORTANT: Translate the entire text to ${languageName} language. Ensure the translation is natural, culturally appropriate, and maintains the educational value of the content. Use the appropriate script for ${languageName}.`
    }

    // User prompt with input text
    const userPrompt = `Please review the following educational text for optimal audio narration:

${text}`

    // Generate processed text using Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      temperature: 0.6,
      max_tokens: 2000,
      top_p: 1,
      stream: false,
    })

    const processedText = chatCompletion.choices[0]?.message?.content || ""

    // Fallback to original text if AI processing fails
    const finalText = processedText.trim() || text

    return NextResponse.json({
      processedText: finalText,
      originalLength: text.length,
      processedLength: finalText.length,
      processingApplied: processedText.trim().length > 0,
      translated: needsTranslation,
      targetLanguage: getLanguageName(language),
    })
  } catch (error) {
    console.error("Error processing text:", error)

    // Return original text as fallback
    const { text } = await request.json().catch(() => ({ text: "" }))
    return NextResponse.json(
      {
        processedText: text || "",
        originalLength: text?.length || 0,
        processedLength: text?.length || 0,
        processingApplied: false,
        warning: "AI processing failed, returning original text.",
      },
      { status: 500 },
    )
  }
}

// Helper function to get language name from code
function getLanguageName(languageCode: string): string {
  const languageMap: Record<string, string> = {
    "hi-IN": "Hindi",
    "pa-IN": "Punjabi",
    "mr-IN": "Marathi",
    "en-IN": "English",
  }
  return languageMap[languageCode] || "English"
}

// Simple heuristic to check if text might already be in the target language
function isTextInLanguage(text: string, languageCode: string): boolean {
  // Hindi character range check
  if (languageCode === "hi-IN") {
    const hindiPattern = /[\u0900-\u097F]/
    return hindiPattern.test(text)
  }

  // Marathi character range check (similar to Hindi but with specific usage)
  if (languageCode === "mr-IN") {
    const marathiPattern = /[\u0900-\u097F]/
    return marathiPattern.test(text)
  }

  // Punjabi character range check
  if (languageCode === "pa-IN") {
    const punjabiPattern = /[\u0A00-\u0A7F]/
    return punjabiPattern.test(text)
  }

  return true // Default to true for English or unknown languages
}
