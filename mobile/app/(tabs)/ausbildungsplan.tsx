import { ExternalLink, Pencil, Plus, X } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { useAusbildungsplan } from '../../hooks/useAusbildungsplan'
import { aktuelleWochentage, heutigerWochentagIndex } from '../../lib/wochen'
import { curricula, naechstePruefung, type Ausbildungsblock, type AusbildungsblockTyp, type LernfeldStatus } from '../../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 text-blue-700',
  Berufsschule: 'bg-purple-50 text-purple-700',
  'DB Training': 'bg-orange-50 text-orange-700',
}

const typIconColor: Record<AusbildungsblockTyp, string> = {
  Betrieb: '#1d4ed8',
  Berufsschule: '#7e22ce',
  'DB Training': '#c2410c',
}

const typen: AusbildungsblockTyp[] = ['Betrieb', 'Berufsschule', 'DB Training']

const lernfeldStyle: Record<LernfeldStatus, string> = {
  Abgeschlossen: 'bg-db-green/10 text-db-green',
  Aktuell: 'bg-db-red/10 text-db-red',
  Geplant: 'bg-db-gray-100 text-db-navy-light',
}

interface Entwurf {
  typ: AusbildungsblockTyp | 'Frei'
  thema: string
  ort: string
}

function entwurfAus(eintrag: Ausbildungsblock | null): Entwurf {
  return eintrag ? { ...eintrag } : { typ: 'Betrieb', thema: '', ort: '' }
}

