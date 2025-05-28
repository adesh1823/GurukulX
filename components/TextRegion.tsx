import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  fontFamily?: string
  isBold?: boolean
  isItalic?: boolean
}

interface TextRegionProps {
  textElement: TextElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<TextElement>) => void
  onDelete: () => void
}

export const TextRegion = React.memo(function TextRegion({ textElement, isSelected, onSelect, onUpdate, onDelete }: TextRegionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localText, setLocalText] = useState(textElement.text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debounce = useCallback((fn: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }, [])

  useEffect(() => {
    if (isSelected && isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isSelected, isEditing])

  useEffect(() => {
    setLocalText(textElement.text)
    if (textElement.text === "" && isSelected) {
      setIsEditing(true)
    }
  }, [textElement.text, isSelected])

  const handleSave = useCallback(
    debounce(() => {
      if (localText !== textElement.text) {
        onUpdate({ text: localText })
      }
      setIsEditing(false)
    }, 300),
    [localText, textElement.text, onUpdate]
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      setLocalText(textElement.text)
      setIsEditing(false)
    }
  }, [handleSave, textElement.text])

  const containerStyle = {
    position: "absolute" as const,
    left: textElement.x,
    top: textElement.y,
    width: textElement.width,
    minHeight: textElement.height,
    zIndex: isSelected ? 50 : 10,
  }

  return (
    <motion.div
      ref={containerRef}
      style={containerStyle}
      drag={isSelected && !isEditing}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_e, { point }) => {
        const canvas = document.querySelector("canvas")
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          const x = Math.max(0, Math.min(point.x - rect.left, rect.width - textElement.width))
          const y = Math.max(0, Math.min(point.y - rect.top, rect.height - textElement.height))
          onUpdate({ x, y })
        }
      }}
      className={`group cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      {isEditing ? (
        <Textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full h-full min-h-[30px] p-2 border-2 border-blue-500 rounded resize-none bg-white/90"
          style={{
            fontSize: textElement.fontSize,
            color: textElement.color,
            fontFamily: textElement.fontFamily || "Inter",
            fontWeight: textElement.isBold ? "bold" : "normal",
            fontStyle: textElement.isItalic ? "italic" : "normal",
          }}
        />
      ) : (
        <div
          className="w-full h-full p-2 bg-white/80 rounded border border-gray-200 hover:bg-white/90"
          style={{
            fontSize: textElement.fontSize,
            color: textElement.color,
            fontFamily: textElement.fontFamily || "Inter",
            fontWeight: textElement.isBold ? "bold" : "normal",
            fontStyle: textElement.isItalic ? "italic" : "normal",
            minHeight: "30px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {textElement.text || "Double-click to edit text"}
        </div>
      )}

      {isSelected && !isEditing && (
        <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Input
            type="number"
            min="8"
            max="72"
            value={textElement.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 16 })}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-16 h-6 text-xs"
            title="Font Size"
          />
          <Input
            type="color"
            value={textElement.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-8 h-6 p-0 border-0"
            title="Text Color"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-6 w-6 p-0"
            title="Delete Text"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

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
    </motion.div>
  )
})