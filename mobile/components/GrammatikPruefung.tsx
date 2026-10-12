import { Check, SpellCheck, X } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { textPruefen, vorschlagAnwenden, type GrammatikFund } from '../lib/grammatik'
import { hatEchtenInhalt } from '../lib/stichpunkte'

interface GrammatikPruefungProps {
  text: string
  onTextChange: (text: string) => void
}

export default function GrammatikPruefung({ text, onTextChange }: GrammatikPruefungProps) {
  const [funde, setFunde] = useState<GrammatikFund[] | null>(null)
  const [geprueft, setGeprueft] = useState<string | null>(null)
  const [laedt, setLaedt] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  // Tippt man nach der Prüfung weiter, passen die Positionen der Funde nicht mehr –
  // dann werden die Ergebnisse verworfen statt an der falschen Stelle zu korrigieren.
  const veraltet = geprueft !== null && geprueft !== text
  const sichtbareFunde = veraltet ? null : funde
  const deaktiviert = laedt || !hatEchtenInhalt(text)

  const pruefen = async () => {
    setLaedt(true)
    setFehler(null)
    try {
      setFunde(await textPruefen(text))
      setGeprueft(text)
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Die Prüfung hat gerade nicht geklappt.')
      setFunde(null)
    } finally {
      setLaedt(false)
    }
  }

  const anwenden = (fund: GrammatikFund, ersatz: string) => {
    if (!funde) return
    const ergebnis = vorschlagAnwenden(text, funde, fund, ersatz)
    setFunde(ergebnis.funde)
    setGeprueft(ergebnis.text)
    onTextChange(ergebnis.text)
  }

  const ignorieren = (fund: GrammatikFund) => setFunde((f) => f && f.filter((x) => x.id !== fund.id))

  return (
    <View className="gap-2">
      <Pressable
        onPress={pruefen}
        disabled={deaktiviert}
        className={`flex-row items-center gap-1.5 self-start rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-3 py-1.5 ${
          deaktiviert ? 'opacity-40' : ''
        }`}
      >
        {laedt ? <ActivityIndicator size="small" color="#5C6670" /> : <SpellCheck size={14} color="#5C6670" />}
        <Text className="text-xs font-semibold text-db-navy dark:text-[#EEF1F4]">Rechtschreibung &amp; Grammatik prüfen</Text>
      </Pressable>

      {fehler && <Text className="text-xs text-db-red">{fehler}</Text>}

      {sichtbareFunde && sichtbareFunde.length === 0 && (
        <View className="flex-row items-center gap-1.5">
          <Check size={14} color="#1E8A3C" />
          <Text className="text-xs font-medium text-db-green">Keine Fehler gefunden</Text>
        </View>
      )}

      {sichtbareFunde?.map((fund) => (
        <View key={fund.id} className="rounded-lg border border-db-amber/30 bg-db-amber/5 p-2.5">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="flex-1 text-xs text-db-navy dark:text-[#EEF1F4]">
              <Text className="font-semibold text-db-red line-through">{fund.fehlerText || '␣'}</Text>
              <Text className="text-db-navy-light dark:text-[#9AA4B0]"> – {fund.meldung}</Text>
            </Text>
            <Pressable onPress={() => ignorieren(fund)} accessibilityLabel="Ignorieren" hitSlop={8}>
              <X size={14} color="#5C6670" />
            </Pressable>
          </View>
          {fund.vorschlaege.length > 0 && (
            <View className="mt-1.5 flex-row flex-wrap gap-1.5">
              {fund.vorschlaege.map((v) => (
                <Pressable key={v} onPress={() => anwenden(fund, v)} className="rounded-full bg-db-green/10 px-2.5 py-1">
                  <Text className="text-xs font-semibold text-db-green">{v}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      ))}

      <Text className="text-[11px] text-db-navy-light dark:text-[#9AA4B0]">
        Prüfung über LanguageTool – der Text wird dafür kurz an languagetool.org gesendet.
      </Text>
    </View>
  )
}
