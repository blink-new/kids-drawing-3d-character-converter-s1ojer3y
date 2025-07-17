import { Gamepad2, Pencil, Paintbrush, Hammer, Sparkles } from 'lucide-react'

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating game controllers */}
      <Gamepad2 
        className="absolute top-20 left-10 w-8 h-8 text-green-400 opacity-20 float-animation" 
        style={{ animationDelay: '0s' }}
      />
      <Gamepad2 
        className="absolute top-40 right-20 w-6 h-6 text-green-400 opacity-15 float-animation" 
        style={{ animationDelay: '-3s' }}
      />
      
      {/* Floating pencils */}
      <Pencil 
        className="absolute top-32 left-1/4 w-7 h-7 text-blue-400 opacity-20 float-animation" 
        style={{ animationDelay: '-1s' }}
      />
      <Pencil 
        className="absolute bottom-40 right-1/3 w-5 h-5 text-blue-400 opacity-15 float-animation" 
        style={{ animationDelay: '-4s' }}
      />
      
      {/* Floating paint brushes */}
      <Paintbrush 
        className="absolute top-60 right-10 w-6 h-6 text-pink-400 opacity-20 float-animation" 
        style={{ animationDelay: '-2s' }}
      />
      <Paintbrush 
        className="absolute bottom-60 left-20 w-8 h-8 text-pink-400 opacity-15 float-animation" 
        style={{ animationDelay: '-5s' }}
      />
      
      {/* Floating building blocks */}
      <Hammer 
        className="absolute top-80 left-1/3 w-7 h-7 text-orange-400 opacity-20 float-animation" 
        style={{ animationDelay: '-1.5s' }}
      />
      <Hammer 
        className="absolute bottom-20 right-1/4 w-6 h-6 text-orange-400 opacity-15 float-animation" 
        style={{ animationDelay: '-3.5s' }}
      />
      
      {/* Floating sparkles */}
      <Sparkles 
        className="absolute top-16 right-1/3 w-5 h-5 text-purple-400 opacity-25 sparkle" 
        style={{ animationDelay: '0s' }}
      />
      <Sparkles 
        className="absolute bottom-32 left-1/2 w-4 h-4 text-purple-400 opacity-20 sparkle" 
        style={{ animationDelay: '-1s' }}
      />
      <Sparkles 
        className="absolute top-1/2 left-16 w-6 h-6 text-purple-400 opacity-15 sparkle" 
        style={{ animationDelay: '-2s' }}
      />
    </div>
  )
}