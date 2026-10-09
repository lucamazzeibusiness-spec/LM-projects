import { Check, Sparkles, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

export interface LernmodusPaar {
  id: string
  begriff: string
  definition: string
}

interface LernmodusProps {
  paare: LernmodusPaar[]
  onKarteGemeistert: (id: string) => void
  onAbschluss: (ersteVersucheRichtig: number, gesamt: number, fehler: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const kopie = [...arr]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

export default function Lernmodus({ paare, onKarteGemeistert, onAbschluss }: LernmodusProps) {
  const [warteschlange, setWarteschlange] = useState(() => shuffle(paare))
  const [optionen, setOptionen] = useState<string[]>([])
  const [ausgewaehlt, setAusgewaehlt] = useState<string | null>(null)
  const [falscheKarten, setFalscheKarten] = useState<Set<string>>(new Set())
  const [ersteVersucheRichtig, setErsteVersucheRichtig] = useState(0)
  const [fehler, setFehler] = useState(0)

  const aktuell = warteschlange[0]

  useEffect(() => {
    if (!aktuell) return
    const andere = paare.filter((p) => p.id !== aktuell.id).map((p) => p.definition)
    const distraktoren = shuffle(andere).slice(0, 3)
    setOptionen(shuffle([aktuell.definition, ...distraktoren]))
    setAusgewaehlt(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktuell?.id])

  useEffect(() => {
    if (warteschlange.length === 0) onAbschluss(ersteVersucheRichtig, paare.length, fehler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warteschlange.length])

  const waehlen = (option: string) => {
    if (ausgewaehlt || !aktuell) return
    setAusgewaehlt(option)
    if (option === aktuell.definition) {
      if (!falscheKarten.has(aktuell.id)) {
        setErsteVersucheRichtig((r) => r + 1)
        onKarteGemeistert(aktuell.id)
      }
    } else {
      setFehler((f) => f + 1)
      setFalscheKarten((s) => new Set(s).add(aktuell.id))
    }
  }

  const weiter = () => {
    if (!aktuell) return
    const richtig = ausgewaehlt === aktuell.definition
    setWarteschlange((q) => {
      const [, ...rest] = q
      return richtig ? rest : [...rest, q[0]]
    })
  }

  if (!aktuell) {
    return (
      <View className="items-center gap-2 rounded-xl border border-db-green/30 bg-db-green/5 p-6">
        <Sparkles size={24} color="#1E8A3C" />
        <Text className="text-lg font-semibold text-db-navy dark:text-[#EEF1F4]">Runde gemeistert!</Text>
        <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">
          {ersteVersucheRichtig} von {paare.length} im ersten Versuch richtig
          {fehler > 0 ? ` · ${fehler} Fehlversuche` : ''}
        </Text>
      </View>
    )
  }

  const gemeistert = paare.length - warteschlange.length

  return (
    <View className="gap-3">
      <View className="gap-1.5">
        <View className="h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029]">
          <View className="h-full rounded-full bg-db-red" style={{ width: `${(gemeistert / paare.length) * 100}%` }} />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
            {gemeistert} von {paare.length} gemeistert
          </Text>
          {fehler > 0 && <Text className="text-xs text-db-red">{fehler} Fehlversuche</Text>}
        </View>
      </View>

      <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-5">
        <Text className="text-center text-base font-semibold text-db-navy dark:text-[#EEF1F4]">{aktuell.begriff}</Text>
      </View>

      <View className="gap-2">
        {optionen.map((option) => {
          const istRichtig = option === aktuell.definition
          const istAusgewaehlt = option === ausgewaehlt
          const zeigeFeedback = ausgewaehlt !== null
          return (
            <Pressable
              key={option}
              onPress={() => waehlen(option)}
              disabled={zeigeFeedback}
              className={`flex-row items-center justify-between gap-2 rounded-lg border px-4 py-3 ${
                zeigeFeedback && istRichtig
                  ? 'border-db-green bg-db-green/10'
                  : zeigeFeedback && istAusgewaehlt
                    ? 'border-db-red bg-db-red/10'
                    : 'border-db-gray-200 dark:border-[#2A323D]'
              }`}
            >
              <Text className="flex-1 text-sm text-db-navy dark:text-[#EEF1F4]">{option}</Text>
              {zeigeFeedback && istRichtig && <Check size={16} color="#1E8A3C" />}
              {zeigeFeedback && istAusgewaehlt && !istRichtig && <X size={16} color="#EC0016" />}
            </Pressable>
          )
        })}
      </View>

      {ausgewaehlt !== null && (
        <Pressable onPress={weiter} className="items-center rounded-full bg-db-red px-4 py-3">
          <Text className="text-sm font-semibold text-white">Weiter</Text>
        </Pressable>
      )}
    </View>
  )
}
