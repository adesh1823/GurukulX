
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle } from "lucide-react"

interface CollaborationPanelProps {
  isCollaborating: boolean
  setShowAiPanel: (show: boolean) => void
}

export function CollaborationPanel({ isCollaborating, setShowAiPanel }: CollaborationPanelProps) {
  const [connectedUsers] = useState<string[]>([
    "Teacher (You)", 
    "Student 1", 
    "Student 2", 
    "Student 3"
  ])
  
  const [studentQuestions] = useState<string[]>([
    "Can you explain this formula step by step?",
    "What's the difference between these two concepts?",
    "How do we apply this in real-world scenarios?",
    "Can you show more examples of this problem type?",
  ])

  return (
    <AnimatePresence>
      {isCollaborating && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 shadow-lg"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Live Collaboration
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Connected Users ({connectedUsers.length})
                </h4>
                <div className="space-y-2">
                  {connectedUsers.map((user, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-white/60 rounded">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                      <span className={index === 0 ? 'font-medium' : ''}>{user}</span>
                      {index === 0 && <Badge variant="secondary" className="ml-auto text-xs">You</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Student Questions
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {studentQuestions.map((question, index) => (
                    <Card key={index} className="p-3 bg-white/80 hover:bg-white transition-colors">
                      <p className="text-sm mb-2">{question}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs"
                          onClick={() => setShowAiPanel(true)}
                        >
                          Answer with AI
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs"
                        >
                          Respond
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Session: 23 min</span>
                  <Badge variant="outline" className="text-xs">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                    Live
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
