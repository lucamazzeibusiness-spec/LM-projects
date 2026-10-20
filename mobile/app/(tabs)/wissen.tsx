import { AlertCircle, AlertTriangle, Search, Star, TrainFront, Wrench } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'
import { Pressable } from 'react-native'
import { GewerkBadge } from '../../components/Badges'
import DBFaktenQuiz from '../../components/DBFaktenQuiz'
import LernkartenQuiz from '../../components/LernkartenQuiz'
import RangKarte from '../../components/RangKarte'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { bauteile, baureihen, baureihenText, fahrzeugarten, fehlerfaelle, passtZuBaureihen } from '../../data/fahrzeuge'
import type { Gewerk } from '../../data/mock'

const gewerke: (Gewerk | 'Alle')[] = ['Alle', 'Elektrik', 'Mechanik', 'Mechatronik']
type Tab = 'fehlerdiagnose' | 'bauteile' | 'fahrzeuge' | 'dbfakten' | 'pruefung'

const tabs: [Tab, string][] = [
  ['fehlerdiagnose', 'Fehlerdiagnose'],
  ['bauteile', 'Bauteil-Lexikon'],
  ['fahrzeuge', 'Fahrzeuge'],
  ['dbfakten', 'DB-Fakten'],
  ['pruefung', 'Prüfungstraining'],
]

const schwierigkeitStyle: Record<string, string> = {
  Grundlagen: 'bg-db-green/10 text-db-green',
  Fortgeschritten: 'bg-db-amber/10 text-db-amber',
}

// 'meine' = die im Profil markierten Baureihen, 'alle' = kein Filter, sonst eine Baureihen-ID.
type BaureihenAuswahl = 'meine' | 'alle' | string

const leer = 'rounded-xl border border-dashed border-db-gray-200 dark:border-[#2A323D] p-6 text-center text-sm text-db-navy-light dark:text-[#9AA4B0]'
const karte = 'rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4'

