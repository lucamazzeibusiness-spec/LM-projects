import { CheckCircle2, Timer, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { formatZeit } from '../lib/zeit'

export interface ZuordnenPaar {
  id: string
  begriff: string
  definition: string
}

interface ZuordnenProps {
  paare: ZuordnenPaar[]
  onAbschluss: (sekunden: number, fehler: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const kopie = [...arr]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export default function Zuordnen({ paare, onAbschluss }: ZuordnenProps) {
  const [linksReihenfolge] = useState(() => shuffle(paare))
  const [rechtsReihenfolge] = useState(() => shuffle(paare))
  const [abgeglichen, setAbgeglichen] = useState<Set<string>>(new Set())
  const [ausgewaehltLinks, setAusgewaehltLinks] = useState<string | null>(null)
  const [ausgewaehltRechts, setAusgewaehltRechts] = useState<string | null>(null)
  const [fehlerFlash, setFehlerFlash] = useState(false)
  const [fehlerCount, setFehlerCount] = useState(0)
  const [sekunden, setSekunden] = useState(0)
  const [fertig, setFertig] = useState(false)

  useEffect(() => {
    if (fertig) return
    const intervall = setInterval(() => setSekunden((s) => s + 1), 1000)
    return () => clearInterval(intervall)
  }, [fertig])

  useEffect(() => {
    if (ausgewaehltLinks === null || ausgewaehltRechts === null) return

    if (ausgewaehltLinks === ausgewaehltRechts) {
      const id = ausgewaehltLinks
      setAusgewaehltLinks(null)
      setAusgewaehltRechts(null)
      setAbgeglichen((prev) => {
        const naechster = new Set(prev)
        naechster.add(id)
        if (naechster.size === paare.length) {
          setFertig(true)
        }
        return naechster
      })
    } else {
      setFehlerCount((f) => f + 1)
      setSekunden((s) => s + 3)
      setFehlerFlash(true)
      const timeout = setTimeout(() => {
        setFehlerFlash(false)
        setAusgewaehltLinks(null)
        setAusgewaehltRechts(null)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [ausgewaehltLinks, ausgewaehltRechts, paare.length])

  useEffect(() => {
    if (fertig) onAbschluss(sekunden, fehlerCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fertig])

  const waehlen = (seite: 'links' | 'rechts', id: string) => {
    if (abgeglichen.has(id) || fehlerFlash) return
    if (seite === 'links') setAusgewaehltLinks((cur) => (cur === id ? null : id))
    else setAusgewaehltRechts((cur) => (cur === id ? null : id))
  }

  if (fertig) {
    return (
      <View className="items-center rounded-xl border border-db-green/30 bg-db-green/5 p-6">
        <CheckCircle2 size={28} color="#1E8A3C" />
        <Text className="mt-2 text-lg font-semibold text-db-navy dark:text-[#EEF1F4]">Geschafft in {formatZeit(sekunden)}!</Text>
        <Text className="mt-1 text-sm text-db-navy-light dark:text-[#9AA4B0]">
          {fehlerCount === 0 ? 'Ohne Fehler – stark!' : `${fehlerCount} ${fehlerCount === 1 ? 'Fehler' : 'Fehler'} (je +3 Sek.)`}
        </Text>
      </View>
    )
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-4 py-2.5">
        <View className="flex-row items-center gap-1.5">
          <Timer size={15} color="#14181F" />
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">{formatZeit(sekunden)}</Text>
        </View>
        {fehlerCount > 0 && (
          <View className="flex-row items-center gap-1">
            <X size={13} color="#EC0016" />
            <Text className="text-xs font-medium text-db-red">
              {fehlerCount} {fehlerCount === 1 ? 'Fehler' : 'Fehler'}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1 gap-2">
          {linksReihenfolge.map((p) => {
            const erledigt = abgeglichen.has(p.id)
            const ausgewaehlt = ausgewaehltLinks === p.id
            const falsch = fehlerFlash && ausgewaehlt
            return (
              <Pressable
                key={p.id}
                onPress={() => waehlen('links', p.id)}
                disabled={erledigt}
                style={{ opacity: erledigt ? 0 : 1 }}
                className={`rounded-lg border px-3 py-2.5 ${
                  falsch
                    ? 'border-db-red bg-db-red/10'
                    : ausgewaehlt
                      ? 'border-db-red bg-db-red/5'
                      : 'border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'
                }`}
              >
                <Text
                  numberOfLines={4}
                  className={`text-xs font-medium ${
                    falsch || ausgewaehlt ? 'text-db-red-dark' : 'text-db-navy dark:text-[#EEF1F4]'
                  }`}
                >
                  {p.begriff}
                </Text>
              </Pressable>
            )
          })}
        </View>
        <View className="flex-1 gap-2">
          {rechtsReihenfolge.map((p) => {
            const erledigt = abgeglichen.has(p.id)
            const ausgewaehlt = ausgewaehltRechts === p.id
            const falsch = fehlerFlash && ausgewaehlt
            return (
              <Pressable
                key={p.id}
                onPress={() => waehlen('rechts', p.id)}
                disabled={erledigt}
                style={{ opacity: erledigt ? 0 : 1 }}
                className={`rounded-lg border px-3 py-2.5 ${
                  falsch
                    ? 'border-db-red bg-db-red/10'
                    : ausgewaehlt
                      ? 'border-db-red bg-db-red/5'
                      : 'border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'
                }`}
              >
                <Text
                  numberOfLines={4}
                  className={`text-xs font-medium ${
                    falsch || ausgewaehlt ? 'text-db-red-dark' : 'text-db-navy dark:text-[#EEF1F4]'
                  }`}
                >
                  {p.definition}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}
