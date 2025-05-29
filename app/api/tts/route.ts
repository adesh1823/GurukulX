import { type NextRequest, NextResponse } from "next/server"
import { TextToSpeechClient } from "@google-cloud/text-to-speech"

// Initialize Google Cloud TTS client with service account credentials
const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
  };
  

const ttsClient = new TextToSpeechClient({
  credentials,
  projectId: credentials.project_id,
})

// Cache for storing generated audio (in production, use Redis or similar)
const audioCache = new Map<string, { audio: Buffer; timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Cleanup old cache entries
const cleanupCache = () => {
  const now = Date.now()
  for (const [key, value] of audioCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      audioCache.delete(key)
    }
  }
}

// Voice mapping for different languages
const voiceMapping = {
  "hi-IN": "hi-IN-Wavenet-A",
  "pa-IN": "pa-IN-Wavenet-A",
  "mr-IN": "mr-IN-Wavenet-A",
  "en-IN": "en-IN-Wavenet-D",
}

export async function POST(request: NextRequest) {
  try {
    const { text, language = "hi-IN", voice, tone } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text is too long for TTS. Maximum 5,000 characters allowed." },
        { status: 400 },
      )
    }

    // Clean up old cache entries
    cleanupCache()

    // Create cache key
    const cacheKey = `${text}-${language}-${tone?.id || "neutral"}`

    // Check cache first
    const cached = audioCache.get(cacheKey)
    if (cached) {
      console.log("Returning cached audio")
      return new NextResponse(cached.audio, {
        headers: {
          "Content-Type": "audio/wav",
          "Cache-Control": "public, max-age=1800", // 30 minutes
          "X-Cache": "HIT",
        },
      })
    }

    // Determine voice based on language
    const selectedVoice = voice || voiceMapping[language as keyof typeof voiceMapping] || "en-IN-Wavenet-D"

    // Configure audio settings based on emotional tone
    const audioConfig: any = {
      audioEncoding: "LINEAR16",
      sampleRateHertz: 24000,
      effectsProfileId: ["telephony-class-application"],
    }

    // Apply tone-specific settings
    if (tone) {
      audioConfig.pitch = tone.pitch || 0
      audioConfig.speakingRate = tone.speakingRate || 1.0
    }

    // Prepare the TTS request
    const request_config = {
      input: { text },
      voice: {
        languageCode: language,
        name: selectedVoice,
        ssmlGender: "FEMALE" as const,
      },
      audioConfig,
    }

    console.log("Generating TTS with config:", {
      language,
      voice: selectedVoice,
      textLength: text.length,
      tone: tone?.name || "neutral",
    })

    // Generate speech
    const [response] = await ttsClient.synthesizeSpeech(request_config)

    if (!response.audioContent) {
      throw new Error("No audio content received from TTS service")
    }

    const audioBuffer = Buffer.from(response.audioContent as Uint8Array)

    // Cache the generated audio
    audioCache.set(cacheKey, {
      audio: audioBuffer,
      timestamp: Date.now(),
    })

    console.log("TTS generation successful, audio cached")

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=1800", // 30 minutes
        "X-Cache": "MISS",
        "Content-Length": audioBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating TTS audio:", error)

    // Provide detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        error: "Failed to generate audio",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Cleanup function for serverless environments
export async function GET() {
  cleanupCache()
  return NextResponse.json({
    message: "Cache cleaned",
    cacheSize: audioCache.size,
    timestamp: new Date().toISOString(),
  })
}
