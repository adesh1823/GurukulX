import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "Missing required field: text" },
        { status: 400 }
      )
    }

    const wordCount = text.split(/\s+/).filter((word: string | any[]) => word.length > 0).length
    if (wordCount > 250) {
      return NextResponse.json(
        { error: "Input text exceeds 250-word limit" },
        { status: 400 }
      )
    }

    const prompt = `Paraphrase the following text in a natural, human-like style, preserving the original meaning, tone, and intent. Use varied sentence structures, diverse vocabulary, and avoid formulaic or repetitive phrases. Target approximately ${wordCount} words, matching the input word count as closely as possible. Avoid overly formal or AI-like transitions (e.g., "In conclusion", "Furthermore"). Here's the text to paraphrase: ${text}`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that paraphrases text accurately while matching the input word count as closely as possible.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: Math.max(100, wordCount * 2), // Buffer for output
      top_p: 0.9,
      stop: null,
      stream: false,
    })

    const paraphrasedText = chatCompletion.choices[0]?.message?.content || ""

    return NextResponse.json({ paraphrasedText }, { status: 200 })
  } catch (error) {
    console.error("Error generating paraphrase:", error)
    return NextResponse.json(
      { error: "Failed to generate paraphrase" },
      { status: 500 }
    )
  }
}