"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Coffee, GraduationCap, Sparkles, Crown, Infinity as InfinityIcon, Check } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"


export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const { toast } = useToast()

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName)

    if (planName === "Guru's Blessing") {
      setShowEasterEgg(true)
      toast({
        title: "🙏 Guru's Blessing Activated!",
        description: "Your teachers are smiling somewhere! ✨",
      })
    } else if (planName === "Coffee Debt") {
      toast({
        title: "☕ Perfect Choice!",
        description: "Every professor deserves good coffee! Your karma is safe.",
      })
    } else if (planName === "Scholarship Fund") {
      toast({
        title: "🎓 Noble Heart!",
        description: "You're helping the next generation. Your teachers would be proud!",
      })
    }
  }

  const pricingPlans = [
    {
      name: "Guru's Blessing",
      price: "₹0",
      period: "Forever",
      description: "For those who learned from the best teachers",
      icon: Heart,
      color: "from-pink-500 to-red-500",
      popular: true,
      features: [
        "All AI features unlocked",
        "Unlimited lesson plans",
        "24/7 coding assistant",
        "Blessed by your teachers' wisdom",
        "Karma protection included",
        "Good vibes only",
        "Teacher's pet status",
        "Infinite gratitude",
      ],
      funnyNote: "Because a good student never forgets their teacher! 🙏",
      buttonText: "Accept Blessing",
    },
    {
      name: "Coffee Debt",
      price: "₹99",
      period: "per month",
      description: "Buy your professor a coffee (virtually)",
      icon: Coffee,
      color: "from-amber-500 to-orange-500",
      features: [
        "All premium features",
        "Priority support",
        "Advanced AI models",
        "Coffee karma points",
        "Professor appreciation badge",
        "Guilt-free usage",
        "Warm fuzzy feelings",
        "Caffeine-powered AI",
      ],
      funnyNote: "Every click sends virtual coffee to a professor somewhere! ☕",
      buttonText: "Brew Some Karma",
    },
    {
      name: "Scholarship Fund",
      price: "₹499",
      period: "per month",
      description: "Help the next generation of students",
      icon: GraduationCap,
      color: "from-blue-500 to-purple-500",
      features: [
        "Everything in Coffee Debt",
        "White-label solutions",
        "Custom AI training",
        "Scholarship contribution",
        "Hall of fame mention",
        "Teacher's blessing certificate",
        "Lifetime good karma",
        "Educational impact reports",
      ],
      funnyNote: "Your subscription helps fund scholarships. Teachers everywhere are doing happy dances! 💃",
      buttonText: "Spread the Knowledge",
    },
  ]

  const testimonials = [
    {
      name: "Prof. Sharma",
      role: "Computer Science",
      quote: "Finally, a student who remembers where they learned to code! 😊",
      avatar: "👨‍🏫",
    },
    {
      name: "Dr. Priya",
      role: "Mathematics",
      quote: "This pricing model restored my faith in students. Plus, free coffee! ☕",
      avatar: "👩‍🏫",
    },
    {
      name: "Prof. Kumar",
      role: "Physics",
      quote: "The only subscription that doesn't make me question the universe! 🌌",
      avatar: "👨‍🔬",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Guilt-Free Pricing</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <GradientText>Pricing That Makes</GradientText>
            <br />
            <GradientText colors={["#FF6B6B", "#4ECDC4", "#45B7D1"]}>Teachers Smile</GradientText>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Because a developer should never charge money from those who taught them to code! Choose your way to give
            back to the education community. 🎓
          </p>

          <motion.div
            className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 px-4 py-2 rounded-lg"
            animate={{
              scale: [1, 1.02, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Heart className="h-4 w-4 text-red-500" />
            Made with gratitude for all teachers
            <Heart className="h-4 w-4 text-red-500" />
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.name

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Blessed
                    </Badge>
                  </motion.div>
                )}

                <Card
                  className={`h-full transition-all duration-300 ${
                    isSelected ? "ring-2 ring-primary shadow-2xl shadow-primary/20" : "hover:shadow-xl"
                  } ${plan.popular ? "border-primary/50" : ""}`}
                >
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 360,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>

                    <div className="mt-4">
                      <motion.span
                        className="text-4xl font-bold"
                        animate={
                          plan.name === "Guru's Blessing"
                            ? {
                                scale: [1, 1.1, 1],
                                color: ["#000", "#ff6b6b", "#000"],
                              }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {plan.price}
                      </motion.span>
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + featureIndex * 0.1 }}
                      >
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}

                    <motion.div className="mt-6 p-3 bg-accent/50 rounded-lg" whileHover={{ scale: 1.02 }}>
                      <p className="text-xs text-center italic text-muted-foreground">{plan.funnyNote}</p>
                    </motion.div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold`}
                      onClick={() => handlePlanSelect(plan.name)}
                      disabled={isSelected}
                    >
                      <motion.span animate={isSelected ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.5 }}>
                        {isSelected ? "Selected! 🎉" : plan.buttonText}
                      </motion.span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Easter Egg Animation */}
        <AnimatePresence>
          {showEasterEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
              onClick={() => setShowEasterEgg(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center max-w-md mx-4"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat : Infinity, ease: "linear" }}
                  className="text-6xl mb-4"
                >
                  🙏
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Guru's Blessing Received!</h3>
                <p className="text-muted-foreground mb-4">
                  Your teachers are sending you good vibes from wherever they are! May your code compile on the first
                  try! ✨
                </p>
                <Button onClick={() => setShowEasterEgg(false)}>Namaste 🙏</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">
            <GradientText>What Teachers Are Saying</GradientText>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-accent/30 p-6 rounded-xl"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">
            <GradientText>Frequently Asked Questions</GradientText>
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="p-6 text-left">
              <h3 className="font-semibold mb-2">Is the "Guru's Blessing" plan really free?</h3>
              <p className="text-muted-foreground">
                It's our way of honoring the teachers who shaped us. The only payment required is your gratitude and
                good karma! 🙏
              </p>
            </Card>

            <Card className="p-6 text-left">
              <h3 className="font-semibold mb-2">Do you actually send coffee to professors?</h3>
              <p className="text-muted-foreground">
                While we can't physically deliver coffee (yet!), we do contribute to educational initiatives and teacher
                appreciation programs. Your subscription helps! ☕
              </p>
            </Card>

            <Card className="p-6 text-left">
              <h3 className="font-semibold mb-2">What if I never had good teachers?</h3>
              <p className="text-muted-foreground">
                Then this is your chance to be the change! Choose any plan and help create better educational
                experiences for future students. 🌟
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Honor Your Teachers?</h3>
          <p className="text-muted-foreground mb-6">
            Choose a plan that makes you feel good about using AI for education. Because gratitude is the best currency!
            💝
          </p>
          <Link href="/lesson-planning">
          <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90">
            <Heart className="mr-2 h-4 w-4" />
            Start Your Journey
          </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
