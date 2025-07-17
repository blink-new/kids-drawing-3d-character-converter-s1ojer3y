import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  left: number
  color: string
  delay: number
  size: number
}

export default function ConfettiEffect() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      'hsl(139 92 246)', // Purple
      'hsl(236 72 153)', // Pink
      'hsl(59 130 246)',  // Blue
      'hsl(16 185 129)',  // Green
      'hsl(249 115 22)',  // Orange
    ]

    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      size: Math.random() * 8 + 4
    }))

    setConfetti(pieces)

    // Clean up after animation
    const timer = setTimeout(() => {
      setConfetti([])
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-pulse"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${piece.delay}s`,
            animationDuration: '3s',
            animationName: 'confetti-fall',
            animationTimingFunction: 'linear',
            animationIterationCount: '1',
            animationFillMode: 'forwards'
          }}
        />
      ))}
    </div>
  )
}