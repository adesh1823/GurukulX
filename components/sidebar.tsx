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
  DollarSign,
  Lock,
  Network,
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
              href="/pricing"
              icon={DollarSign}
              title="Pricing"
              isActive={pathname === "/pricing"}
            />
            <NavItem
              href="/pricing"
              icon={DollarSign}
              title="SmileRate"
              isActive={pathname === "/pricing"}
              isChild
            />
            <NavItem
              href="/lesson-planning"
              icon={BookOpen}
              title="Lesson Planning"
              isActive={pathname === "/lesson-planning"}
            >
              <NavItem
                href="/student-engagement/chatbot"
                icon={MessageSquare}
                title="Question paper Gen"
                isActive={pathname === "/student-engagement/chatbot"}
                isChild
              />
              <NavItem
                href="/lesson-planning/create"
                icon={Presentation}
                title="Create Lesson Plan"
                isActive={pathname === "/lesson-planning/create"}
                isChild
              />
              <NavItem
                href="/lesson-planning/whiteboard"
                icon={Presentation}
                title="Whiteboard"
                isActive={pathname === "/lesson-planning/whiteboard"}
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
              <NavItem
                href="/research-support/flowchart"
                icon={Network}
                title="Flowchart"
                isActive={pathname === "/research-support/flowchart"}
                isChild
              />
            </NavItem>

            <NavItem
              href="/ai-assistants"
              icon={Bot}
              title="AI Assistants"
              isActive={pathname === "/ai-assistants"}
            >
              <NavItem
                href="/ai-assistants/coding"
                icon={Mic}
                title="Coding Assistant"
                isActive={pathname === "/ai-assistants/coding"}
                isChild
              />
            </NavItem>
            <NavItem
              href=""
              icon={Users}
              title="Student Engagement"
              isLocked
            >
              <NavItem
                href="/student-engagement/adaptive"
                icon={GraduationCap}
                title="Adaptive Learning"
                isActive={pathname === "/student-engagement/adaptive"}
                isChild
                isLocked
              />
              <NavItem
                href="/student-engagement/study-guides"
                icon={BookMarked}
                title="Study Guides"
                isActive={pathname === "/student-engagement/study-guides"}
                isChild
                isLocked
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
  isLocked?: boolean
  comingSoon?: boolean
  children?: React.ReactNode
}

function NavItem({
  href,
  icon: Icon,
  title,
  isActive,
  isChild,
  isLocked,
  comingSoon,
  children,
}: NavItemProps) {
  return (
    <div>
      <Link href={isLocked ? "#" : href} passHref>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start relative",
            isActive && !isLocked ? "bg-accent text-accent-foreground" : "transparent",
            isChild ? "pl-8" : "pl-2",
            isLocked ? "opacity-50 cursor-not-allowed" : "",
          )}
          disabled={isLocked}
        >
          <Icon className={cn("mr-2 h-4 w-4", isChild ? "opacity-70" : "")} />
          <span className={cn(isChild ? "text-sm" : "")}>{title}</span>
          {isLocked && <Lock className="ml-2 h-4 w-4 opacity-70" />}
          {comingSoon && !isChild && (
            <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              Coming Soon
            </span>
          )}
        </Button>
      </Link>
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}