"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  Users,
  Bot,
  Presentation,
  FileQuestion,
  Mic,
  ImageIcon,
  MessageSquare,
  BookMarked,
  Sparkles,
  FileEdit,
  GraduationCap,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()

  if (isMobile) {
    return null
  }

  return (
    <div className="hidden border-r bg-background md:block">
      <ScrollArea className="h-[calc(100vh-4rem)] w-64 py-6">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold">Features</h2>
          <div className="space-y-1">
            <NavItem
              href="/lesson-planning"
              icon={BookOpen}
              title="Lesson Planning"
              isActive={pathname === "/lesson-planning"}
            >
              <NavItem
                href="/lesson-planning/create"
                icon={Presentation}
                title="Create Lesson Plan"
                isActive={pathname === "/lesson-planning/create"}
                isChild
              />
              <NavItem
                href="/lesson-planning/slides"
                icon={Presentation}
                title="Generate Slides"
                isActive={pathname === "/lesson-planning/slides"}
                isChild
              />
              <NavItem
                href="/lesson-planning/worksheets"
                icon={FileQuestion}
                title="Create Worksheets"
                isActive={pathname === "/lesson-planning/worksheets"}
                isChild
              />
            </NavItem>

            <NavItem
              href="/student-engagement"
              icon={Users}
              title="Student Engagement"
              isActive={pathname === "/student-engagement"}
            >
              <NavItem
                href="/student-engagement/chatbot"
                icon={MessageSquare}
                title="AI Tutor Chatbot"
                isActive={pathname === "/student-engagement/chatbot"}
                isChild
              />
              <NavItem
                href="/student-engagement/adaptive"
                icon={GraduationCap}
                title="Adaptive Learning"
                isActive={pathname === "/student-engagement/adaptive"}
                isChild
              />
              <NavItem
                href="/student-engagement/study-guides"
                icon={BookMarked}
                title="Study Guides"
                isActive={pathname === "/student-engagement/study-guides"}
                isChild
              />
            </NavItem>

            <NavItem
              href="/research-support"
              icon={FileText}
              title="Research Support"
              isActive={pathname === "/research-support"}
            >
              <NavItem
                href="/research-support/summarize"
                icon={FileEdit}
                title="Summarize Papers"
                isActive={pathname === "/research-support/summarize"}
                isChild
              />
              <NavItem
                href="/research-support/paraphrase"
                icon={FileEdit}
                title="Paraphrase & Grammar"
                isActive={pathname === "/research-support/paraphrase"}
                isChild
              />
            </NavItem>

            <NavItem href="/ai-assistants" icon={Bot} title="AI Assistants" isActive={pathname === "/ai-assistants"}>
              <NavItem
                href="/ai-assistants/voice"
                icon={Mic}
                title="Voice Assistant"
                isActive={pathname === "/ai-assistants/voice"}
                isChild
              />
              <NavItem
                href="/ai-assistants/vision"
                icon={ImageIcon}
                title="Vision Assistant"
                isActive={pathname === "/ai-assistants/vision"}
                isChild
              />
              <NavItem
                href="/ai-assistants/customize"
                icon={Sparkles}
                title="Customize Assistant"
                isActive={pathname === "/ai-assistants/customize"}
                isChild
              />
            </NavItem>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  title: string
  isActive?: boolean
  isChild?: boolean
  children?: React.ReactNode
}

function NavItem({ href, icon: Icon, title, isActive, isChild, children }: NavItemProps) {
  return (
    <div>
      <Link href={href} passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isActive ? "bg-accent text-accent-foreground" : "transparent",
            isChild ? "pl-8" : "pl-2",
          )}
        >
          <Icon className={cn("mr-2 h-4 w-4", isChild ? "opacity-70" : "")} />
          <span className={cn(isChild ? "text-sm" : "")}>{title}</span>
        </Button>
      </Link>
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}
