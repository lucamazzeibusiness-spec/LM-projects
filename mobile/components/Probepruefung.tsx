import { Check, Clock, GraduationCap, RotateCcw, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { Lernkarte } from '../data/mock'
import { formatZeit } from '../lib/zeit'

const FRAGEN_PRO_PRUEFUNG = 15
// Wie bei der IHK: bestanden ab 50 Prozent.
const BESTEHENSGRENZE = 50

interface Frage {
  karte: Lernkarte
  optionen: string[]
}

interface ProbepruefungProps {
  // Bereits gefilterte, für Multiple Choice geeignete Karten.
  pool: Lernkarte[]
  onKarteBeantwortet: (id: string, richtig: boolean) => void
  onAbgeschlossen: (richtig: number, gesamt: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const kopie = [...arr]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j], kopie[i]]
  }
  return kopie
}

// Falsche Antwortoptionen bevorzugt aus demselben Themenbereich – sonst wäre die richtige
// Antwort oft schon am Thema zu erkennen.
function fragenErstellen(pool: Lernkarte[]): Frage[] {
  return shuffle(pool)
    .slice(0, FRAGEN_PRO_PRUEFUNG)
    .map((karte) => {
      const andere = pool.filter((k) => k.id !== karte.id && k.antwort !== karte.antwort)
      const gleichesThema = shuffle(andere.filter((k) => k.themenbereich === karte.themenbereich))
      const rest = shuffle(andere.filter((k) => k.themenbereich !== karte.themenbereich))
      const distraktoren = [...gleichesThema, ...rest].slice(0, 3).map((k) => k.antwort)
      return { karte, optionen: shuffle([karte.antwort, ...distraktoren]) }
    })
}

const karteStil = 'rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'
const navy = 'text-db-navy dark:text-[#EEF1F4]'
const grau = 'text-db-navy-light dark:text-[#9AA4B0]'

