import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { paperText, summaryLength } = await req.json()

    if (!paperText || !summaryLength) {
      return NextResponse.json(
        { error: "Missing required fields: paperText and summaryLength" },
        { status: 400 }
      )
    }

    // Define summary instructions based on length
    let summaryInstruction = ""
    if (summaryLength === "short") {
      summaryInstruction = "Provide a concise summary of the research paper in 1-2 paragraphs, focusing on the main research question, key findings, and conclusions. Simplify technical terms for general understanding."
    } else if (summaryLength === "medium") {
      summaryInstruction = "Provide a medium-length summary of the research paper in 3-4 paragraphs, covering the research question, objectives, methodology, key findings, and implications. Use clear, accessible language."
    } else if (summaryLength === "detailed") {
      summaryInstruction = "Provide a detailed summary of the research paper in 5+ paragraphs, including the background, research questions, theoretical framework, methodology, data analysis, key findings, implications, limitations, and conclusions. Preserve nuance while making it accessible."
    } else {
      return NextResponse.json(
        { error: "Invalid summary length specified" },
        { status: 400 }
      )
    }


    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that summarizes research papers and provide the summary in proper format withour markdown. ${summaryInstruction}`,
        },
        {
          role: "user",
          content: paperText,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_completion_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    })

    const summary = chatCompletion.choices[0]?.message?.content || ""

    return NextResponse.json({ summary }, { status: 200 })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    )
  }
}