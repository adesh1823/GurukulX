"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { GradientText } from "@/components/ui/gradient-text"
import { Network } from "lucide-react"

const ChatFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0)
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false })
  const phoneRef = useRef(null)

  // Simulated typing effect
  const [typingText, setTypingText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const fullTexts = [
    "I can generate flowcharts, mind maps, diagrams, and visual content to make your lessons more engaging and easier to understand.",
    "Advanced grading assistant to help you assess student work quickly and accurately.",
    "Tools to boost student participation and make learning fun and interactive.",
  ]

  const features = [
    {
      title: "Visual Content Generation",
      description: "Generate flowcharts, diagrams, and visual aids to make complex concepts easy to understand.",
      icon: "🎨",
      color: "from-purple-500 to-blue-600",
      highlight: "Create stunning visuals",
      animation: "float",
    },
    {
      title: "Smart Coding Assistant",
      description: "Assess coding work quickly and accurately with our advanced coding assistant.",
      icon: "🎓",
      color: "from-purple-500 to-blue-600",
      highlight: "Grade coder, not harder",
      animation: "pulse",
    },
    {
      title: "Research paper tools",
      description: "Get help in summarisation and analysis of research papers.",
      icon: "✨",
      color: "from-purple-500 to-blue-600",
      highlight: "Inspire your students",
      animation: "bounce",
    },
  ]

  const secondaryFeatures = [
    {
      title: "Worksheet Generation",
      description: "Create customized worksheets for any subject.",
      icon: "📄",
      color: "bg-red-500",
    },
    {
      title: "Question paper Generation",
      description: "Generate question papers and edit them according to your choice.",
      icon: "❓",
      color: "bg-yellow-500",
    },
    {
      title: "Research papers",
      description: "Summarize research papers for better and time saving understanding.",
      icon: "🗣️",
      color: "bg-pink-500",
    },
    {
      title: "Curriculum Planning",
      description: "Plan your curriculum with AI-powered suggestions.",
      icon: "🗓️",
      color: "bg-orange-500",
    },
    {
      title: "Flowchart Generation",
      description: "Generate flowcharts to make complex concepts easy to understand.",
      icon: "📊",
      color: "bg-teal-500",
    },
    {
      title: "Whiteboard",
      description: "Generate whiteboard content or direclty write on it using stylus.",
      icon: "🍎",
      color: "bg-indigo-500",
    },
    {
      title: "PPT Vision Assistance ",
      description: "Analyzde your slides with advanced vision models.",
      icon: "📝",
      color: "bg-cyan-500",
    },
  ]

  // Typing effect
  useEffect(() => {
    if (activeFeature !== null) {
      const text = fullTexts[activeFeature]
      let currentIndex = 0
      setTypingText("")
      setIsTyping(true)

      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setTypingText((prev) => prev + text[currentIndex])
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, 30)

      return () => clearInterval(typingInterval)
    }
  }, [activeFeature])

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [features.length])

  // Phone tilt effect based on mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!phoneRef.current) return

      const phoneElement = phoneRef.current
      const rect = phoneElement.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const maxRotation = 10 // Maximum rotation in degrees

      // Calculate rotation based on mouse position relative to center
      const rotateY = ((e.clientX - centerX) / (window.innerWidth / 2)) * maxRotation
      const rotateX = ((e.clientY - centerY) / (window.innerHeight / 2)) * -maxRotation

      phoneElement.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
    }

    const handleMouseLeave = () => {
      if (!phoneRef.current) return
      // Reset rotation when mouse leaves
      phoneRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)"
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const phoneVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1,
      },
    },
  }

  const notificationVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 1.5,
      },
    },
  }

  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div className="min-h-screen bg-transparent text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF", "#FFFFFF"]} animationSpeed={3}>
              GurukulX Chat Assistant
            </GradientText>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Experience the future of education through our intelligent chat interface
          </p>
        </motion.div>

        {/* Main Features Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Phone Mockup */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={phoneVariants}
            className="relative flex justify-center items-center"
          >
            {/* Animated background elements */}
            <div className="absolute -z-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -z-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -z-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Floating elements around phone */}
            <motion.div
              className="absolute -top-10 -right-10 bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-2xl z-10"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              {features[0].icon}
            </motion.div>

            <motion.div
              className="absolute -bottom-5 -left-5 bg-purple-500 rounded-full w-14 h-14 flex items-center justify-center text-2xl z-10"
              animate={{
                y: [0, 15, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
              }}
            >
              {features[1].icon}
            </motion.div>

            <motion.div
              className="absolute top-1/2 -right-8 bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl z-10"
              animate={{
                x: [0, 10, 0],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
              }}
            >
              {features[2].icon}
            </motion.div>

            {/* Phone device */}
            <div
              ref={phoneRef}
              className="relative w-[300px] h-[600px] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-gray-800 transition-transform duration-200 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-xl z-10"></div>

              {/* Phone buttons */}
              <div className="absolute -left-1 top-[120px] w-1 h-12 bg-gray-700 rounded-l-lg"></div>
              <div className="absolute -left-1 top-[150px] w-1 h-12 bg-gray-700 rounded-l-lg"></div>
              <div className="absolute -right-1 top-[100px] w-1 h-16 bg-gray-700 rounded-r-lg"></div>

              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-b from-purple-900 to-blue-800 rounded-[32px] overflow-hidden relative">
                {/* Notification indicator */}
                <motion.div
                  variants={notificationVariants}
                  className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full z-20"
                >
                  <motion.div
                    className="absolute inset-0 bg-blue-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                </motion.div>

                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg">
                  <div className="flex items-center">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </motion.div>
                    <div className="ml-3">
                      <div className="font-bold">GurukulX Assistant</div>
                      <div className="text-xs opacity-75 flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-300 rounded-full mr-1"></span>
                        AI Teaching Assistant
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="p-3 h-[calc(100%-132px)] overflow-hidden">
                  {/* Assistant Welcome Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-3 max-w-[85%]"
                  >
                    <div className="bg-white rounded-lg rounded-tl-none p-3 text-gray-800 shadow-md">
                      <p className="text-sm">
                        Hello there! I can help you create visual content like flowcharts, diagrams, and lesson plans!
                        ✨
                      </p>
                      <p className="text-xs mt-1">What would you like me to create today? 🌟</p>
                    </div>
                  </motion.div>

                  {/* User Request for Flowchart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex justify-end mb-3"
                  >
                    <div className="bg-blue-600 rounded-lg rounded-tr-none p-3 text-white max-w-[85%]">
                      <p className="text-sm">Create a flowchart for "How to Solve a Math Problem"</p>
                    </div>
                  </motion.div>

                  {/* AI Generating Response */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="mb-3 max-w-[85%]"
                  >
                    <div className="bg-white rounded-lg rounded-tl-none p-3 text-gray-800 shadow-md">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-md mb-2 flex items-center">
                        <motion.div
                          className="bg-white/20 rounded-full p-1 mr-2"
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        >
                          <span className="text-xl">🎨</span>
                        </motion.div>
                        <span className="font-bold text-white">Creating your flowchart...</span>
                      </div>
                      <p className="text-sm mb-3">
                        Perfect! I'll create a visual flowchart to help your students understand problem-solving steps.
                      </p>

                      {/* Flowchart Container */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 3.5, duration: 0.8, type: "spring" }}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 mb-2"
                      >
                        <div className="text-center mb-2">
                          <span className="text-xs font-semibold text-gray-600">📊 Generated Flowchart</span>
                        </div>

                        {/* Flowchart Visualization */}
                        <div className="relative">
                          {/* Start Node */}
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4, duration: 0.5 }}
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded-full text-center mb-2 mx-auto w-fit"
                          >
                            📚 Start: Read Problem
                          </motion.div>

                          {/* Arrow 1 */}
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ delay: 4.3, duration: 0.3 }}
                            className="w-0.5 h-3 bg-gray-400 mx-auto mb-1"
                          />

                          {/* Step 1 */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 4.6, duration: 0.5 }}
                            className="bg-blue-500 text-white text-xs px-2 py-1 rounded text-center mb-2 mx-auto w-fit"
                          >
                            🤔 Understand the Problem
                          </motion.div>

                          {/* Arrow 2 */}
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ delay: 4.9, duration: 0.3 }}
                            className="w-0.5 h-3 bg-gray-400 mx-auto mb-1"
                          />

                          {/* Step 2 */}
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 5.2, duration: 0.5 }}
                            className="bg-purple-500 text-white text-xs px-2 py-1 rounded text-center mb-2 mx-auto w-fit"
                          >
                            📝 Plan Solution
                          </motion.div>

                          {/* Arrow 3 */}
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ delay: 5.5, duration: 0.3 }}
                            className="w-0.5 h-3 bg-gray-400 mx-auto mb-1"
                          />

                          {/* Step 3 */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 5.8, duration: 0.5 }}
                            className="bg-orange-500 text-white text-xs px-2 py-1 rounded text-center mb-2 mx-auto w-fit"
                          >
                            ⚡ Execute Solution
                          </motion.div>

                          {/* Arrow 4 */}
                          <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ delay: 6.1, duration: 0.3 }}
                            className="w-0.5 h-3 bg-gray-400 mx-auto mb-1"
                          />

                          {/* Decision Diamond */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 6.4, duration: 0.5 }}
                            className="relative mx-auto w-fit mb-2"
                          >
                            <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-lg text-center transform rotate-45 w-16 h-16 flex items-center justify-center">
                              <span className="transform -rotate-45">✓?</span>
                            </div>
                          </motion.div>

                          {/* Final Arrows and End */}
                          <div className="flex justify-between items-center">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 6.7, duration: 0.5 }}
                              className="text-xs text-red-600 font-semibold"
                            >
                              ❌ No → Retry
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 7, duration: 0.5 }}
                              className="bg-green-600 text-white text-xs px-2 py-1 rounded-full"
                            >
                              🎉 Success!
                            </motion.div>
                          </div>

                          {/* Sparkle Effects */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ delay: 7.5, duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                            className="absolute top-0 right-0 text-yellow-400"
                          >
                            ✨
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ delay: 8, duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                            className="absolute bottom-0 left-0 text-blue-400"
                          >
                            💫
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 7.5 }}
                        className="text-xs mt-2 text-green-600 font-semibold"
                      >
                        ✅ Flowchart generated! Perfect for your math class! 🎯
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Follow-up AI Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 8.5 }}
                    className="mb-3 max-w-[85%]"
                  >
                    <div className="bg-white rounded-lg rounded-tl-none p-3 text-gray-800 shadow-md">
                      <p className="text-sm">
                        I can also create concept maps, lesson timelines, and interactive diagrams! 🚀
                      </p>
                      <p className="text-xs mt-1">Your students will love visual learning! 📈✨</p>
                    </div>
                  </motion.div>
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-3">
                  <div className="flex items-center bg-white rounded-full px-4 py-1 shadow-inner">
                    <motion.div whileHover={{ scale: 1.1 }} className="text-gray-500 mr-2">
                      😊
                    </motion.div>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="bg-transparent border-none flex-1 focus:outline-none text-gray-800 text-sm py-2"
                      readOnly
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Feature Indicator */}
                <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                  <div className="flex space-x-1">
                    {features.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          activeFeature === index ? "bg-blue-400" : "bg-gray-400 bg-opacity-40"
                        }`}
                        animate={
                          activeFeature === index
                            ? {
                                scale: [1, 1.5, 1],
                                backgroundColor: ["#6366f1", "#22d3ee", "#6366f1"],
                              }
                            : {}
                        }
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      ></motion.div>
                    ))}
                  </div>
                </div>

                {/* Screen reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-[0.03] pointer-events-none rounded-[32px]"></div>

                {/* Screen glare effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 pointer-events-none rounded-[32px]"
                  animate={{
                    opacity: [0, 0.07, 0],
                    left: ["-100%", "100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 5,
                  }}
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* Feature List */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            // initial="hidden"
            animate={controls}
            className="flex flex-col justify-center"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-8">
              <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF"]}>Enhanced Features</GradientText>
            </motion.h2>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  className={`p-1 rounded-xl bg-gradient-to-r ${feature.color} ${
                    activeFeature === index ? "ring-2 ring-offset-4 ring-offset-gray-900 ring-blue-400" : ""
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="bg-gray-800 p-6 rounded-lg h-full backdrop-blur-sm bg-opacity-90">
                    <div className="flex items-start">
                      <motion.div
                        className={`rounded-lg p-3 bg-gradient-to-br ${feature.color} text-white mr-4`}
                        animate={{
                          scale: activeFeature === index ? [1, 1.1, 1] : 1,
                          rotate: activeFeature === index ? [0, 5, 0] : 0,
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        <span className="text-2xl">{feature.icon}</span>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 shadow-lg"
              >
                <Network className="mr-2" />
                Try Flowchart Generator
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Secondary Features Grid */}
        <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={controls} className="mt-20">
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <GradientText colors={["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF"]}>
              More Powerful Features in our Chat Assistant
            </GradientText>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm bg-opacity-80"
              >
                <motion.div
                  className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-xl`}
                  whileHover={{ rotate: 5 }}
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, index % 2 === 0 ? 5 : -5, 0],
                  }}
                  transition={{
                    duration: 3 + index * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: index * 0.1,
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 1s;
        }
        .animation-delay-4000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export default ChatFeatures