function Chip({ aktiv, label, onPress }: { aktiv: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-1.5 ${aktiv ? 'border-db-red bg-db-red' : 'border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'}`}
    >
      <Text className={`text-xs font-medium ${aktiv ? 'text-white' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>{label}</Text>
    </Pressable>
  )
}

export default function Wissen() {
  const { profil, profilSpeichern } = useAzubiProfil()
  const meineBaureihen = profil?.baureihen ?? []
  const [tab, setTab] = useState<Tab>('fehlerdiagnose')
  const [query, setQuery] = useState('')
  const [gewerk, setGewerk] = useState<Gewerk | 'Alle'>('Alle')
  const [auswahl, setAuswahl] = useState<BaureihenAuswahl>(() => (meineBaureihen.length > 0 ? 'meine' : 'alle'))

  const gespeicherteBaureihen = profil?.baureihen
  const baureihenFilter = useMemo<string[] | null>(() => {
    if (auswahl === 'alle') return null
    if (auswahl === 'meine') return gespeicherteBaureihen && gespeicherteBaureihen.length > 0 ? gespeicherteBaureihen : null
    return [auswahl]
  }, [auswahl, gespeicherteBaureihen])

  const fehler = useMemo(() => {
    const q = query.trim().toLowerCase()
    return fehlerfaelle.filter((f) => {
      const matchesGewerk = gewerk === 'Alle' || f.gewerk === gewerk
      const matchesQuery =
        q === '' ||
        f.titel.toLowerCase().includes(q) ||
        f.ursache.toLowerCase().includes(q) ||
        baureihenText(f.baureihen, 99).toLowerCase().includes(q) ||
        f.symptome.some((s) => s.toLowerCase().includes(q))
      return matchesGewerk && matchesQuery && passtZuBaureihen(f.baureihen, baureihenFilter)
    })
  }, [query, gewerk, baureihenFilter])

  const teile = useMemo(() => {
    const q = query.trim().toLowerCase()
    return bauteile.filter((b) => {
      const matchesGewerk = gewerk === 'Alle' || b.kategorie === gewerk
      const matchesQuery = q === '' || b.name.toLowerCase().includes(q) || b.funktion.toLowerCase().includes(q)
      return matchesGewerk && matchesQuery && passtZuBaureihen(b.baureihen, baureihenFilter)
    })
  }, [query, gewerk, baureihenFilter])

  const fahrzeuge = useMemo(() => {
    const q = query.trim().toLowerCase()
    return baureihen.filter(
      (b) =>
        q === '' ||
        b.name.toLowerCase().includes(q) ||
        (b.spitzname ?? '').toLowerCase().includes(q) ||
        b.einsatz.toLowerCase().includes(q) ||
        b.hersteller.toLowerCase().includes(q),
    )
  }, [query])

  const meineUmschalten = (id: string) => {
    if (!profil) return
    const neu = meineBaureihen.includes(id) ? meineBaureihen.filter((x) => x !== id) : [...meineBaureihen, id]
    profilSpeichern({ ...profil, baureihen: neu })
    if (meineBaureihen.length === 0 && neu.length > 0) setAuswahl('meine')
    if (auswahl === 'meine' && neu.length === 0) setAuswahl('alle')
  }

  const fehlerfaelleZeigen = (id: string) => {
    setAuswahl(id)
    setGewerk('Alle')
    setQuery('')
    setTab('fehlerdiagnose')
  }

  const mitFilter = tab === 'fehlerdiagnose' || tab === 'bauteile'

  return (
    <ScrollView className="flex-1 bg-db-gray-50 dark:bg-[#10141B]" contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
      <View>
        <Text className="text-xl font-semibold text-db-navy dark:text-[#EEF1F4]">Wissen</Text>
        <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">Nachschlagen und verstehen – nicht nur auswendig lernen</Text>
      </View>

      <RangKarte kompakt />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1 rounded-full bg-db-gray-100 dark:bg-[#1A2029] p-1 pr-2">
        {tabs.map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            className={`items-center rounded-full px-3 py-2 ${tab === key ? 'bg-white dark:bg-[#171C24]' : ''}`}
          >
            <Text className={`text-sm font-semibold ${tab === key ? 'text-db-navy dark:text-[#EEF1F4]' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {tab === 'pruefung' && <LernkartenQuiz />}
      {tab === 'dbfakten' && <DBFaktenQuiz />}

      {(mitFilter || tab === 'fahrzeuge') && (
        <View className="relative justify-center">
          <Search size={16} color="#5C6670" style={{ position: 'absolute', left: 12, zIndex: 1 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={
              tab === 'fehlerdiagnose'
                ? 'z. B. Stromabnehmer, Tür, PZB, BR 412...'
                : tab === 'bauteile'
                  ? 'z. B. Radsatz, Hauptschalter, Bremse...'
                  : 'z. B. 193, Vectron, ICE 4, S-Bahn...'
            }
            className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] py-2.5 pl-9 pr-3 text-sm text-db-navy dark:text-[#EEF1F4]"
          />
        </View>
      )}

      {mitFilter && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-2">
            {meineBaureihen.length > 0 && (
              <Chip aktiv={auswahl === 'meine'} label={`Meine Baureihen (${meineBaureihen.length})`} onPress={() => setAuswahl('meine')} />
            )}
            <Chip aktiv={auswahl === 'alle'} label="Alle Baureihen" onPress={() => setAuswahl('alle')} />
            {baureihen.map((b) => (
              <Chip key={b.id} aktiv={auswahl === b.id} label={b.name} onPress={() => setAuswahl(b.id)} />
            ))}
          </ScrollView>
          {meineBaureihen.length === 0 && (
            <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
              Tipp: Markier im Tab Fahrzeuge mit ☆ die Baureihen, an denen du arbeitest – dann zeigt die App dir zuerst die
              passenden Fälle und Bauteile.
            </Text>
          )}

          <View className="flex-row flex-wrap gap-2">
            {gewerke.map((g) => (
              <Chip key={g} aktiv={gewerk === g} label={g} onPress={() => setGewerk(g)} />
            ))}
          </View>

          <Text className="text-[11px] text-db-navy-light dark:text-[#9AA4B0]">
            Lernbeispiele zum Verstehen – maßgeblich sind immer die Instandhaltungsunterlagen und Vorgaben deines Werks.
          </Text>
        </>
      )}

      {tab === 'fehlerdiagnose' && (
        <View className="gap-3">
          {fehler.map((f) => (
            <View key={f.id} className={karte}>
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 flex-row items-start gap-2">
                  <AlertCircle size={16} color="#EC0016" />
                  <Text className="flex-1 text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">{f.titel}</Text>
                </View>
                <View className="items-end gap-1.5">
                  <GewerkBadge gewerk={f.gewerk} />
                  <Text className={`overflow-hidden rounded-full px-2 py-0.5 text-[11px] font-medium ${schwierigkeitStyle[f.schwierigkeit]}`}>
                    {f.schwierigkeit}
                  </Text>
                </View>
              </View>
              <Text className="mt-1 text-xs text-db-navy-light dark:text-[#9AA4B0]">
                {baureihenText(f.baureihen)} · {f.haeufigkeit}
              </Text>

              <View className="mt-3">
                <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Symptome</Text>
                <Text className="text-sm text-db-navy dark:text-[#EEF1F4]">{f.symptome.join(' · ')}</Text>
              </View>
              <View className="mt-2">
                <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Wahrscheinliche Ursache</Text>
                <Text className="text-sm text-db-navy dark:text-[#EEF1F4]">{f.ursache}</Text>
              </View>
              <View className="mt-3 rounded-lg bg-db-gray-50 dark:bg-[#10141B] p-3">
                <View className="mb-1.5 flex-row items-center gap-1.5">
                  <Wrench size={13} color="#5C6670" />
                  <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Vorgehen</Text>
                </View>
                {f.loesung.map((step, i) => (
                  <Text key={i} className="text-sm text-db-navy dark:text-[#EEF1F4]">
                    {i + 1}. {step}
                  </Text>
                ))}
              </View>
              <Text className="mt-3 rounded-lg border border-db-red/20 bg-db-red/5 p-2.5 text-xs text-db-red-dark">💡 {f.merksatz}</Text>
            </View>
          ))}
          {fehler.length === 0 && <Text className={leer}>Keine Treffer. Suchbegriff, Baureihe oder Filter anpassen.</Text>}
        </View>
      )}

      {tab === 'bauteile' && (
        <View className="gap-3">
          {teile.map((b) => (
            <View key={b.id} className={karte}>
              <View className="flex-row items-start justify-between gap-3">
                <Text className="flex-1 text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">{b.name}</Text>
                <GewerkBadge gewerk={b.kategorie} />
              </View>
              <Text className="mt-1 text-xs text-db-navy-light dark:text-[#9AA4B0]">{baureihenText(b.baureihen)}</Text>
              <Text className="mt-2 text-sm text-db-navy dark:text-[#EEF1F4]">{b.funktion}</Text>
              <View className="mt-3 rounded-lg bg-db-gray-50 dark:bg-[#10141B] p-3">
                <View className="mb-1.5 flex-row items-center gap-1.5">
                  <Wrench size={13} color="#5C6670" />
                  <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Typische Prüfungen</Text>
                </View>
                {b.pruefung.map((p, i) => (
                  <Text key={i} className="text-sm text-db-navy dark:text-[#EEF1F4]">
                    • {p}
                  </Text>
                ))}
              </View>
              {b.sicherheit && (
                <View className="mt-3 flex-row items-start gap-1.5 rounded-lg border border-db-amber/30 bg-db-amber/5 p-2.5">
                  <AlertTriangle size={13} color="#D98600" />
                  <Text className="flex-1 text-xs text-db-navy dark:text-[#EEF1F4]">{b.sicherheit}</Text>
                </View>
              )}
            </View>
          ))}
          {teile.length === 0 && <Text className={leer}>Keine Treffer. Suchbegriff, Baureihe oder Filter anpassen.</Text>}
        </View>
      )}

      {tab === 'fahrzeuge' && (
        <View className="gap-5">
          <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
            Echte Baureihen der Deutschen Bahn. Markier mit ☆ die, an denen du arbeitest – Fehlerdiagnose und Bauteil-Lexikon
            zeigen dir dann zuerst die passenden Einträge.
          </Text>
          {fahrzeugarten.map((art) => {
            const liste = fahrzeuge.filter((b) => b.art === art)
            if (liste.length === 0) return null
            return (
              <View key={art} className="gap-2">
                <Text className="text-xs font-semibold uppercase tracking-wide text-db-navy-light dark:text-[#9AA4B0]">{art}</Text>
                {liste.map((b) => {
                  const meine = meineBaureihen.includes(b.id)
                  const anzahlFaelle = fehlerfaelle.filter((f) => f.baureihen.includes(b.id)).length
                  return (
                    <View key={b.id} className={karte}>
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1 flex-row items-start gap-2">
                          <TrainFront size={16} color="#EC0016" />
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">
                              {b.name}
                              {b.spitzname && <Text className="font-normal text-db-navy-light dark:text-[#9AA4B0]"> · {b.spitzname}</Text>}
                            </Text>
                            <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">{b.einsatz}</Text>
                          </View>
                        </View>
                        <Pressable
                          onPress={() => meineUmschalten(b.id)}
                          hitSlop={8}
                          accessibilityLabel={meine ? 'Aus meinen Baureihen entfernen' : 'Zu meinen Baureihen hinzufügen'}
                        >
                          <Star size={20} color={meine ? '#D98600' : '#5C6670'} fill={meine ? '#D98600' : 'none'} />
                        </Pressable>
                      </View>
                      <View className="mt-3 gap-1">
                        <Zeile label="Höchstgeschwindigkeit" wert={`${b.vmax} km/h`} />
                        {b.leistung && <Zeile label="Leistung" wert={b.leistung} />}
                        <Zeile label="Gebaut" wert={b.baujahre} />
                        <Zeile label="Hersteller" wert={b.hersteller} />
                      </View>
                      {b.hinweis && <Text className="mt-2 text-xs text-db-navy dark:text-[#EEF1F4]">{b.hinweis}</Text>}
                      {anzahlFaelle > 0 && (
                        <Pressable onPress={() => fehlerfaelleZeigen(b.id)} className="mt-3">
                          <Text className="text-xs font-semibold text-db-red">{anzahlFaelle} typische Fehlerfälle ansehen →</Text>
                        </Pressable>
                      )}
                    </View>
                  )
                })}
              </View>
            )
          })}
          {fahrzeuge.length === 0 && <Text className={leer}>Keine Baureihe gefunden.</Text>}
        </View>
      )}
    </ScrollView>
  )
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <View className="flex-row gap-3">
      <Text className="w-1/2 text-xs text-db-navy-light dark:text-[#9AA4B0]">{label}</Text>
      <Text className="flex-1 text-xs text-db-navy dark:text-[#EEF1F4]">{wert}</Text>
    </View>
  )
}
