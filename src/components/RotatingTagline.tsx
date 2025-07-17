import { useState, useEffect } from 'react'

const words = ['BUILD', 'DRAW', 'CREATE', 'PLAY', 'PAINT']
const colors = {
  BUILD: 'hsl(249 115 22)',   // Orange
  DRAW: 'hsl(59 130 246)',    // Blue
  CREATE: 'hsl(139 92 246)',  // Purple
  PLAY: 'hsl(16 185 129)',    // Green
  PAINT: 'hsl(236 72 153)'    // Pink
}

export default function RotatingTagline() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <h2 className="text-xl md:text-3xl font-bold text-center mb-6 text-white">
      Games that inspire people to{' '}
      <span 
        className="inline-block transition-all duration-500 transform text-white"
      >
        {words[currentIndex]}
      </span>
    </h2>
  )
}