import { Star, Zap, Shield, Sparkles } from 'lucide-react'

interface CharacterStatsProps {
  characterName: string
}

const characterTypes = ['Builder', 'Artist', 'Creator', 'Player', 'Painter']
const specialAbilities = [
  'Super Creativity',
  'Magic Drawing',
  'Color Master',
  'Shape Shifter',
  'Dream Weaver',
  'Art Wizard',
  'Game Hero',
  'Paint Splash',
  'Build Master',
  'Play Champion'
]

const creativityLevels = [
  'Imagination Rookie',
  'Creative Explorer',
  'Art Adventurer',
  'Dream Builder',
  'Master Creator'
]

export default function CharacterStats({ characterName }: CharacterStatsProps) {
  // Generate consistent "random" values based on character name
  const nameHash = characterName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  
  const characterType = characterTypes[nameHash % characterTypes.length]
  const specialAbility = specialAbilities[nameHash % specialAbilities.length]
  const creativityLevel = creativityLevels[nameHash % creativityLevels.length]
  const powerLevel = Math.max(3, (nameHash % 5) + 1) // 3-5 stars

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-2">
          Character Stats
        </h3>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="space-y-3">
        {/* Name */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
          <span className="font-bold text-purple-700 dark:text-purple-300">{characterName}</span>
        </div>
        
        {/* Power Level */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Power Level:</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < powerLevel 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300 dark:text-gray-600'
                }`} 
              />
            ))}
          </div>
        </div>
        
        {/* Special Ability */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Special Ability:</span>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-orange-600 dark:text-orange-400">{specialAbility}</span>
          </div>
        </div>
        
        {/* Character Type */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">{characterType}</span>
          </div>
        </div>
        
        {/* BorfLab Badge */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-300">BorfLab Badge:</span>
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span className="font-semibold text-pink-600 dark:text-pink-400">{creativityLevel}</span>
          </div>
        </div>
      </div>
      
      {/* BorfLab branding */}
      <div className="text-center pt-2 border-t border-purple-200 dark:border-purple-700">
        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
          ✨ Powered by BorfLab Magic ✨
        </p>
      </div>
    </div>
  )
}