import { Check } from 'lucide-react-native'
import { useState, type ReactNode } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import {
  azubiProfilBeispiel,
  curricula,
  lehrjahreGesamtFuer,
  type AusbildungsberufName,
  type AzubiProfil,
} from '../data/mock'

const ausbildungsberufe: AusbildungsberufName[] = curricula.map((c) => c.beruf)

function Feld({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View>
      <Text className="mb-1 text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">{label}</Text>
      {children}
    </View>
  )
}

const inputClass =
  'w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2.5 text-sm text-db-navy dark:text-[#EEF1F4]'

export default function ProfilBearbeitenForm({
  profil,
  onSpeichern,
  onFertig,
}: {
  profil: AzubiProfil | null
  onSpeichern: (profil: AzubiProfil) => void
  onFertig: () => void
}) {
  const [entwurf, setEntwurf] = useState<AzubiProfil>(profil ?? azubiProfilBeispiel)
  const [gespeichert, setGespeichert] = useState(false)

  const aktualisieren = <K extends keyof AzubiProfil>(feld: K, wert: AzubiProfil[K]) => {
    setEntwurf((d) => {
      const naechster = { ...d, [feld]: wert }
      if (feld === 'ausbildungsberuf') {
        const gesamt = lehrjahreGesamtFuer(wert as AusbildungsberufName)
        naechster.lehrjahreGesamt = gesamt
        if (naechster.lehrjahr > gesamt) naechster.lehrjahr = gesamt
      }
      return naechster
    })
  }

  const formularOk =
    entwurf.name.trim() &&
    entwurf.unternehmensbereich.trim() &&
    entwurf.ausbildungsberuf &&
    entwurf.lehrjahr >= 1 &&
    entwurf.abteilung.trim() &&
    entwurf.werk.trim()

  const speichern = () => {
    if (!formularOk) return
    onSpeichern(entwurf)
    setGespeichert(true)
    setTimeout(onFertig, 600)
  }

  return (
    <View className="flex-1 bg-db-gray-50 dark:bg-[#10141B]">
      <ScrollView contentContainerClassName="gap-4 px-4 py-4 pb-4" keyboardShouldPersistTaps="handled">
        <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
          Änderungen werden erst mit „Speichern“ übernommen
        </Text>

        <View className="gap-4 rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Wer bist du?</Text>

          <Feld label="Wie heißt du?">
            <TextInput
              value={entwurf.name}
              onChangeText={(t) => aktualisieren('name', t)}
              placeholder="Max"
              className={inputClass}
            />
          </Feld>

          <Feld label="Wo arbeitest du? (Unternehmensbereich)">
            <TextInput
              value={entwurf.unternehmensbereich}
              onChangeText={(t) => aktualisieren('unternehmensbereich', t)}
              placeholder="z. B. DB Fahrzeuginstandhaltung"
              className={inputClass}
            />
          </Feld>

          <Feld label="Was ist dein Ausbildungsberuf?">
            <View className="gap-2">
              {ausbildungsberufe.map((beruf) => (
                <Pressable
                  key={beruf}
                  onPress={() => aktualisieren('ausbildungsberuf', beruf)}
                  className={`rounded-lg border px-3 py-2.5 ${
                    entwurf.ausbildungsberuf === beruf ? 'border-db-red bg-db-red/5' : 'border-db-gray-200 dark:border-[#2A323D]'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      entwurf.ausbildungsberuf === beruf ? 'text-db-red-dark' : 'text-db-navy dark:text-[#EEF1F4]'
                    }`}
                  >
                    {beruf}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Feld>
        </View>

        <View className="gap-4 rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
          <View>
            <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Lehrjahr</Text>
            <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
              {entwurf.ausbildungsberuf}, insgesamt {entwurf.lehrjahreGesamt} Jahre
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {Array.from({ length: entwurf.lehrjahreGesamt }, (_, i) => i + 1).map((jahr) => (
              <Pressable
                key={jahr}
                onPress={() => aktualisieren('lehrjahr', jahr)}
                className={`w-[30%] items-center rounded-xl border px-4 py-4 ${
                  entwurf.lehrjahr === jahr ? 'border-db-red bg-db-red/5' : 'border-db-gray-200 dark:border-[#2A323D]'
                }`}
              >
                <Text className={`text-2xl font-bold ${entwurf.lehrjahr === jahr ? 'text-db-red-dark' : 'text-db-navy dark:text-[#EEF1F4]'}`}>
                  {jahr}
                </Text>
                <Text className={`text-xs ${entwurf.lehrjahr === jahr ? 'text-db-red-dark' : 'text-db-navy dark:text-[#EEF1F4]'}`}>
                  . Lehrjahr
                </Text>
              </Pressable>
            ))}
          </View>

          <Feld label="Ausbildungsbeginn (für die Nummerierung im Ausbildungsnachweis)">
            <TextInput
              value={entwurf.ausbildungsbeginn}
              onChangeText={(t) => aktualisieren('ausbildungsbeginn', t)}
              placeholder="JJJJ-MM-TT, z. B. 2026-09-01"
              className={inputClass}
            />
          </Feld>
        </View>

        <View className="gap-4 rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Abteilung &amp; Werk</Text>

          <Feld label="Abteilung">
            <TextInput
              value={entwurf.abteilung}
              onChangeText={(t) => aktualisieren('abteilung', t)}
              placeholder="z. B. Fahrzeuginstandhaltung – Elektrik"
              className={inputClass}
            />
          </Feld>

          <Feld label="Werk / Standort">
            <TextInput
              value={entwurf.werk}
              onChangeText={(t) => aktualisieren('werk', t)}
              placeholder="z. B. Werk Rummelsburg"
              className={inputClass}
            />
          </Feld>

          <Feld label="Ausbilder/-in (optional)">
            <TextInput
              value={entwurf.ausbilder}
              onChangeText={(t) => aktualisieren('ausbilder', t)}
              placeholder="z. B. Herr Kowalski"
              className={inputClass}
            />
          </Feld>

          <Feld label="E-Mail für die Abgabe des Ausbildungsnachweises (optional)">
            <TextInput
              value={entwurf.ausbilderEmail}
              onChangeText={(t) => aktualisieren('ausbilderEmail', t)}
              placeholder="z. B. Ausbildungswerkstatt.Musterstadt@deutschebahn.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className={inputClass}
            />
          </Feld>
        </View>
      </ScrollView>

      <View className="border-t border-db-gray-200 dark:border-[#2A323D] bg-db-gray-50 dark:bg-[#10141B] px-4 py-4">
        <Pressable
          onPress={speichern}
          disabled={!formularOk || gespeichert}
          className={`flex-row items-center justify-center gap-1.5 rounded-full bg-db-red px-4 py-3 ${
            !formularOk || gespeichert ? 'opacity-40' : ''
          }`}
        >
          {gespeichert ? (
            <>
              <Check size={16} color="#fff" />
              <Text className="text-sm font-semibold text-white">Gespeichert</Text>
            </>
          ) : (
            <Text className="text-sm font-semibold text-white">Speichern</Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}
