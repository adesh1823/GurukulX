"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFileUpload: (file: File, content: string) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  title?: string
  description?: string
}

export function FileUpload({
  onFileUpload,
  acceptedTypes = [".pdf", ".doc", ".docx", ".txt"],
  maxSize = 10,
  title = "Upload Document",
  description = "Upload PDF, Word, or text documents for processing",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Validate file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload files with extensions: ${acceptedTypes.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please upload files smaller than ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setUploadedFile(file)

    try {
      let content = ""

      if (file.type === "text/plain") {
        content = await file.text()
      } else if (file.type === "application/pdf") {
        // For PDF files, we'll need to implement PDF parsing
        // For now, we'll use a placeholder
        content = `[PDF Content] - File: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        toast({
          title: "PDF Processing",
          description: "PDF processing is simulated. In production, this would extract actual text content.",
        })
      } else if (file.type.includes("word") || file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
        // For Word files, we'll need to implement Word parsing
        // For now, we'll use a placeholder
        content = `[Word Document Content] - File: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        toast({
          title: "Word Document Processing",
          description: "Word document processing is simulated. In production, this would extract actual text content.",
        })
      } else {
        content = await file.text()
      }

      onFileUpload(file, content)

      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and is ready for analysis.`,
      })
    } catch (error) {
      console.error("Error processing file:", error)
      toast({
        title: "Error processing file",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "txt":
        return <File className="h-8 w-8 text-gray-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragging ? "Drop your file here" : "Drag and drop your file here"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedTypes.join(",")}
              onChange={handleFileSelect}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: {acceptedTypes.join(", ")} (max {maxSize}MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getFileIcon(uploadedFile.name)}
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} disabled={isProcessing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
