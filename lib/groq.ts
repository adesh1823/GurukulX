import Groq from "groq-sdk"

// Initialize the Groq client with the API key from environment variables
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Main function for general AI tasks
export const getGroqChatCompletion = async (messages: any[], model = "llama-3.3-70b-versatile") => {
  return groq.chat.completions.create({
    messages,
    model,
    temperature: 0.7,
    max_tokens: 4096,
  })
}

// Function for coding assistance using the specialized model
export const getGroqCodingCompletion = async (messages: any[]) => {
  return groq.chat.completions.create({
    messages,
    model: "qwen2.5-coder-32b-instruct",
    temperature: 0.3,
    max_tokens: 4096,
  })
}

// Function to generate text using Groq
export async function generateText(
  prompt: string,
  systemPrompt = "You are a helpful assistant.",
  useCodeModel = false,
) {
  try {
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ]

    const completion = useCodeModel ? await getGroqCodingCompletion(messages) : await getGroqChatCompletion(messages)

    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("Error generating text with Groq:", error)
    throw new Error("Failed to generate text. Please try again later.")
  }
}

// Function to analyze an image using Groq
export async function analyzeImage(imageUrl: string, prompt: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      model: "llama-3.2-90b-vision-preview",
      temperature: 0.7,
      max_tokens: 1024,
    })

    return chatCompletion.choices[0].message.content
  } catch (error) {
    console.error("Error analyzing image with Groq:", error)
    throw new Error("Failed to analyze image. Please try again later.")
  }
}

// Types for lesson planning
export interface LessonPlanParams {
  subject: string
  topic: string
  gradeLevel: string
  duration: string
  learningObjectives: string
}

export interface SlideGenerationParams {
  subject: string
  topic: string
  numberOfSlides: number
  audience: string
  additionalNotes: string
  template?: string
}

export interface WorksheetParams {
  subject: string
  topic: string
  gradeLevel: string
  difficultyLevel: string
  questionTypes: string[]
  numberOfQuestions: number
}

// Generate a lesson plan using Groq
export async function generateLessonPlan(params: LessonPlanParams) {
  const prompt = `
    Create a detailed lesson plan for Indian college students with the following parameters:
    
    Subject: ${params.subject}
    Topic: ${params.topic}
    Grade Level: ${params.gradeLevel}
    Duration: ${params.duration}
    Learning Objectives: ${params.learningObjectives}
    
    The lesson plan should include:
    1. Introduction/Hook (5-10 minutes)
    2. Main content and activities (detailed breakdown)
    3. Interactive elements and student engagement
    4. Assessment methods and rubrics
    5. Conclusion and wrap-up
    6. Resources needed (digital and physical)
    7. Homework/Follow-up activities
    8. Differentiation strategies for diverse learners
    
    Please format the lesson plan in a structured, easy-to-read format suitable for Indian college educators.
    Include time allocations for each section and specific teaching strategies.
  `

  const systemPrompt =
    "You are an expert educational consultant specializing in curriculum development for Indian colleges. You create detailed, practical lesson plans that align with Indian educational standards and teaching methodologies. Focus on interactive learning, practical applications, and culturally relevant examples."

  return generateText(prompt, systemPrompt)
}