export default function Probepruefung({ pool, onKarteBeantwortet, onAbgeschlossen }: ProbepruefungProps) {
  const [fragen, setFragen] = useState<Frage[] | null>(null)
  const [antworten, setAntworten] = useState<string[]>([])
  const [auswahl, setAuswahl] = useState<string | null>(null)
  const [start, setStart] = useState(0)
  const [jetzt, setJetzt] = useState(0)
  const [dauer, setDauer] = useState<number | null>(null)

  const laeuft = fragen !== null && dauer === null

  useEffect(() => {
    if (!laeuft) return
    const t = setInterval(() => setJetzt(Date.now()), 1000)
    return () => clearInterval(t)
  }, [laeuft])

  const starten = () => {
    setFragen(fragenErstellen(pool))
    setAntworten([])
    setAuswahl(null)
    setDauer(null)
    const t = Date.now()
    setStart(t)
    setJetzt(t)
  }

  if (pool.length < 4) {
    return (
      <View className={`${karteStil} p-6`}>
        <Text className={`text-center text-sm ${grau}`}>Zu wenige Karten für diesen Filter (mind. 4 nötig).</Text>
      </View>
    )
  }

  if (!fragen) {
    const anzahl = Math.min(FRAGEN_PRO_PRUEFUNG, pool.length)
    return (
      <View className={`${karteStil} items-center gap-3 p-6`}>
        <GraduationCap size={28} color="#EC0016" />
        <Text className={`text-lg font-semibold ${navy}`}>Probeprüfung</Text>
        <Text className={`text-center text-sm ${grau}`}>
          {anzahl} Fragen aus deinem aktuellen Filter, Multiple Choice, mit Zeitmessung. Erst am Ende siehst du, was richtig
          war. Bestanden ab {BESTEHENSGRENZE} %.
        </Text>
        <Pressable onPress={starten} className="rounded-full bg-db-red px-6 py-2.5">
          <Text className="text-sm font-semibold text-white">Prüfung starten</Text>
        </Pressable>
      </View>
    )
  }

  if (dauer !== null) {
    const ergebnisse = fragen.map((f, i) => ({ frage: f, antwort: antworten[i], richtig: antworten[i] === f.karte.antwort }))
    const richtig = ergebnisse.filter((e) => e.richtig).length
    const prozent = Math.round((richtig / fragen.length) * 100)
    const bestanden = prozent >= BESTEHENSGRENZE
    const themen = [...new Set(fragen.map((f) => f.karte.themenbereich))].map((thema) => {
      const liste = ergebnisse.filter((e) => e.frage.karte.themenbereich === thema)
      return { thema, richtig: liste.filter((e) => e.richtig).length, gesamt: liste.length }
    })
    const falsch = ergebnisse.filter((e) => !e.richtig)

    return (
      <View className="gap-3">
        <View
          className={`items-center gap-1 rounded-xl border p-5 ${bestanden ? 'border-db-green/30 bg-db-green/5' : 'border-db-red/30 bg-db-red/5'}`}
        >
          <Text className={`text-3xl font-bold ${bestanden ? 'text-db-green' : 'text-db-red'}`}>{prozent} %</Text>
          <Text className={`text-sm font-semibold ${navy}`}>{bestanden ? 'Bestanden' : 'Nicht bestanden'}</Text>
          <Text className={`text-xs ${grau}`}>
            {richtig} von {fragen.length} richtig · {formatZeit(dauer)}
          </Text>
        </View>

        <View className={`${karteStil} p-4`}>
          <Text className={`text-xs font-semibold ${grau}`}>Nach Themenbereich</Text>
          <View className="mt-2 gap-1.5">
            {themen.map((t) => (
              <View key={t.thema} className="flex-row items-center justify-between">
                <Text className={`text-sm ${navy}`}>{t.thema}</Text>
                <Text className={`text-sm ${t.richtig === t.gesamt ? 'text-db-green' : grau}`}>
                  {t.richtig}/{t.gesamt}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {falsch.length > 0 && (
          <View className="gap-2">
            <Text className={`text-xs font-semibold ${grau}`}>Das solltest du wiederholen</Text>
            {falsch.map((e) => (
              <View key={e.frage.karte.id} className={`${karteStil} p-4`}>
                <Text className={`text-sm font-medium ${navy}`}>{e.frage.karte.frage}</Text>
                <View className="mt-2 flex-row items-start gap-1.5">
                  <X size={13} color="#EC0016" />
                  <Text className="flex-1 text-xs text-db-red">{e.antwort}</Text>
                </View>
                <View className="mt-1 flex-row items-start gap-1.5">
                  <Check size={13} color="#1E8A3C" />
                  <Text className="flex-1 text-xs text-db-green">{e.frage.karte.antwort}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <Pressable onPress={starten} className="flex-row items-center justify-center gap-1.5 self-center rounded-full bg-db-red px-5 py-2.5">
          <RotateCcw size={15} color="#fff" />
          <Text className="text-sm font-semibold text-white">Neue Probeprüfung</Text>
        </Pressable>
      </View>
    )
  }

  const index = antworten.length
  const frage = fragen[index]

  const weiter = () => {
    if (auswahl === null) return
    const neu = [...antworten, auswahl]
    onKarteBeantwortet(frage.karte.id, auswahl === frage.karte.antwort)
    setAntworten(neu)
    setAuswahl(null)
    if (neu.length === fragen.length) {
      setDauer(Math.round((Date.now() - start) / 1000))
      onAbgeschlossen(
        neu.filter((a, i) => a === fragen[i].karte.antwort).length,
        fragen.length,
      )
    }
  }

  return (
    <View className="gap-3">
      <View className="gap-1.5">
        <View className="h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029]">
          <View className="h-full rounded-full bg-db-red" style={{ width: `${(index / fragen.length) * 100}%` }} />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className={`text-xs ${grau}`}>
            Frage {index + 1} von {fragen.length}
          </Text>
          <View className="flex-row items-center gap-1">
            <Clock size={12} color="#5C6670" />
            <Text className={`text-xs ${grau}`}>{formatZeit(Math.max(0, Math.round((jetzt - start) / 1000)))}</Text>
          </View>
        </View>
      </View>

      <View className={`${karteStil} p-5`}>
        <Text className={`text-xs font-medium ${grau}`}>{frage.karte.themenbereich}</Text>
        <Text className={`mt-1 text-base font-semibold ${navy}`}>{frage.karte.frage}</Text>
      </View>

      <View className="gap-2">
        {frage.optionen.map((option) => (
          <Pressable
            key={option}
            onPress={() => setAuswahl(option)}
            className={`rounded-lg border px-4 py-3 ${auswahl === option ? 'border-db-red bg-db-red/5' : 'border-db-gray-200 dark:border-[#2A323D]'}`}
          >
            <Text className={`text-sm ${navy}`}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={weiter}
        disabled={auswahl === null}
        className={`items-center rounded-full bg-db-red px-4 py-3 ${auswahl === null ? 'opacity-40' : ''}`}
      >
        <Text className="text-sm font-semibold text-white">{index + 1 === fragen.length ? 'Prüfung abgeben' : 'Weiter'}</Text>
      </Pressable>
    </View>
  )
}
