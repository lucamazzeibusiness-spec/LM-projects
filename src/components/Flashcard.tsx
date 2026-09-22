import { type ReactNode, useState } from 'react'

interface FlashcardProps {
  front: ReactNode
  back: ReactNode
  onFlipChange?: (showingBack: boolean) => void
}

export default function Flashcard({ front, back, onFlipChange }: FlashcardProps) {
  const [angle, setAngle] = useState(0)
  const [transition, setTransition] = useState(true)
  const [showingBack, setShowingBack] = useState(false)

  const flip = () => {
    setTransition(true)
    setAngle(90)
    window.setTimeout(() => {
      setTransition(false)
      setAngle(-90)
      setShowingBack((b) => {
        const next = !b
        onFlipChange?.(next)
        return next
      })
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true)
          setAngle(0)
        })
      })
    }, 150)
  }

  return (
    <button type="button" onClick={flip} className="block w-full text-left [perspective:1200px]">
      <div
        style={{ transform: `rotateY(${angle}deg)`, transition: transition ? 'transform 150ms ease' : 'none' }}
        className="flex min-h-40 flex-col rounded-xl border border-db-gray-200 bg-db-surface p-5"
      >
        <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-db-navy md:text-base">
          {showingBack ? back : front}
        </p>
        <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-wide text-db-navy-light">
          Tippen zum Umdrehen
        </p>
      </div>
    </button>
  )
}