export default function Ausbildungsplan() {
  const { profil } = useAzubiProfil()
  const { vorlage, tagSetzen } = useAusbildungsplan()
  const wochentage = aktuelleWochentage()
  const heuteIndex = heutigerWochentagIndex()

  const [bearbeitungsIndex, setBearbeitungsIndex] = useState<number | null>(null)
  const [entwurf, setEntwurf] = useState<Entwurf>({ typ: 'Betrieb', thema: '', ort: '' })

  if (!profil) return null
  const curriculum = curricula.find((c) => c.beruf === profil.ausbildungsberuf)

  const bearbeiten = (index: number) => {
    setEntwurf(entwurfAus(vorlage[index]))
    setBearbeitungsIndex(index)
  }

  const speichern = () => {
    if (bearbeitungsIndex === null) return
    if (entwurf.typ === 'Frei') {
      tagSetzen(bearbeitungsIndex, null)
    } else {
      tagSetzen(bearbeitungsIndex, { typ: entwurf.typ, thema: entwurf.thema, ort: entwurf.ort })
    }
    setBearbeitungsIndex(null)
  }

  return (
    <ScrollView className="flex-1 bg-db-gray-50" contentContainerClassName="gap-4 p-4">
      <View>
        <Text className="text-xl font-semibold text-db-navy">Ausbildungsplan</Text>
        <Text className="text-sm text-db-navy-light">
          Dein eigener Rhythmus · trag hier ein, wann Betrieb, Berufsschule oder DB Training ist
        </Text>
      </View>

      <View className="rounded-xl border border-db-navy/10 bg-db-navy p-4">
        <Text className="text-xs font-medium text-white/60">Nächster Prüfungstermin</Text>
        <Text className="mt-1 text-lg font-semibold text-white">{naechstePruefung.titel}</Text>
        <Text className="text-sm text-white/70">
          {naechstePruefung.datum} · noch {naechstePruefung.tageVerbleibend} Tage
        </Text>
      </View>

      <View className="overflow-hidden rounded-xl border border-db-gray-200 bg-white">
        <View className="divide-y divide-db-gray-100">
          {wochentage.map(({ tag, datum }, i) => {
            const eintrag = vorlage[i]
            const wirdBearbeitet = bearbeitungsIndex === i

            return (
              <View key={tag} className={i === heuteIndex ? 'bg-db-red/5' : ''}>
                {wirdBearbeitet ? (
                  <View className="gap-2.5 px-4 py-3">
                    <View className="flex-row items-center justify-between">
                      <Text className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy'}`}>
                        {tag}, {datum}
                      </Text>
                      <Pressable onPress={() => setBearbeitungsIndex(null)}>
                        <X size={16} color="#5C6670" />
                      </Pressable>
                    </View>
                    <View className="flex-row flex-wrap gap-1.5">
                      {[...typen, 'Frei' as const].map((t) => (
                        <Pressable
                          key={t}
                          onPress={() => setEntwurf((d) => ({ ...d, typ: t }))}
                          className={`rounded-full border px-2.5 py-1 ${
                            entwurf.typ === t ? 'border-db-navy bg-db-navy' : 'border-db-gray-200 bg-white'
                          }`}
                        >
                          <Text className={`text-xs font-medium ${entwurf.typ === t ? 'text-white' : 'text-db-navy-light'}`}>
                            {t}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    {entwurf.typ !== 'Frei' && (
                      <>
                        <TextInput
                          value={entwurf.thema}
                          onChangeText={(t) => setEntwurf((d) => ({ ...d, thema: t }))}
                          placeholder="z. B. Fahrzeuginstandhaltung – Elektrik / Lernfeld 6"
                          className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy"
                        />
                        <TextInput
                          value={entwurf.ort}
                          onChangeText={(t) => setEntwurf((d) => ({ ...d, ort: t }))}
                          placeholder="Ort, z. B. Werk Rummelsburg"
                          className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy"
                        />
                      </>
                    )}
                    <Pressable onPress={speichern} className="items-center rounded-full bg-db-red px-4 py-2">
                      <Text className="text-sm font-semibold text-white">Speichern</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={() => bearbeiten(i)} className="flex-row items-center gap-3 px-4 py-3">
                    <View className="w-20 shrink-0">
                      <Text className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy'}`}>{tag}</Text>
                      <Text className="text-xs text-db-navy-light">{datum}</Text>
                    </View>
                    <View className="min-w-0 flex-1">
                      {eintrag ? (
                        <>
                          <Text className="text-sm text-db-navy" numberOfLines={1}>
                            {eintrag.thema || eintrag.typ}
                          </Text>
                          {eintrag.ort && <Text className="text-xs text-db-navy-light">{eintrag.ort}</Text>}
                        </>
                      ) : (
                        <Text className="text-sm italic text-db-navy-light">Frei / kein Eintrag</Text>
                      )}
                    </View>
                    {eintrag ? (
                      <View className={`shrink-0 flex-row items-center gap-1 overflow-hidden rounded-full px-2.5 py-1 ${typStyle[eintrag.typ]}`}>
                        <Pencil size={11} color={typIconColor[eintrag.typ]} />
                        <Text className={`text-xs font-medium ${typStyle[eintrag.typ]}`}>{eintrag.typ}</Text>
                      </View>
                    ) : (
                      <View className="shrink-0 flex-row items-center gap-1 rounded-full border border-dashed border-db-gray-200 px-2.5 py-1">
                        <Plus size={11} color="#5C6670" />
                        <Text className="text-xs font-medium text-db-navy-light">Eintragen</Text>
                      </View>
                    )}
                  </Pressable>
                )}
              </View>
            )
          })}
        </View>
      </View>

      {curriculum && (
        <>
          <View className="rounded-xl border border-db-gray-200 bg-white p-4">
            <Text className="text-sm font-semibold text-db-navy">Lernfelder · {curriculum.beruf}</Text>
            <Text className="mt-1 text-xs text-db-navy-light">
              Rahmenlehrplan der Berufsschule – zeigt, wo du im Vergleich zum Lehrplan stehst.
            </Text>
            <View className="mt-3 gap-2">
              {curriculum.lernfelder.map((lf) => (
                <View
                  key={lf.nummer}
                  className="flex-row items-center justify-between gap-3 rounded-lg border border-db-gray-200 px-3 py-2.5"
                >
                  <View className="flex-1">
                    <Text className="text-sm text-db-navy">
                      <Text className="text-xs text-db-navy-light">LF{lf.nummer} </Text>
                      {lf.titel}
                    </Text>
                    <Text className="text-xs text-db-navy-light">
                      {lf.ausbildungsjahr}. Ausbildungsjahr · {lf.stunden} Std.
                    </Text>
                  </View>
                  <Text className={`shrink-0 overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${lernfeldStyle[lf.status]}`}>
                    {lf.status}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-xl border border-db-gray-200 bg-white p-4">
            <Text className="text-sm font-semibold text-db-navy">Abschlussprüfung (gestreckt)</Text>
            <View className="mt-3 gap-3">
              {[curriculum.teil1, curriculum.teil2].map((teil) => (
                <View key={teil.bezeichnung} className="rounded-lg bg-db-gray-50 p-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-db-navy">{teil.bezeichnung}</Text>
                    <Text className="text-xs font-semibold text-db-red">{teil.gewichtungGesamt}</Text>
                  </View>
                  <Text className="text-xs text-db-navy-light">{teil.zeitpunkt}</Text>
                  <View className="mt-2 gap-1">
                    {teil.bereiche.map((b) => (
                      <View key={b.name} className="flex-row items-center justify-between">
                        <Text className="text-xs text-db-navy">{b.name}</Text>
                        <Text className="text-xs text-db-navy-light">
                          {b.gewichtung}
                          {b.dauer ? ` · ${b.dauer}` : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
            <View className="mt-3 flex-row items-start gap-1.5">
              <ExternalLink size={12} color="#5C6670" style={{ marginTop: 2 }} />
              <Text className="flex-1 text-xs text-db-navy-light">
                Quelle: {curriculum.quelle}. Öffentlich zugängliche IHK-/KMK-Angaben – die verbindliche Fassung gilt
                laut deinem Ausbildungsvertrag und deiner IHK.
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  )
}
