import { ChevronLeft } from 'lucide-react-native'
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
      <Text className="mb-1 text-xs font-medium text-db-navy-light">{label}</Text>
      {children}
    </View>
  )
}

const inputClass =
  'w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy'

export default function ProfilForm({
  profil,
  onFertig,
}: {
  profil: AzubiProfil | null
  onFertig: (profil: AzubiProfil) => void
}) {
  const [schritt, setSchritt] = useState(1)
  const [entwurf, setEntwurf] = useState<AzubiProfil>(profil ?? azubiProfilBeispiel)

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

  const schritt1Ok = entwurf.name.trim() && entwurf.unternehmensbereich.trim() && entwurf.ausbildungsberuf
  const schritt2Ok = entwurf.lehrjahr >= 1
  const schritt3Ok = entwurf.abteilung.trim() && entwurf.werk.trim()

  const weiter = () => setSchritt((s) => Math.min(3, s + 1))
  const zurueck = () => setSchritt((s) => Math.max(1, s - 1))

  return (
    <View className="flex-1 bg-db-gray-50">
      <ScrollView contentContainerClassName="px-4 py-8" keyboardShouldPersistTaps="handled">
        <View className="mb-6 flex-row gap-1.5">
          {[1, 2, 3].map((s) => (
            <View key={s} className={`h-1.5 flex-1 rounded-full ${s <= schritt ? 'bg-db-red' : 'bg-db-gray-200'}`} />
          ))}
        </View>

        <View className="gap-4">
          {schritt === 1 && (
            <>
              <View>
                <Text className="text-lg font-semibold text-db-navy">Wer bist du?</Text>
                <Text className="text-sm text-db-navy-light">Und wo arbeitest du, welchen Beruf lernst du?</Text>
              </View>

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
                        entwurf.ausbildungsberuf === beruf ? 'border-db-red bg-db-red/5' : 'border-db-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          entwurf.ausbildungsberuf === beruf ? 'text-db-red-dark' : 'text-db-navy'
                        }`}
                      >
                        {beruf}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Feld>
            </>
          )}

          {schritt === 2 && (
            <>
              <View>
                <Text className="text-lg font-semibold text-db-navy">Lehrjahr</Text>
                <Text className="text-sm text-db-navy-light">
                  In welchem Ausbildungsjahr bist du gerade? ({entwurf.ausbildungsberuf}, insgesamt{' '}
                  {entwurf.lehrjahreGesamt} Jahre)
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {Array.from({ length: entwurf.lehrjahreGesamt }, (_, i) => i + 1).map((jahr) => (
                  <Pressable
                    key={jahr}
                    onPress={() => aktualisieren('lehrjahr', jahr)}
                    className={`w-[47%] items-center rounded-xl border px-4 py-4 ${
                      entwurf.lehrjahr === jahr ? 'border-db-red bg-db-red/5' : 'border-db-gray-200'
                    }`}
                  >
                    <Text className={`text-2xl font-bold ${entwurf.lehrjahr === jahr ? 'text-db-red-dark' : 'text-db-navy'}`}>
                      {jahr}
                    </Text>
                    <Text className={`text-xs ${entwurf.lehrjahr === jahr ? 'text-db-red-dark' : 'text-db-navy'}`}>
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
            </>
          )}

          {schritt === 3 && (
            <>
              <View>
                <Text className="text-lg font-semibold text-db-navy">Abteilung &amp; Werk</Text>
                <Text className="text-sm text-db-navy-light">Wo genau bist du eingesetzt?</Text>
              </View>

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
            </>
          )}
        </View>
      </ScrollView>

      <View className="flex-row items-center gap-2 border-t border-db-gray-200 bg-db-gray-50 px-4 py-4">
        {schritt > 1 && (
          <Pressable
            onPress={zurueck}
            className="items-center justify-center rounded-full border border-db-gray-200 bg-white px-4 py-3"
          >
            <ChevronLeft size={16} color="#14181F" />
          </Pressable>
        )}
        {schritt < 3 ? (
          <Pressable
            onPress={weiter}
            disabled={schritt === 1 ? !schritt1Ok : !schritt2Ok}
            className={`flex-1 items-center rounded-full bg-db-red px-4 py-3 ${
              (schritt === 1 ? !schritt1Ok : !schritt2Ok) ? 'opacity-40' : ''
            }`}
          >
            <Text className="text-sm font-semibold text-white">Weiter</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => onFertig(entwurf)}
            disabled={!schritt3Ok}
            className={`flex-1 items-center rounded-full bg-db-red px-4 py-3 ${!schritt3Ok ? 'opacity-40' : ''}`}
          >
            <Text className="text-sm font-semibold text-white">Los geht's</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}
