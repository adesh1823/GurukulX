"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Play,
  Pause,
  Download,
  Volume2,
  Sparkles,
  Languages,
  Heart,
  Zap,
  Smile,
  Brain,
  Loader2,
  Mic,
  Speaker,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GradientText } from "@/components/ui/gradient-text";

interface ProcessingState {
  isProcessing: boolean;
  isGeneratingAudio: boolean;
  progress: number;
  stage: string;
}

interface AudioState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  audioUrl: string | null;
}

const languages = [
  { code: "hi-IN", name: "Hindi", flag: "🇮🇳", voice: "hi-IN-Wavenet-A" },
  { code: "pa-IN", name: "Punjabi", flag: "🇮🇳", voice: "pa-IN-Wavenet-A" },
  { code: "mr-IN", name: "Marathi", flag: "🇮🇳", voice: "mr-IN-Wavenet-A" },
  { code: "en-IN", name: "English (Indian)", flag: "🇮🇳", voice: "en-IN-Wavenet-D" },
];

const emotionalTones = [
  {
    id: "neutral",
    name: "Neutral",
    icon: Smile,
    description: "Clear and professional",
    pitch: 0,
    speakingRate: 1.0,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "excited",
    name: "Excited",
    icon: Zap,
    description: "Energetic and enthusiastic",
    pitch: 2,
    speakingRate: 1.1,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "calming",
    name: "Calming",
    icon: Heart,
    description: "Soothing and relaxed",
    pitch: -2,
    speakingRate: 0.9,
    color: "from-green-500 to-emerald-500",
  },
];