// Generate modern slide content with templates using Groq
export async function generateSlideContent(params: SlideGenerationParams) {
  const prompt = `
    Create a modern, professional slide presentation with the following parameters:
    
    Subject: ${params.subject}
    Topic: ${params.topic}
    Number of Slides: ${params.numberOfSlides}
    Audience: ${params.audience}
    Template Style: ${params.template || "Modern Professional"}
    Additional Notes: ${params.additionalNotes}
    
    I want this presentation to be EXACTLY like what Google Gemma would produce - extremely high quality, visually appealing, and with perfect formatting.
    
    For each slide, provide:
    1. Slide number and title (make titles concise, engaging, and memorable)
    2. Main content points (3-5 bullet points max per slide, each bullet should be concise and impactful)
    3. Visual suggestions (specific charts, images, diagrams, icons that would enhance understanding)
    4. Speaker notes (detailed talking points that expand on the slide content)
    5. Design elements (color schemes, layout suggestions, typography recommendations)
    
    Format the output as a structured presentation with:
    - Title slide (with compelling subtitle and visual hook)
    - Agenda/Overview slide (clear roadmap of the presentation)
    - Content slides with clear hierarchy and progressive disclosure
    - Interactive elements (questions, polls, activities) every 3-4 slides
    - Summary/Conclusion slide with key takeaways
    - Q&A slide with thought-provoking starter questions
    - References/Resources slide
    
    Make the content engaging, visually appealing, and suitable for Indian college students.
    Include relevant examples from Indian context, industry applications, and cultural references.
    
    The presentation should follow modern design principles:
    - Minimalist approach with ample white space
    - Consistent color scheme (3-4 colors maximum)
    - Large, readable typography
    - High-quality visuals and icons
    - Consistent slide layouts with clear visual hierarchy
    
    For the specific template style "${params.template}", incorporate these unique elements:
    ${getTemplateSpecificInstructions(params.template)}
  `

  const systemPrompt =
    "You are an expert presentation designer who creates world-class educational presentations for Indian college courses. You specialize in creating modern, visually appealing slide content that effectively communicates complex concepts using contemporary design principles and interactive elements. Your presentations are indistinguishable from those created by professional designers and are specifically optimized for educational contexts. You always follow the latest presentation design best practices and create content that is both visually stunning and pedagogically effective."

  return generateText(prompt, systemPrompt)
}

// Helper function to get template-specific instructions
function getTemplateSpecificInstructions(template = "modern") {
  const templates = {
    modern: `
      - Use a clean, minimalist design with plenty of white space
      - Color scheme: deep blues, soft purples, and accent of coral or teal
      - Sans-serif fonts (Montserrat for headings, Open Sans for body text)
      - Subtle gradient backgrounds
      - Thin line elements and geometric shapes as visual accents
      - Modern flat icons and illustrations
      - Left-aligned text with strong visual hierarchy
    `,
    academic: `
      - Professional, scholarly appearance with structured layout
      - Color scheme: navy blue, burgundy, and neutral tones
      - Serif fonts for headings (Georgia), sans-serif for body text
      - Clear sections with numbered headings
      - Academic citation format for references
      - Data visualization for complex concepts
      - Diagrams and models to illustrate theoretical frameworks
      - Include methodology and research evidence sections
    `,
    creative: `
      - Bold, vibrant design with dynamic layouts
      - Color scheme: bright gradients with complementary colors
      - Mix of typography styles (playful headings, readable body text)
      - Asymmetrical layouts with overlapping elements
      - Custom illustrations and hand-drawn style elements
      - Full-bleed images with text overlay
      - Creative infographics and data visualization
      - Interactive elements and multimedia suggestions
    `,
    minimal: `
      - Ultra-minimalist design with maximum white space
      - Color scheme: black, white, and a single accent color
      - Single sans-serif font family throughout (Helvetica or Inter)
      - One key point per slide when possible
      - Generous margins and breathing room around content
      - Subtle animations and transitions
      - High-contrast design for maximum readability
      - Strategic use of negative space to highlight key points
    `,
    corporate: `
      - Professional business appearance with structured layout
      - Color scheme: corporate blues, grays, with accent color
      - Consistent header and footer with logo placement
      - Clean data visualization for business metrics
      - Executive summary slides
      - Action items and next steps clearly highlighted
      - Professional stock photography suggestions
      - Business-appropriate icons and graphics
    `,
    educational: `
      - Engaging, colorful design optimized for learning
      - Color scheme: friendly, approachable colors (blues, greens, oranges)
      - Clear visual hierarchy with learning objectives highlighted
      - Interactive elements, quizzes, and knowledge checks
      - Mnemonic devices and memory aids
      - Visual metaphors to explain complex concepts
      - Step-by-step process diagrams
      - Before/after comparisons and case studies
      - Summary points and key takeaways highlighted
    `,
  }

  return templates[template as keyof typeof templates] || templates.modern
}

