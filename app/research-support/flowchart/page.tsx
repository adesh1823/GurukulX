"use client";

import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Download, Loader2, Copy, Zap } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { saveAs } from 'file-saver';
import { GradientText } from '@/components/ui/gradient-text';

const DEFAULT_DIAGRAM = `flowchart TD
    A["🚀 Start Your Journey"] --> B{"🤔 Choose Your Path"}
    B -->|💡 Create| C["✨ Build Something Amazing"]
    B -->|🎯 Learn| D["📚 Explore New Ideas"]
    C --> E["🎉 Success!"]
    D --> E
    E --> F["🔄 Keep Growing"]
    style A fill:#c7d2fe,stroke:#6366f1,stroke-width:2px
    style B fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style C fill:#d1fae5,stroke:#10b981,stroke-width:2px
    style D fill:#d1fae5,stroke:#10b981,stroke-width:2px
    style E fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px
    style F fill:#ddd6fe,stroke:#8b5cf6,stroke-width:2px`;

export default function FlowchartGenerator() {
  const [prompt, setPrompt] = useState('');
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_DIAGRAM);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderedSvg, setRenderedSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      flowchart: {
        curve: 'basis',
        useMaxWidth: true,
      },
    });
    renderDiagram(mermaidCode);
  }, []);

  const renderDiagram = async (code: string) => {
    if (!code.trim()) {
      setRenderedSvg('');
      setError('');
      return;
    }

    try {
      setError('');
      const { svg } = await mermaid.render('diagram', code);
      setRenderedSvg(svg);
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      setError(err instanceof Error ? err.message : 'Failed to render diagram. Please check the Mermaid code syntax.');
      setRenderedSvg('');
      toast({
        title: "Render Error",
        description: "Invalid Mermaid code. Please ensure the syntax is correct (e.g., use 'flowchart', not 'graph', and proper node syntax like ID[Label]).",
        variant: "destructive",
      });
    }
  };

  const generateDiagram = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of the diagram you want to create",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/flowchart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diagram');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMermaidCode(data.diagram);
      await renderDiagram(data.diagram);
      
      toast({
        title: "Diagram generated",
        description: "Your diagram has been generated successfully using Groq Llama 3.3",
      });
    } catch (error) {
      console.error('Error generating diagram:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate diagram. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setMermaidCode(newCode);
    renderDiagram(newCode);
  };

  const exportSvg = () => {
    if (!renderedSvg) {
      toast({
        title: "No diagram to export",
        description: "Please generate or create a valid diagram first",
        variant: "destructive",
      });
      return;
    }

    const svgBlob = new Blob([renderedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const filename = `flowchart-${Date.now()}.svg`;
    saveAs(svgBlob, filename);
    
    toast({
      title: "Export successful",
      description: `Saved as ${filename}`,
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode);
    toast({
      title: "Code copied",
      description: "Mermaid code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-centre">
                <GradientText>GX Flowchart Generator</GradientText>
              </h1>
              <p className="text-sm text-slate-400">Powered by GurukulX-1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={exportSvg} variant="outline" className="bg-slate-800/80 border-slate-600/50 text-slate-200 hover:bg-slate-700/80">
              <Download className="h-4 w-4 mr-2" />
              Export SVG
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* AI Prompt Section */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                AI Prompt
              </h2>
              <div className="space-y-4">
                <Input
                  placeholder="Describe your flowchart (e.g., user registration process, software development workflow...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-emerald-400"
                />
                <Button 
                  onClick={generateDiagram} 
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating with GurukulX...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Flowchart
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 animate-pulse"></span>
                  Mermaid Code
                </h2>
                <Button onClick={copyCode} variant="outline" size="sm" className="bg-slate-800/80 border-slate-600/50 text-slate-200 hover:bg-slate-700/80">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={mermaidCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Enter your Mermaid code here..."
                className="min-h-[400px] font-mono text-sm bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>
              Live Preview
            </h2>
            <div className="bg-slate-950/90 border border-slate-700/50 rounded-lg p-6 min-h-[600px] flex items-center justify-center">
              {error ? (
                <div className="text-center">
                  <div className="text-red-400 mb-2">⚠️ Render Error</div>
                  <pre className="text-red-300 text-sm bg-red-900/20 p-4 rounded border border-red-800/50 max-w-md">
                    {error}
                  </pre>
                </div>
              ) : renderedSvg ? (
                <div 
                  className="w-full h-full flex items-center justify-center overflow-auto"
                  dangerouslySetInnerHTML={{ __html: renderedSvg }}
                />
              ) : (
                <div className="text-slate-400 text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p>Your flowchart will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">
              <GradientText>⚡ Ultra-Fast AI-Powered Flowchart Generation</GradientText>
            </h3>
            <p className="text-slate-300 mb-4">
              Create professional flowcharts instantly using Groq's lightning-fast Llama 3.3 model. 
              Simply describe your process, and watch as AI generates beautiful Mermaid diagrams with enhanced styling.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center text-emerald-400">
                <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></span>
                GurukulX-1.0
              </div>
              <div className="flex items-center text-indigo-400">
                <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                Real-time Preview
              </div>
              <div className="flex items-center text-purple-400">
                <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                SVG Export
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}