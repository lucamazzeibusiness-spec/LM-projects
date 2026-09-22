import { ExternalLink, Pencil, Plus, X } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { useAusbildungsplan } from '../../hooks/useAusbildungsplan'
import { aktuelleWochentage, heutigerWochentagIndex } from '../../lib/wochen'
import { curricula, naechstePruefung, type Ausbildungsblock, type AusbildungsblockTyp, type LernfeldStatus } from '../../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',
  Berufsschule: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300',
  'DB Training': 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300',
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
  Geplant: 'bg-db-gray-100 dark:bg-[#1A2029] text-db-navy-light dark:text-[#9AA4B0]',
}

interface Entwurf {
  typ: AusbildungsblockTyp | 'Frei'
  thema: string
  ort: string
}

function entwurfAus(eintrag: Ausbildungsblock | null, standardOrt: string): Entwurf {
  return eintrag ? { ...eintrag } : { typ: 'Betrieb', thema: '', ort: standardOrt }
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
  const lernfeldVorschlaege = curriculum
    ? curriculum.lernfelder.filter((lf) => lf.ausbildungsjahr === profil.lehrjahr).length > 0
      ? curriculum.lernfelder.filter((lf) => lf.ausbildungsjahr === profil.lehrjahr)
      : curriculum.lernfelder
    : []

  const bearbeiten = (index: number) => {
    setEntwurf(entwurfAus(vorlage[index], profil.werk))
    setBearbeitungsIndex(index)
  }

  const eintragSpeichern = (index: number, wert: Entwurf) => {
    if (wert.typ === 'Frei') {
      tagSetzen(index, null)
    } else {
      tagSetzen(index, { typ: wert.typ, thema: wert.thema, ort: wert.ort })
    }
  }

  const speichern = () => {
    if (bearbeitungsIndex === null) return
    eintragSpeichern(bearbeitungsIndex, entwurf)
    setBearbeitungsIndex(null)
  }

  const freiWaehlen = () => {
    if (bearbeitungsIndex === null) return
    tagSetzen(bearbeitungsIndex, null)
    setBearbeitungsIndex(null)
  }

  const fuerGanzeWocheUebernehmen = () => {
    if (bearbeitungsIndex === null || entwurf.typ === 'Frei') return
    for (let i = 0; i < 5; i++) eintragSpeichern(i, entwurf)
    setBearbeitungsIndex(null)
  }

  return (
    <ScrollView className="flex-1 bg-db-gray-50 dark:bg-[#10141B]" contentContainerClassName="gap-4 p-4">
      <View>
        <Text className="text-xl font-semibold text-db-navy dark:text-[#EEF1F4]">Ausbildungsplan</Text>
        <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">
          Dein eigener Rhythmus · trag hier ein, wann Betrieb, Berufsschule oder DB Training ist
        </Text>
      </View>

      <View className="rounded-xl border border-white/10 bg-db-navy p-4 dark:bg-[#3A4453]">
        <Text className="text-xs font-medium text-white/60">Nächster Prüfungstermin</Text>
        <Text className="mt-1 text-lg font-semibold text-white">{naechstePruefung.titel}</Text>
        <Text className="text-sm text-white/70">
          {naechstePruefung.datum} · noch {naechstePruefung.tageVerbleibend} Tage
        </Text>
      </View>

      <View className="overflow-hidden rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]">
        <View className="divide-y divide-db-gray-100">
          {wochentage.map(({ tag, datum }, i) => {
            const eintrag = vorlage[i]
            const wirdBearbeitet = bearbeitungsIndex === i

            return (
              <View key={tag} className={i === heuteIndex ? 'bg-db-red/5' : ''}>
                {wirdBearbeitet ? (
                  <View className="gap-2.5 px-4 py-3">
                    <View className="flex-row items-center justify-between">
                      <Text className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy dark:text-[#EEF1F4]'}`}>
                        {tag}, {datum}
                      </Text>
                      <Pressable onPress={() => setBearbeitungsIndex(null)}>
                        <X size={16} color="#5C6670" />
                      </Pressable>
                    </View>
                    <View className="flex-row flex-wrap gap-1.5">
                      {typen.map((t) => (
                        <Pressable
                          key={t}
                          onPress={() => setEntwurf((d) => ({ ...d, typ: t }))}
                          className={`rounded-full border px-2.5 py-1 ${
                            entwurf.typ === t
                              ? 'border-db-navy bg-db-navy dark:border-[#3A4453] dark:bg-[#3A4453]'
                              : 'border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'
                          }`}
                        >
                          <Text className={`text-xs font-medium ${entwurf.typ === t ? 'text-white' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>
                            {t}
                          </Text>
                        </Pressable>
                      ))}
                      <Pressable
                        onPress={freiWaehlen}
                        className="rounded-full border border-dashed border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-2.5 py-1"
                      >
                        <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Frei</Text>
                      </Pressable>
                    </View>
                    {entwurf.typ !== 'Frei' && (
                      <>
                        <TextInput
                          value={entwurf.thema}
                          onChangeText={(t) => setEntwurf((d) => ({ ...d, thema: t }))}
                          placeholder="z. B. Fahrzeuginstandhaltung – Elektrik / Lernfeld 6"
                          className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2 text-sm text-db-navy dark:text-[#EEF1F4]"
                        />
                        {entwurf.typ === 'Berufsschule' && lernfeldVorschlaege.length > 0 && (
                          <View className="flex-row flex-wrap gap-1.5">
                            {lernfeldVorschlaege.map((lf) => (
                              <Pressable
                                key={lf.nummer}
                                onPress={() => setEntwurf((d) => ({ ...d, thema: `LF${lf.nummer} ${lf.titel}` }))}
                                className="max-w-full rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-db-gray-50 dark:bg-[#10141B] px-2.5 py-1"
                              >
                                <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]" numberOfLines={1}>
                                  LF{lf.nummer} {lf.titel}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        )}
                        <TextInput
                          value={entwurf.ort}
                          onChangeText={(t) => setEntwurf((d) => ({ ...d, ort: t }))}
                          placeholder="Ort, z. B. Werk Rummelsburg"
                          className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2 text-sm text-db-navy dark:text-[#EEF1F4]"
                        />
                      </>
                    )}
                    <View className="flex-row gap-2">
                      <Pressable onPress={speichern} className="flex-1 items-center rounded-full bg-db-red px-4 py-2">
                        <Text className="text-sm font-semibold text-white">Speichern</Text>
                      </Pressable>
                      {entwurf.typ !== 'Frei' && bearbeitungsIndex !== null && bearbeitungsIndex < 5 && (
                        <Pressable
                          onPress={fuerGanzeWocheUebernehmen}
                          className="flex-1 items-center rounded-full border border-db-gray-200 dark:border-[#2A323D] px-4 py-2"
                        >
                          <Text className="text-center text-xs font-semibold text-db-navy-light dark:text-[#9AA4B0]">
                            Für Mo–Fr übernehmen
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                ) : (
                  <Pressable onPress={() => bearbeiten(i)} className="flex-row items-center gap-3 px-4 py-3">
                    <View className="w-20 shrink-0">
                      <Text className={`text-sm font-semibold ${i === heuteIndex ? 'text-db-red' : 'text-db-navy dark:text-[#EEF1F4]'}`}>{tag}</Text>
                      <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">{datum}</Text>
                    </View>
                    <View className="min-w-0 flex-1">
                      {eintrag ? (
                        <>
                          <Text className="text-sm text-db-navy dark:text-[#EEF1F4]" numberOfLines={1}>
                            {eintrag.thema || eintrag.typ}
                          </Text>
                          {eintrag.ort && <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">{eintrag.ort}</Text>}
                        </>
                      ) : (
                        <Text className="text-sm italic text-db-navy-light dark:text-[#9AA4B0]">Frei / kein Eintrag</Text>
                      )}
                    </View>
                    {eintrag ? (
                      <View className={`shrink-0 flex-row items-center gap-1 overflow-hidden rounded-full px-2.5 py-1 ${typStyle[eintrag.typ]}`}>
                        <Pencil size={11} color={typIconColor[eintrag.typ]} />
                        <Text className={`text-xs font-medium ${typStyle[eintrag.typ]}`}>{eintrag.typ}</Text>
                      </View>
                    ) : (
                      <View className="shrink-0 flex-row items-center gap-1 rounded-full border border-dashed border-db-gray-200 dark:border-[#2A323D] px-2.5 py-1">
                        <Plus size={11} color="#5C6670" />
                        <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Eintragen</Text>
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
          <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
            <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Lernfelder · {curriculum.beruf}</Text>
            <Text className="mt-1 text-xs text-db-navy-light dark:text-[#9AA4B0]">
              Rahmenlehrplan der Berufsschule – zeigt, wo du im Vergleich zum Lehrplan stehst.
            </Text>
            <View className="mt-3 gap-2">
              {curriculum.lernfelder.map((lf) => (
                <View
                  key={lf.nummer}
                  className="flex-row items-center justify-between gap-3 rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2.5"
                >
                  <View className="flex-1">
                    <Text className="text-sm text-db-navy dark:text-[#EEF1F4]">
                      <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">LF{lf.nummer} </Text>
                      {lf.titel}
                    </Text>
                    <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
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

          <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
            <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Abschlussprüfung (gestreckt)</Text>
            <View className="mt-3 gap-3">
              {[curriculum.teil1, curriculum.teil2].map((teil) => (
                <View key={teil.bezeichnung} className="rounded-lg bg-db-gray-50 dark:bg-[#10141B] p-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">{teil.bezeichnung}</Text>
                    <Text className="text-xs font-semibold text-db-red">{teil.gewichtungGesamt}</Text>
                  </View>
                  <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">{teil.zeitpunkt}</Text>
                  <View className="mt-2 gap-1">
                    {teil.bereiche.map((b) => (
                      <View key={b.name} className="flex-row items-center justify-between">
                        <Text className="text-xs text-db-navy dark:text-[#EEF1F4]">{b.name}</Text>
                        <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
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
              <Text className="flex-1 text-xs text-db-navy-light dark:text-[#9AA4B0]">
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
