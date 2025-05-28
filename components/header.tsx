"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, Users, FileText, Bot, Menu, X, Globe, DollarSign ,Network, Workflow} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { GradientText } from "./ui/gradient-text"
import Image from "next/image"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "Lesson Planning", href: "/lesson-planning", icon: BookOpen },
    { name: "Research Support", href: "/research-support/summarize", icon: FileText },
    { name: "AI Assistants", href: "/ai-assistants", icon: Bot },
    { name: "Flowchart Gen", href: "/research-support/flowchart", icon: Workflow, external: true },
    { name: "Developer Portfolio", href: "https://arav-portfolio.vercel.app/", icon: Globe, external: true },
    
  ]

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, when: "beforeChildren", staggerChildren: 0.1 },
    },
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="rounded-full bg-transparent size-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/logooo.png"
                alt="TeachAI Logo"
                width={40}
                height={40}
              />
            </motion.div>
            <h1 className=" mr-3 font-bold text-2xl group-hover:text-primary transition-colors bg-gradient from-purple-500 to-blue-500 hidden md:inline-block">
              <GradientText>GurukulX</GradientText>
            </h1>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
                    "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300",
                    isActive && !item.external ? "after:w-full" : "after:w-0 hover:after:w-full",
                  )}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-accent/50 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-2 px-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <motion.div key={item.href} variants={mobileItemVariants}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive && !item.external
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </header>
  )
}
