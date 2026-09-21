import { useRef, useState } from 'react'

interface Props {
  onChange: (dataUrl: string | null) => void
}

export default function SignaturePad({ onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const zeichnend = useRef(false)
  const hatGezeichnet = useRef(false)
  const [leer, setLeer] = useState(true)

  const position = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    zeichnend.current = true
    const { x, y } = position(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const zeichnen = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!zeichnend.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = position(e)
    ctx.strokeStyle = '#14181f'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
    hatGezeichnet.current = true
    setLeer(false)
  }

  const ende = () => {
    if (!zeichnend.current) return
    zeichnend.current = false
    onChange(hatGezeichnet.current ? canvasRef.current!.toDataURL('image/png') : null)
  }

  const loeschen = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hatGezeichnet.current = false
    setLeer(true)
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          onPointerDown={start}
          onPointerMove={zeichnen}
          onPointerUp={ende}
          onPointerLeave={ende}
          className="w-full touch-none rounded-lg border border-db-gray-200 bg-white"
          style={{ aspectRatio: '600 / 160' }}
        />
        {leer && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-db-gray-400">
            Hier mit Finger/Maus unterschreiben
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={loeschen}
        className="text-xs font-medium text-db-navy-light hover:text-db-red"
      >
        Löschen
      </button>
    </div>
  )
}