export default function TTSLearningPage() {
  const [inputText, setInputText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTone, setSelectedTone] = useState("neutral");
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    isGeneratingAudio: false,
    progress: 0,
    stage: "",
  });
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    audioUrl: null,
  });
  const [volume, setVolume] = useState([80]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioState.audioUrl) {
        URL.revokeObjectURL(audioState.audioUrl);
      }
    };
  }, [audioState.audioUrl]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setAudioState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      }));
    };

    const handleEnded = () => {
      setAudioState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, [audioState.audioUrl]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a text file (.txt)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInputText(text);
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${text.length} characters`,
      });
    };
    reader.readAsText(file);
  };

  const processText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter or upload some text to process",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLanguage) {
      toast({
        title: "No language selected",
        description: "Please select a language before processing",
        variant: "destructive",
      });
      return;
    }

    setProcessingState({
      isProcessing: true,
      isGeneratingAudio: false,
      progress: 20,
      stage: "Processing text with AI...",
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to process text");

      const data = await response.json();
      setProcessedText(data.processedText);

      setProcessingState((prev) => ({
        ...prev,
        progress: 100,
        stage: data.translated
          ? `Text translated to ${data.targetLanguage} and processed successfully!`
          : "Text processed successfully!",
      }));

      setTimeout(() => {
        setProcessingState((prev) => ({ ...prev, isProcessing: false }));
      }, 1000);

      toast({
        title: "Text processed successfully",
        description: data.translated
          ? `Your content has been translated to ${data.targetLanguage} and enhanced for audio`
          : "Your content has been enhanced and is ready for audio generation",
      });
    } catch (error) {
      console.error("Error processing text:", error);
      setProcessingState((prev) => ({ ...prev, isProcessing: false }));
      toast({
        title: "Processing failed",
        description: "Failed to process text. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateAudio = async () => {
    if (!processedText.trim()) {
      toast({
        title: "No processed text",
        description: "Please process some text first",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLanguage) {
      toast({
        title: "No language selected",
        description: "Please select a language for audio generation",
        variant: "destructive",
      });
      return;
    }

    setProcessingState({
      isProcessing: false,
      isGeneratingAudio: true,
      progress: 30,
      stage: "Generating audio...",
    });

    try {
      const selectedToneData = emotionalTones.find((tone) => tone.id === selectedTone);
      const selectedLangData = languages.find((lang) => lang.code === selectedLanguage);

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: processedText,
          language: selectedLanguage,
          voice: selectedLangData?.voice,
          tone: selectedToneData,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate audio");

      setProcessingState((prev) => ({ ...prev, progress: 80, stage: "Finalizing audio..." }));

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioState.audioUrl) {
        URL.revokeObjectURL(audioState.audioUrl);
      }

      setAudioState((prev) => ({
        ...prev,
        audioUrl,
        isPlaying: false,
        currentTime: 0,
      }));

      setProcessingState((prev) => ({
        ...prev,
        progress: 100,
        stage: "Audio generated successfully!",
      }));

      setTimeout(() => {
        setProcessingState((prev) => ({ ...prev, isGeneratingAudio: false }));
      }, 1000);

      toast({
        title: "Audio generated successfully",
        description: "Your learning material is ready to play!",
      });
    } catch (error) {
      console.error("Error generating audio:", error);
      setProcessingState((prev) => ({ ...prev, isGeneratingAudio: false }));
      toast({
        title: "Audio generation failed",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !audioState.audioUrl) return;

    if (audioState.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const downloadAudio = () => {
    if (!audioState.audioUrl) return;

    const a = document.createElement("a");
    a.href = audioState.audioUrl;
    a.download = `learning-material-${selectedLanguage}-${selectedTone}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Download started",
      description: "Your audio file is being downloaded",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedToneData = emotionalTones.find((tone) => tone.id === selectedTone);
  const selectedLangData = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Speaker className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold ">
              <GradientText> AI-Read Learning Material</GradientText><span className="text-yellow-500"> (Beta)</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your educational content into engaging <span className="text-green-500">audio experiences</span> with AI-powered processing and
            multilingual text-to-speech
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-effect border-blue-500/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5" />
                  Input Learning Material
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Upload a text file or paste your educational content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Text File
                  </Button>
                  <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Or paste your text here:</label>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your lesson content, articles, or notes here..."
                    className="min-h-[200px] bg-black/20 border-blue-500/30 text-white placeholder:text-gray-400 resize-none"
                  />
                  <div className="text-xs text-gray-400 text-right">{inputText.length} characters</div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Select Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="bg-black/20 border-blue-500/30">
                      <SelectValue placeholder="Choose a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={processText}
                  disabled={!inputText.trim() || !selectedLanguage || processingState.isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                >
                  {processingState.isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Process with AI
                    </>
                  )}
                </Button>

                <AnimatePresence>
                  {processingState.isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{processingState.stage}</span>
                        <span className="text-purple-400">{processingState.progress}%</span>
                      </div>
                      <Progress value={processingState.progress} className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-effect border-blue-500/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5" />
                  Processed Content
                </CardTitle>
                <CardDescription className="text-gray-300">
                  AI-enhanced and optimized for audio narration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {processedText ? (
                  <div className="space-y-4">
                    <div className="bg-black/20 border border-blue-500/30 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{processedText}</p>
                    </div>
                    <div className="text-xs text-gray-400 text-right">{processedText.length} characters processed</div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Process your text to see the AI-enhanced version here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {processedText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Card className="glass-effect border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Languages className="w-5 h-5" />
                    Audio Generation Settings
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Customize language and emotional tone for your audio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Select Language</label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="bg-black/20 border-green-500/30">
                          <SelectValue placeholder="Choose a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center gap-2">
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Emotional Tone</label>
                      <div className="grid grid-cols-3 gap-2">
                        {emotionalTones.map((tone) => {
                          const Icon = tone.icon;
                          return (
                            <motion.button
                              key={tone.id}
                              onClick={() => setSelectedTone(tone.id)}
                              className={`p-3 rounded-lg border transition-all ${
                                selectedTone === tone.id
                                  ? "border-white bg-white/10"
                                  : "border-gray-600 hover:border-gray-400"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Icon className="w-5 h-5 mx-auto mb-1 text-white" />
                              <div className="text-xs text-gray-300">{tone.name}</div>
                            </motion.button>
                          );
                        })}
                      </div>
                      {selectedToneData && <p className="text-xs text-gray-400">{selectedToneData.description}</p>}
                    </div>
                  </div>

                  <Button
                    onClick={generateAudio}
                    disabled={processingState.isGeneratingAudio || !selectedLanguage}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {processingState.isGeneratingAudio ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Audio...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Generate Audio
                      </>
                    )}
                  </Button>

                  <AnimatePresence>
                    {processingState.isGeneratingAudio && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{processingState.stage}</span>
                          <span className="text-green-400">{processingState.progress}%</span>
                        </div>
                        <Progress value={processingState.progress} className="h-2" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {audioState.audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <Card className="glass-effect border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Volume2 className="w-5 h-5" />
                    Audio Player
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Listen to your AI-generated learning material
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <audio
                    ref={audioRef}
                    src={audioState.audioUrl}
                    onLoadedMetadata={() => {
                      if (audioRef.current) {
                        setAudioState((prev) => ({
                          ...prev,
                          duration: audioRef.current!.duration,
                        }));
                      }
                    }}
                  />

                  <div className="flex items-center gap-4">
                    <Button
                      onClick={togglePlayPause}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      {audioState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>{formatTime(audioState.currentTime)}</span>
                        <span>{formatTime(audioState.duration)}</span>
                      </div>
                      <Progress value={(audioState.currentTime / audioState.duration) * 100 || 0} className="h-2" />
                    </div>

                    <Button
                      onClick={downloadAudio}
                      variant="outline"
                      size="lg"
                      className="border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <Slider
                      value={volume}
                      onValueChange={(value) => {
                        setVolume(value);
                        if (audioRef.current) {
                          audioRef.current.volume = value[0] / 100;
                        }
                      }}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-400 w-12">{volume[0]}%</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-orange-500/30">
                      {selectedLangData?.flag} {selectedLangData?.name}
                    </Badge>
                    <Badge variant="outline" className="border-orange-500/30">
                      {selectedToneData?.name} Tone
                    </Badge>
                    <Badge variant="outline" className="border-orange-500/30">
                      {Math.round(audioState.duration)}s Duration
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}