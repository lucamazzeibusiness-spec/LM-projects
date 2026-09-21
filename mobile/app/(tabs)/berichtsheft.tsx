import { CalendarCheck, Download, Loader2, Pencil, X } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { BerichtStatusBadge } from '../../components/Badges'
import SignaturePad from '../../components/SignaturePad'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { useBerichtsheft } from '../../hooks/useBerichtsheft'
import { exportBerichtsheftPdf } from '../../lib/exportBerichtsheft'
import { heuteISO, heutigesDatumLabel, wochenLabel, wochenSchluessel, wochenStartEnde } from '../../lib/wochen'
import type { BerichtsheftEintrag, BerichtsheftKategorie } from '../../data/mock'

const kategorien: BerichtsheftKategorie[] = ['Betrieblich', 'Berufsschule', 'DB Training']

function neuerTageseintrag(): BerichtsheftEintrag {
  return {
    id: `B-${Date.now()}`,
    datumISO: heuteISO(),
    datum: heutigesDatumLabel(),
    kategorie: 'Betrieblich',
    taetigkeiten: '',
    stunden: 8,
    status: 'Entwurf',
  }
}

interface Wochengruppe {
  schluessel: string
  label: string
  eintraege: BerichtsheftEintrag[]
}

export default function Berichtsheft() {
  const { profil } = useAzubiProfil()
  const { eintraege, setEintraege } = useBerichtsheft()
  const [bearbeitung, setBearbeitung] = useState<BerichtsheftEintrag | null>(null)
  const [exportierendeWoche, setExportierendeWoche] = useState<string | null>(null)
  const [signieren, setSignieren] = useState<Wochengruppe | null>(null)
  const [unterschrift, setUnterschrift] = useState<string | null>(null)

  const heute = heuteISO()
  const heutigerEintrag = eintraege.find((e) => e.datumISO === heute)

  const wochen: Wochengruppe[] = useMemo(() => {
    const gruppen = new Map<string, BerichtsheftEintrag[]>()
    for (const e of eintraege) {
      const schluessel = wochenSchluessel(e.datumISO)
      const liste = gruppen.get(schluessel) ?? []
      liste.push(e)
      gruppen.set(schluessel, liste)
    }
    return [...gruppen.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([schluessel, liste]) => ({
        schluessel,
        label: wochenLabel(liste[0].datumISO),
        eintraege: liste.sort((a, b) => b.datumISO.localeCompare(a.datumISO)),
      }))
  }, [eintraege])

  if (!profil) return null

  const aktuelleWoche = wochen.find((w) => w.schluessel === wochenSchluessel(heute))
  const stundenDieseWoche = aktuelleWoche?.eintraege.reduce((sum, e) => sum + e.stunden, 0) ?? 0
  const offeneEntwuerfe = eintraege.filter((e) => e.status === 'Entwurf' && e.taetigkeiten.trim()).length

  const heuteBearbeiten = () => setBearbeitung(heutigerEintrag ?? neuerTageseintrag())

  const speichern = () => {
    if (!bearbeitung || !bearbeitung.taetigkeiten.trim()) return
    setEintraege((prev) => [bearbeitung, ...prev.filter((e) => e.id !== bearbeitung.id)])
    setBearbeitung(null)
  }

  const einreichen = (id: string) => {
    setEintraege((prev) => prev.map((e) => (e.id === id && e.taetigkeiten.trim() ? { ...e, status: 'Eingereicht' } : e)))
  }

  const wocheExportieren = async (gruppe: Wochengruppe, unterschriftDataUrl: string) => {
    setExportierendeWoche(gruppe.schluessel)
    try {
      const { von, bis } = wochenStartEnde(gruppe.schluessel)
      const alleSchluessel = wochen.map((w) => w.schluessel).sort()
      const nr = String(alleSchluessel.indexOf(gruppe.schluessel) + 1).padStart(3, '0')
      await exportBerichtsheftPdf(profil, gruppe.eintraege, { nr, von, bis, unterschriftDataUrl })
    } finally {
      setExportierendeWoche(null)
    }
  }

  const signaturBestaetigen = async () => {
    if (!signieren || !unterschrift) return
    await wocheExportieren(signieren, unterschrift)
    setSignieren(null)
    setUnterschrift(null)
  }

  return (
    <View className="flex-1 bg-db-gray-50">
      <ScrollView contentContainerClassName="gap-4 p-4">
        <View>
          <Text className="text-xl font-semibold text-db-navy">Berichtsheft</Text>
          <Text className="text-sm text-db-navy-light">
            Trag jeden Tag kurz ein, was du gemacht hast – am Ende der Woche fasst die App das automatisch zu deinem
            Wochenbericht zusammen.
          </Text>
        </View>

        <Pressable
          onPress={heuteBearbeiten}
          className={`flex-row items-center justify-between rounded-xl border px-4 py-3.5 ${
            heutigerEintrag ? 'border-db-green/30 bg-db-green/5' : 'border-db-red/30 bg-db-red/5'
          }`}
        >
          <View className="flex-row items-center gap-2">
            <CalendarCheck size={18} color={heutigerEintrag ? '#1E8A3C' : '#C40012'} />
            <Text className={`text-sm font-semibold ${heutigerEintrag ? 'text-db-green' : 'text-db-red-dark'}`}>
              {heutigerEintrag ? `Heute schon erfasst (${heutigesDatumLabel()})` : `Heutigen Eintrag ausfüllen (${heutigesDatumLabel()})`}
            </Text>
          </View>
          {heutigerEintrag ? (
            <View className="flex-row items-center gap-1">
              <Pencil size={13} color="#5C6670" />
              <Text className="text-xs font-medium text-db-navy-light">Bearbeiten</Text>
            </View>
          ) : (
            <Text className="overflow-hidden rounded-full bg-db-red px-3 py-1.5 text-xs font-semibold text-white">Jetzt</Text>
          )}
        </Pressable>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-xl border border-db-gray-200 bg-white p-4">
            <Text className="text-2xl font-semibold text-db-navy">{stundenDieseWoche} Std.</Text>
            <Text className="text-xs text-db-navy-light">Erfasst diese Woche</Text>
          </View>
          <View className="flex-1 rounded-xl border border-db-gray-200 bg-white p-4">
            <Text className={`text-2xl font-semibold ${offeneEntwuerfe > 0 ? 'text-db-red' : 'text-db-green'}`}>
              {offeneEntwuerfe}
            </Text>
            <Text className="text-xs text-db-navy-light">Noch nicht eingereicht</Text>
          </View>
        </View>

        <View className="gap-5">
          {wochen.map((gruppe) => {
            const vollstaendig = gruppe.eintraege.every((e) => e.taetigkeiten.trim())
            const stunden = gruppe.eintraege.reduce((sum, e) => sum + e.stunden, 0)
            return (
              <View key={gruppe.schluessel} className="gap-2">
                <View className="flex-row items-center justify-between gap-3 px-1">
                  <View>
                    <Text className="text-sm font-semibold text-db-navy">Woche {gruppe.label}</Text>
                    <Text className="text-xs text-db-navy-light">
                      {gruppe.eintraege.length} Einträge · {stunden} Std. ·{' '}
                      <Text className={vollstaendig ? 'text-db-green' : 'text-db-amber'}>
                        {vollstaendig ? 'vollständig' : 'in Bearbeitung'}
                      </Text>
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setUnterschrift(null)
                      setSignieren(gruppe)
                    }}
                    disabled={exportierendeWoche === gruppe.schluessel}
                    className="flex-row items-center gap-1.5 rounded-full border border-db-gray-200 bg-white px-3 py-1.5"
                  >
                    {exportierendeWoche === gruppe.schluessel ? (
                      <Loader2 size={14} color="#14181F" />
                    ) : (
                      <Download size={14} color="#14181F" />
                    )}
                    <Text className="text-xs font-semibold text-db-navy">Ausbildungsnachweis</Text>
                  </Pressable>
                </View>

                <View className="gap-3">
                  {gruppe.eintraege.map((e) => (
                    <View key={e.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
                      <View className="flex-row items-start justify-between gap-3">
                        <View>
                          <Text className="text-sm font-semibold text-db-navy">{e.datum}</Text>
                          <Text className="text-xs text-db-navy-light">
                            {e.kategorie} · {e.stunden} Std.
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <BerichtStatusBadge status={e.status} />
                          <Pressable onPress={() => setBearbeitung(e)}>
                            <Pencil size={14} color="#5C6670" />
                          </Pressable>
                        </View>
                      </View>
                      <Text className="mt-2 text-sm text-db-navy">
                        {e.taetigkeiten || <Text className="italic text-db-navy-light">Noch keine Angaben</Text>}
                      </Text>
                      {e.ausbilderKommentar && (
                        <Text className="mt-2 rounded-lg bg-db-gray-50 p-2 text-xs text-db-navy-light">
                          <Text className="font-semibold text-db-navy">Ausbilder: </Text>
                          {e.ausbilderKommentar}
                        </Text>
                      )}
                      {e.status === 'Entwurf' && e.taetigkeiten.trim() && (
                        <Pressable
                          onPress={() => einreichen(e.id)}
                          className="mt-3 self-start rounded-full bg-db-red px-3.5 py-1.5"
                        >
                          <Text className="text-xs font-semibold text-white">Zur Freigabe einreichen</Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      <Modal visible={!!bearbeitung} transparent animationType="fade" onRequestClose={() => setBearbeitung(null)}>
        <Pressable className="flex-1 justify-end bg-black/40 sm:items-center sm:justify-center" onPress={() => setBearbeitung(null)}>
          {bearbeitung && (
            <Pressable className="gap-3 rounded-t-2xl bg-white p-4 sm:w-full sm:max-w-md sm:rounded-2xl" onPress={(e) => e.stopPropagation()}>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-db-navy">Eintrag · {bearbeitung.datum}</Text>
                <Pressable onPress={() => setBearbeitung(null)}>
                  <X size={18} color="#5C6670" />
                </Pressable>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {kategorien.map((k) => (
                  <Pressable
                    key={k}
                    onPress={() => setBearbeitung((d) => d && { ...d, kategorie: k })}
                    className={`rounded-full border px-3 py-1.5 ${
                      bearbeitung.kategorie === k ? 'border-db-navy bg-db-navy' : 'border-db-gray-200 bg-white'
                    }`}
                  >
                    <Text className={`text-xs font-medium ${bearbeitung.kategorie === k ? 'text-white' : 'text-db-navy-light'}`}>
                      {k}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                value={bearbeitung.taetigkeiten}
                onChangeText={(t) => setBearbeitung((d) => d && { ...d, taetigkeiten: t })}
                multiline
                numberOfLines={4}
                placeholder="Welche Tätigkeiten hast du heute ausgeführt oder welche Lerninhalte hattest du?"
                className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy"
                style={{ minHeight: 90, textAlignVertical: 'top' }}
              />

              <View className="flex-row items-center gap-2">
                <Text className="text-xs font-medium text-db-navy-light">Stunden</Text>
                <TextInput
                  value={String(bearbeitung.stunden)}
                  onChangeText={(t) => setBearbeitung((d) => d && { ...d, stunden: Number(t) || 0 })}
                  keyboardType="numeric"
                  className="w-20 rounded-lg border border-db-gray-200 px-2 py-1.5 text-sm text-db-navy"
                />
              </View>

              <Pressable onPress={speichern} className="items-center rounded-full bg-db-navy px-4 py-2.5">
                <Text className="text-sm font-semibold text-white">Speichern</Text>
              </Pressable>
            </Pressable>
          )}
        </Pressable>
      </Modal>

      <Modal visible={!!signieren} transparent animationType="fade" onRequestClose={() => setSignieren(null)}>
        <Pressable className="flex-1 justify-end bg-black/40 sm:items-center sm:justify-center" onPress={() => setSignieren(null)}>
          {signieren && (
            <Pressable className="gap-4 rounded-t-2xl bg-white p-5 sm:w-full sm:max-w-md sm:rounded-2xl" onPress={(e) => e.stopPropagation()}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold text-db-navy">Unterschrift bestätigen</Text>
                  <Text className="text-xs text-db-navy-light">
                    Woche {signieren.label} · {signieren.eintraege.length} Einträge
                  </Text>
                </View>
                <Pressable onPress={() => setSignieren(null)}>
                  <X size={18} color="#5C6670" />
                </Pressable>
              </View>

              <Text className="text-xs text-db-navy-light">
                Mit deiner Unterschrift bestätigst du, dass die Angaben in diesem Ausbildungsnachweis richtig und
                vollständig sind.
              </Text>

              <SignaturePad onChange={setUnterschrift} />

              <Pressable
                onPress={signaturBestaetigen}
                disabled={!unterschrift || exportierendeWoche === signieren.schluessel}
                className={`flex-row items-center justify-center gap-2 rounded-full bg-db-red px-4 py-3 ${
                  !unterschrift ? 'opacity-50' : ''
                }`}
              >
                {exportierendeWoche === signieren.schluessel ? (
                  <Loader2 size={16} color="#fff" />
                ) : (
                  <Download size={16} color="#fff" />
                )}
                <Text className="text-sm font-semibold text-white">Unterschreiben &amp; PDF erstellen</Text>
              </Pressable>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </View>
  )
}
