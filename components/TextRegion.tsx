
import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

interface TextElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  fontSize: number
  color: string
  region: string
}

interface TextRegionProps {
  textElement: TextElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<TextElement>) => void
  onDelete: () => void
}

export function TextRegion({ textElement, isSelected, onSelect, onUpdate, onDelete }: TextRegionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localText, setLocalText] = useState(textElement.text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setLocalText(textElement.text)
  }, [textElement.text])

  const handleSave = () => {
    onUpdate({ text: localText })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      setLocalText(textElement.text)
      setIsEditing(false)
    }
  }

  const containerStyle = {
    position: "absolute" as const,
    left: `${(textElement.x / window.innerWidth) * 100}%`,
    top: `${(textElement.y / window.innerHeight) * 100}%`,
    width: `${textElement.width}px`,
    minHeight: `${textElement.height}px`,
    zIndex: isSelected ? 50 : 10,
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`group cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
      onClick={onSelect}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full h-full min-h-[30px] p-2 border-2 border-blue-500 rounded resize-none bg-white/90 backdrop-blur-sm"
          style={{
            fontSize: `${textElement.fontSize}px`,
            color: textElement.color,
            fontFamily: "inherit",
          }}
        />
      ) : (
        <div
          className="w-full h-full p-2 bg-white/80 backdrop-blur-sm rounded border border-gray-200 hover:bg-white/90 transition-colors"
          onDoubleClick={() => setIsEditing(true)}
          style={{
            fontSize: `${textElement.fontSize}px`,
            color: textElement.color,
            minHeight: "30px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {textElement.text || "Double-click to edit text"}
        </div>
      )}

      {/* Controls */}
      {isSelected && !isEditing && (
        <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Input
            type="number"
            min="8"
            max="72"
            value={textElement.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 16 })}
            className="w-16 h-6 text-xs"
            title="Font Size"
          />
          <Input
            type="color"
            value={textElement.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-8 h-6 p-0 border-0"
            title="Text Color"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="h-6 w-6 p-0"
            title="Delete Text"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Resize Handle */}
      {isSelected && !isEditing && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize opacity-50 hover:opacity-100"
          onMouseDown={(e) => {
            e.stopPropagation()
            const startX = e.clientX
            const startY = e.clientY
            const startWidth = textElement.width
            const startHeight = textElement.height

            const handleMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = moveEvent.clientX - startX
              const deltaY = moveEvent.clientY - startY
              onUpdate({
                width: Math.max(100, startWidth + deltaX),
                height: Math.max(30, startHeight + deltaY),
              })
            }

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove)
              document.removeEventListener("mouseup", handleMouseUp)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
          }}
        />
      )}
    </div>
  )
}
