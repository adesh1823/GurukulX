
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, context, type } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let systemPrompt = "You are a helpful AI teaching assistant."
    
    switch (type) {
      case "lesson_suggestion":
        systemPrompt = "You are an expert curriculum designer. Provide creative lesson ideas and teaching strategies apply markdown formatting on text dont use md notations in repsonses and dont use * ** too in responses."
        break
      case "content_help":
        systemPrompt = "You are a subject matter expert. Help explain complex topics in simple, understandable terms  apply markdown formatting on text dont use md notations in repsonses and dont use * ** too in responses ."
        break
      case "doubt_solving":
        systemPrompt = "You are a patient tutor. Help solve student doubts with step-by-step explanations  apply markdown formatting on text dont use md notations in repsonses and dont use * ** too in responses."
        break
      case "formula_recognition":
        systemPrompt = "You are a mathematics and science expert. Help with formulas, equations, and problem-solving  apply markdown formatting on text dont use md notations in repsonses and dont use * ** too in responses."
        break
      default:
        systemPrompt = "You are a helpful AI teaching assistant. Provide clear, educational responses apply markdown formatting on text dont use md notations in repsonses and dont use * ** too in responses."
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Context: ${context}\n\nQuestion: ${message}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    })

    return NextResponse.json({
      response: chatCompletion.choices[0].message.content
    })
  } catch (error) {
    console.error("AI assist error:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
  }
}
