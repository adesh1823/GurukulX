import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const { text, length } = body

    if (!text) {
      return NextResponse.json({ error: "Missing text to summarize" }, { status: 400 })
    }

    try {
      // In a production environment, this would call the Groq API
      // For now, we'll return a mock response

      // Generate a mock summary based on the input text
      const wordCount = text.split(/\s+/).length
      const firstFewWords = text.split(/\s+/).slice(0, 20).join(" ")

      let summary = ""

      if (length === "short") {
        summary = `This is a short summary of the research paper that begins with "${firstFewWords}...". The paper contains approximately ${wordCount} words and appears to discuss academic research. In a fully implemented system, I would provide a 1-2 paragraph concise summary highlighting the key findings and methodology.`
      } else if (length === "medium") {
        summary = `This is a medium-length summary of the research paper that begins with "${firstFewWords}...". The paper contains approximately ${wordCount} words and appears to discuss academic research.

In a fully implemented system, I would provide a 3-4 paragraph summary covering:
1. The main research question and objectives
2. The methodology used in the study
3. The key findings and results
4. The implications and conclusions

This would give you a comprehensive overview of the paper while simplifying technical terminology and complex concepts.`
      } else {
        summary = `This is a detailed summary of the research paper that begins with "${firstFewWords}...". The paper contains approximately ${wordCount} words and appears to discuss academic research.

In a fully implemented system, I would provide a comprehensive 5+ paragraph summary covering:
1. The background and context of the research
2. The specific research questions and objectives
3. The theoretical framework and methodology
4. The data collection and analysis procedures
5. The key findings and results
6. The discussion of implications
7. The limitations of the study
8. The conclusions and recommendations for future research

This detailed summary would preserve the nuance of the original paper while making it more accessible and easier to understand.`
      }

      return NextResponse.json({ summary })
    } catch (error) {
      console.error("Error generating summary:", error)
      return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