// Generate worksheet with questions using Groq
export async function generateWorksheet(params: WorksheetParams) {
  const prompt = `
    Create a comprehensive worksheet for Indian college students with the following parameters:
    
    Subject: ${params.subject}
    Topic: ${params.topic}
    Grade Level: ${params.gradeLevel}
    Difficulty Level: ${params.difficultyLevel}
    Question Types: ${params.questionTypes.join(", ")}
    Number of Questions: ${params.numberOfQuestions}
    
    The worksheet should include:
    1. Clear instructions for each section
    2. Varied question types as specified
    3. Progressive difficulty levels
    4. Real-world applications and case studies
    5. Critical thinking questions
    6. Collaborative activities
    7. Answer key with detailed explanations
    8. Rubric for assessment
    
    Make sure the content is relevant to Indian college curriculum and includes:
    - Local examples and case studies
    - Industry-relevant scenarios
    - Cultural context where appropriate
    - Clear formatting and layout instructions
  `

  const systemPrompt =
    "You are an expert in creating educational assessments for Indian college courses. You specialize in developing comprehensive worksheets that test understanding, critical thinking, and application of concepts according to Indian educational standards and industry requirements."

  return generateText(prompt, systemPrompt)
}

// Function to process uploaded documents
export async function processDocument(content: string, documentType: string, task: string) {
  const prompt = `
    Process the following ${documentType} document content for the task: ${task}
    
    Document Content:
    ${content}
    
    Please provide a comprehensive analysis based on the requested task.
  `

  const systemPrompt = `You are an expert document processor and educational content analyzer. 
    You can extract key information, summarize content, generate questions, and create educational materials 
    from various document types including PDFs, Word documents, and text files.`

  return generateText(prompt, systemPrompt)
}

// Function for coding assistance
export async function getCodingAssistance(codeQuery: string, language = "javascript") {
  const prompt = `
As an expert programming instructor, provide detailed coding assistance for the following query in ${language}:

**Query:** ${codeQuery}

Your response should be educational, professional, and suitable for college students or professionals. Structure it as follows using Markdown formatting:

### Concept Explanation
- Explain the core concept or problem clearly and concisely.
- Use analogies or real-world examples to make it relatable.
- Mention how this concept fits into broader programming principles, if applicable.

### Working Code Example
Provide a complete, well-commented code snippet that directly addresses the query. Ensure the code is clean, follows best practices, and is easy to understand. Use code blocks with the appropriate language specifier.

\`\`\`${language}
// code here
\`\`\`

### Best Practices
- List 2-3 best practices related to the concept or code.
- Explain why these practices matter and how they improve the code.

### Common Pitfalls
- Identify 1-2 common mistakes learners might make.
- Offer tips to avoid or debug these issues.

### Alternative Approaches (if applicable)
- Describe other ways to solve the problem or implement the concept.
- Compare pros and cons of these alternatives.

### Further Learning
- Suggest 1-2 resources (articles, documentation, tutorials) for deeper understanding.

**Tone**: Keep the response engaging, professional, and clear. Use simple language and a step-by-step explanation.

**Example Format**:
- Start with a brief introduction to the concept.
- Follow with the code example in a code block.
- End with a summary of key takeaways or next steps.
  `

  const systemPrompt = `You are an expert programming instructor and software engineer. You specialize in teaching programming concepts to college students and professionals. Provide clear, well-commented code examples with detailed explanations using Markdown formatting for better readability.`

  return generateText(prompt, systemPrompt, true) // Use coding model
}
