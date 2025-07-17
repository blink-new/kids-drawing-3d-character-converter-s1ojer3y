import { useState, useEffect } from 'react'
import { Sparkles, Palette, Wand2, Star } from 'lucide-react'

interface ProcessingStagesProps {
  progress: number
}

const stages = [
  { 
    id: 1, 
    message: "Reading your awesome drawing...", 
    range: [0, 25], 
    icon: Sparkles,
    color: "text-blue-500"
  },
  { 
    id: 2, 
    message: "Adding 3D magic...", 
    range: [25, 50], 
    icon: Wand2,
    color: "text-purple-500"
  },
  { 
    id: 3, 
    message: "Painting in game colors...", 
    range: [50, 75], 
    icon: Palette,
    color: "text-pink-500"
  },
  { 
    id: 4, 
    message: "Final touches...", 
    range: [75, 99], 
    icon: Star,
    color: "text-orange-500"
  },
  { 
    id: 5, 
    message: "Ta-da! Almost ready...", 
    range: [99, 100], 
    icon: Sparkles,
    color: "text-green-500"
  }
]

const funFacts = [
  "Did you know? The first video game was created in 1958!",
  "Fun fact: Video games can improve problem-solving skills!",
  "Amazing! Some games have over 100 million players worldwide!",
  "Cool! Video game artists create thousands of characters every year!",
  "Wow! The gaming industry is bigger than movies and music combined!"
]

export default function ProcessingStages({ progress }: ProcessingStagesProps) {
  const [currentFact, setCurrentFact] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const currentStage = stages.find(stage => 
    progress >= stage.range[0] && progress <= stage.range[1]
  ) || stages[0]

  const IconComponent = currentStage.icon

  return (
    <div className="text-center space-y-6">
      {/* Current stage */}
      <div className="flex items-center justify-center gap-3">
        <IconComponent className={`h-6 w-6 ${currentStage.color} animate-pulse`} />
        <p className="text-lg font-medium">{currentStage.message}</p>
      </div>
      
      {/* Progress indicator */}
      <div className="text-sm text-muted-foreground">
        {progress}% complete
      </div>
      
      {/* Fun facts */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground transition-all duration-500">
          {funFacts[currentFact]}
        </p>
      </div>
      
      {/* Animated sparkles */}
      <div className="flex justify-center gap-2 mt-4">
        <Sparkles className="h-4 w-4 text-purple-400 sparkle" style={{ animationDelay: '0s' }} />
        <Sparkles className="h-4 w-4 text-pink-400 sparkle" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="h-4 w-4 text-blue-400 sparkle" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  )
}