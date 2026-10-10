import { CalendarCheck, CheckSquare, ChevronLeft, ChevronRight, Download, Eye, Loader2, Pencil, Plus, Square, X } from 'lucide-react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Modal, PanResponder, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { BerichtStatusBadge } from '../../components/Badges'
import SignaturePad from '../../components/SignaturePad'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { useAusbildungsplan, type Wochenvorlage } from '../../context/AusbildungsplanContext'
import { berichtsheftStreak, usePunkte } from '../../context/PunkteContext'
import { useBerichtsheft } from '../../context/BerichtsheftContext'
import { ausbildungsnachweisVorschauHtml, exportBerichtsheftPdf } from '../../lib/exportBerichtsheft'
import { bulletEingabeVerarbeiten, hatEchtenInhalt } from '../../lib/stichpunkte'
import {
  arbeitstageDerWoche,
  heuteISO,
  heutigesDatumLabel,
  wochenLabel,
  wochenNummerSeit,
  wochenSchluessel,
  wochenStartEnde,
  wocheVerschieben,
  wochentagIndexVon,
} from '../../lib/wochen'
import type { AusbildungsblockTyp, BerichtsheftEintrag, BerichtsheftKategorie } from '../../data/mock'

const kategorien: BerichtsheftKategorie[] = ['Betrieblich', 'Berufsschule', 'DB Training']

function datumLabelFuer(datumISO: string): string {
  return new Date(`${datumISO}T00:00:00`).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  })
}

const kategorieFuerBlock: Record<AusbildungsblockTyp, BerichtsheftKategorie> = {
  Betrieb: 'Betrieblich',
  Berufsschule: 'Berufsschule',
  'DB Training': 'DB Training',
}

// Die Kategorie wird aus dem Ausbildungsplan für diesen Wochentag vorbelegt (z. B. Berufsschultag),
// bleibt aber im Formular änderbar.
function neuerTageseintragFuer(datumISO: string, vorlage: Wochenvorlage): BerichtsheftEintrag {
  const wochentag = wochentagIndexVon(datumISO)
  const istFreitag = wochentag === 4
  const block = vorlage[wochentag]
  return {
    id: `B-${Date.now()}`,
    datumISO,
    datum: datumLabelFuer(datumISO),
    kategorie: block ? kategorieFuerBlock[block.typ] : 'Betrieblich',
    taetigkeiten: '',
    stunden: istFreitag ? 6 : 8,
    status: 'Entwurf',
  }
}

export default function Berichtsheft() {
  const { profil } = useAzubiProfil()
  const { eintraege, setEintraege } = useBerichtsheft()
  const { vorlage } = useAusbildungsplan()
  const { punkteVergeben, stand: punkteStand } = usePunkte()
  const [bearbeitung, setBearbeitung] = useState<BerichtsheftEintrag | null>(null)
  const [taetigkeitenAuswahl, setTaetigkeitenAuswahl] = useState<{ start: number; end: number } | undefined>(undefined)
  const [exportiert, setExportiert] = useState(false)
  const [vorschauHtml, setVorschauHtml] = useState<string | null>(null)
  const [geprueft, setGeprueft] = useState(false)
  const [signaturOffen, setSignaturOffen] = useState(false)
  const [unterschrift, setUnterschrift] = useState<string | null>(null)
  const [ausgewaehlteWoche, setAusgewaehlteWoche] = useState(() => wochenSchluessel(heuteISO()))

  const heute = heuteISO()
  const heutigerEintrag = eintraege.find((e) => e.datumISO === heute)
  const heuteSchluessel = wochenSchluessel(heute)
  const istAktuelleWoche = ausgewaehlteWoche === heuteSchluessel
  const beginnSchluessel = profil?.ausbildungsbeginn ? wochenSchluessel(profil.ausbildungsbeginn) : null
  const kannZurueck = !beginnSchluessel || ausgewaehlteWoche > beginnSchluessel

  const montagFreitag = useMemo(() => arbeitstageDerWoche(ausgewaehlteWoche), [ausgewaehlteWoche])
  const wocheEintraege = useMemo(
    () => eintraege.filter((e) => wochenSchluessel(e.datumISO) === ausgewaehlteWoche),
    [eintraege, ausgewaehlteWoche],
  )
  const eintraegeNachDatum = useMemo(() => new Map(wocheEintraege.map((e) => [e.datumISO, e])), [wocheEintraege])
  const zusatzTage = useMemo(
    () => wocheEintraege.map((e) => e.datumISO).filter((d) => !montagFreitag.includes(d)).sort(),
    [wocheEintraege, montagFreitag],
  )
  const anzeigeTage = [...montagFreitag, ...zusatzTage]

  const wocheStunden = wocheEintraege.reduce((sum, e) => sum + e.stunden, 0)
  const erfassteTage = montagFreitag.filter((d) => hatEchtenInhalt(eintraegeNachDatum.get(d)?.taetigkeiten ?? '')).length
  const wocheVollstaendig = erfassteTage === montagFreitag.length

  const alleWochenMitEintraegen = useMemo(() => {
    const set = new Set(eintraege.map((e) => wochenSchluessel(e.datumISO)))
    set.add(ausgewaehlteWoche)
    return [...set].sort()
  }, [eintraege, ausgewaehlteWoche])

  const nachweisMeta = useMemo(() => {
    if (!profil) return null
    const { von, bis } = wochenStartEnde(ausgewaehlteWoche)
    const nrZahl = profil.ausbildungsbeginn
      ? wochenNummerSeit(profil.ausbildungsbeginn, ausgewaehlteWoche)
      : alleWochenMitEintraegen.indexOf(ausgewaehlteWoche) + 1
    const nr = String(Math.max(1, nrZahl)).padStart(3, '0')
    const jahr = Number(ausgewaehlteWoche.slice(0, 4))
    return { nr, von, bis, jahr }
  }, [profil, ausgewaehlteWoche, alleWochenMitEintraegen])

  const vorherigeWoche = () =>
    setAusgewaehlteWoche((w) => {
      const ziel = wocheVerschieben(w, -1)
      if (beginnSchluessel && ziel < beginnSchluessel) return w
      return ziel
    })
  const naechsteWoche = () => setAusgewaehlteWoche((w) => wocheVerschieben(w, 1))
  const zurAktuellenWoche = () => setAusgewaehlteWoche(heuteSchluessel)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 50) vorherigeWoche()
        else if (gesture.dx < -50) naechsteWoche()
      },
    }),
  ).current

  // Setzt die Cursor-Position für das Stichpunkt-Textfeld zurück, sobald ein anderer Eintrag
  // geöffnet (oder das Modal geschlossen) wird – sonst könnte die alte Auswahl eines vorherigen,
  // meist länger/kürzeren Textes beim neuen Eintrag an einer unpassenden Stelle landen.
  useEffect(() => {
    setTaetigkeitenAuswahl(undefined)
  }, [bearbeitung?.id])

  if (!profil) return null

  const heuteBearbeiten = () => setBearbeitung(heutigerEintrag ?? neuerTageseintragFuer(heute, vorlage))

  const speichern = () => {
    if (!bearbeitung || !hatEchtenInhalt(bearbeitung.taetigkeiten)) return
    setEintraege((prev) => [bearbeitung, ...prev.filter((e) => e.id !== bearbeitung.id)])

    const ereignisId = `berichtsheft:${bearbeitung.datumISO}`
    const neueStreak = berichtsheftStreak([{ id: ereignisId, betrag: 0, grund: '', datum: '' }, ...punkteStand.verlauf])
    const bonus = Math.min(neueStreak, 10) * 2
    const grund =
      neueStreak > 1 ? `Berichtsheft: ${bearbeitung.datum} (🔥 ${neueStreak} Tage in Folge)` : `Berichtsheft: ${bearbeitung.datum}`
    punkteVergeben(ereignisId, 15 + bonus, grund)

    setBearbeitung(null)
  }

  const wocheExportieren = async (unterschriftDataUrl: string) => {
    if (!nachweisMeta) return
    setExportiert(true)
    try {
      await exportBerichtsheftPdf(profil, wocheEintraege, { ...nachweisMeta, unterschriftDataUrl })
    } finally {
      setExportiert(false)
    }
  }

  const vorschauOeffnen = () => {
    if (!nachweisMeta) return
    setGeprueft(false)
    setVorschauHtml(ausbildungsnachweisVorschauHtml(profil, wocheEintraege, nachweisMeta))
  }

  const vorschauSchliessen = () => setVorschauHtml(null)

  const weiterZurUnterschrift = () => {
    vorschauSchliessen()
    setUnterschrift(null)
    setSignaturOffen(true)
  }

  const zurueckZurVorschau = () => {
    setSignaturOffen(false)
    vorschauOeffnen()
  }

  const signaturBestaetigen = async () => {
    if (!unterschrift) return
    await wocheExportieren(unterschrift)
    setSignaturOffen(false)
    setUnterschrift(null)
  }

  return (
    <View className="flex-1 bg-db-gray-50 dark:bg-[#10141B]">
      <ScrollView contentContainerClassName="gap-4 p-4">
        <View>
          <Text className="text-xl font-semibold text-db-navy dark:text-[#EEF1F4]">Berichtsheft</Text>
          <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">
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
              <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Bearbeiten</Text>
            </View>
          ) : (
            <Text className="overflow-hidden rounded-full bg-db-red px-3 py-1.5 text-xs font-semibold text-white">Jetzt</Text>
          )}
        </Pressable>

        <View className="gap-3" {...panResponder.panHandlers}>
          <View className="flex-row items-center justify-between gap-2 px-1">
            <Pressable
              onPress={vorherigeWoche}
              disabled={!kannZurueck}
              className={`h-8 w-8 shrink-0 items-center justify-center rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] ${
                kannZurueck ? '' : 'opacity-30'
              }`}
            >
              <ChevronLeft size={16} color="#5C6670" />
            </Pressable>

            <View className="min-w-0 flex-1 items-center">
              <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">
                Woche {wochenLabel(ausgewaehlteWoche)}
                {istAktuelleWoche && <Text className="text-xs font-medium text-db-red"> · aktuell</Text>}
              </Text>
              <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
                {erfassteTage}/{montagFreitag.length} Tage erfasst · {wocheStunden} Std. ·{' '}
                <Text className={wocheVollstaendig ? 'text-db-green' : 'text-db-amber'}>
                  {wocheVollstaendig ? 'vollständig' : 'in Bearbeitung'}
                </Text>
              </Text>
            </View>

            <Pressable
              onPress={naechsteWoche}
              className="h-8 w-8 shrink-0 items-center justify-center rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]"
            >
              <ChevronRight size={16} color="#5C6670" />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-2">
            {!istAktuelleWoche && (
              <Pressable onPress={zurAktuellenWoche} className="rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-3 py-1.5">
                <Text className="text-xs font-semibold text-db-navy dark:text-[#EEF1F4]">Zur aktuellen Woche</Text>
              </Pressable>
            )}
            <Pressable
              onPress={vorschauOeffnen}
              disabled={exportiert}
              className="ml-auto flex-row items-center gap-1.5 rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-3 py-1.5"
            >
              {exportiert ? <Loader2 size={14} color="#14181F" /> : <Eye size={14} color="#14181F" />}
              <Text className="text-xs font-semibold text-db-navy dark:text-[#EEF1F4]">Ausbildungsnachweis</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {anzeigeTage.map((datumISO) => {
              const e = eintraegeNachDatum.get(datumISO)
              if (!e) {
                return (
                  <Pressable
                    key={datumISO}
                    onPress={() => setBearbeitung(neuerTageseintragFuer(datumISO, vorlage))}
                    className="flex-row items-center justify-between rounded-xl border border-dashed border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4"
                  >
                    <Text className="text-sm font-medium text-db-navy-light dark:text-[#9AA4B0]">{datumLabelFuer(datumISO)}</Text>
                    <View className="flex-row items-center gap-1">
                      <Plus size={13} color="#EC0016" />
                      <Text className="text-xs font-medium text-db-red">Eintragen</Text>
                    </View>
                  </Pressable>
                )
              }
              return (
                <View key={e.id} className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <View>
                      <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">{e.datum}</Text>
                      <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
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
                  <Text className="mt-2 text-sm text-db-navy dark:text-[#EEF1F4]">
                    {e.taetigkeiten || <Text className="italic text-db-navy-light dark:text-[#9AA4B0]">Noch keine Angaben</Text>}
                  </Text>
                  {e.ausbilderKommentar && (
                    <Text className="mt-2 rounded-lg bg-db-gray-50 dark:bg-[#10141B] p-2 text-xs text-db-navy-light dark:text-[#9AA4B0]">
                      <Text className="font-semibold text-db-navy dark:text-[#EEF1F4]">Ausbilder: </Text>
                      {e.ausbilderKommentar}
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!bearbeitung} transparent animationType="fade" onRequestClose={() => setBearbeitung(null)}>
        <Pressable className="flex-1 justify-end bg-black/40 sm:items-center sm:justify-center" onPress={() => setBearbeitung(null)}>
          {bearbeitung && (
            <Pressable className="gap-3 rounded-t-2xl bg-white dark:bg-[#171C24] p-4 sm:w-full sm:max-w-md sm:rounded-2xl" onPress={(e) => e.stopPropagation()}>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Eintrag · {bearbeitung.datum}</Text>
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
                      bearbeitung.kategorie === k
                        ? 'border-db-navy bg-db-navy dark:border-[#3A4453] dark:bg-[#3A4453]'
                        : 'border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'
                    }`}
                  >
                    <Text className={`text-xs font-medium ${bearbeitung.kategorie === k ? 'text-white' : 'text-db-navy-light dark:text-[#9AA4B0]'}`}>
                      {k}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                value={bearbeitung.taetigkeiten}
                onChangeText={(t) => {
                  const { wert, cursor } = bulletEingabeVerarbeiten(bearbeitung.taetigkeiten, t)
                  setBearbeitung((d) => d && { ...d, taetigkeiten: wert })
                  setTaetigkeitenAuswahl(cursor !== null ? { start: cursor, end: cursor } : undefined)
                }}
                selection={taetigkeitenAuswahl}
                multiline
                numberOfLines={4}
                placeholder="Welche Tätigkeiten hast du heute ausgeführt oder welche Lerninhalte hattest du? Jede neue Zeile wird automatisch zum Stichpunkt."
                className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2 text-sm text-db-navy dark:text-[#EEF1F4]"
                style={{ minHeight: 90, textAlignVertical: 'top' }}
              />

              <View className="flex-row items-center gap-2">
                <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Stunden</Text>
                <TextInput
                  value={String(bearbeitung.stunden)}
                  onChangeText={(t) => setBearbeitung((d) => d && { ...d, stunden: Number(t) || 0 })}
                  keyboardType="numeric"
                  className="w-20 rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-2 py-1.5 text-sm text-db-navy dark:text-[#EEF1F4]"
                />
              </View>

              <Pressable onPress={speichern} className="items-center rounded-full bg-db-navy px-4 py-2.5 dark:bg-[#3A4453]">
                <Text className="text-sm font-semibold text-white">Speichern</Text>
              </Pressable>
            </Pressable>
          )}
        </Pressable>
      </Modal>

      <Modal visible={!!vorschauHtml} transparent animationType="fade" onRequestClose={vorschauSchliessen}>
        <Pressable className="flex-1 justify-end bg-black/40 sm:items-center sm:justify-center" onPress={vorschauSchliessen}>
          <Pressable
            className="gap-3 rounded-t-2xl bg-white dark:bg-[#171C24] p-5 sm:w-full sm:max-w-2xl sm:rounded-2xl"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Vorschau · Ausbildungsnachweis</Text>
                <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
                  Woche {wochenLabel(ausgewaehlteWoche)} · {wocheEintraege.length} Einträge – noch ohne Unterschrift
                </Text>
              </View>
              <Pressable onPress={vorschauSchliessen}>
                <X size={18} color="#5C6670" />
              </Pressable>
            </View>

            <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
              Prüf die Angaben in Ruhe. Passt noch was nicht, schließ die Vorschau, korrigier den Tageseintrag über
              den Stift und öffne die Vorschau erneut.
            </Text>

            <View
              style={{ height: Dimensions.get('window').height * 0.55 }}
              className="overflow-hidden rounded-lg border border-db-gray-200 dark:border-[#2A323D]"
            >
              {vorschauHtml && <WebView originWhitelist={['*']} source={{ html: vorschauHtml }} />}
            </View>

            <Pressable onPress={() => setGeprueft((g) => !g)} className="flex-row items-start gap-2">
              {geprueft ? (
                <CheckSquare size={17} color="#EC0016" />
              ) : (
                <Square size={17} color="#9AA4B0" />
              )}
              <Text className="flex-1 text-xs text-db-navy-light dark:text-[#9AA4B0]">
                Ich habe die Angaben geprüft und bestätige, dass sie richtig und vollständig sind.
              </Text>
            </Pressable>

            <View className="flex-row gap-2">
              <Pressable
                onPress={vorschauSchliessen}
                className="flex-1 items-center rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-4 py-2.5"
              >
                <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Bearbeiten</Text>
              </Pressable>
              <Pressable
                onPress={weiterZurUnterschrift}
                disabled={!geprueft}
                className={`flex-1 items-center rounded-full bg-db-red px-4 py-2.5 ${!geprueft ? 'opacity-40' : ''}`}
              >
                <Text className="text-sm font-semibold text-white">Bestätigt · weiter zur Unterschrift</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={signaturOffen} transparent animationType="fade" onRequestClose={() => setSignaturOffen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40 sm:items-center sm:justify-center" onPress={() => setSignaturOffen(false)}>
          <Pressable className="gap-4 rounded-t-2xl bg-white dark:bg-[#171C24] p-5 sm:w-full sm:max-w-md sm:rounded-2xl" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Unterschrift bestätigen</Text>
                <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
                  Woche {wochenLabel(ausgewaehlteWoche)} · {wocheEintraege.length} Einträge
                </Text>
              </View>
              <Pressable onPress={() => setSignaturOffen(false)}>
                <X size={18} color="#5C6670" />
              </Pressable>
            </View>

            <Pressable onPress={zurueckZurVorschau}>
              <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">← Nochmal zur Vorschau</Text>
            </Pressable>

            <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
              Mit deiner Unterschrift bestätigst du, dass die Angaben in diesem Ausbildungsnachweis richtig und
              vollständig sind.
              {profil.ausbilderEmail.trim()
                ? ` Danach öffnet sich eine vorausgefüllte E-Mail an ${profil.ausbilderEmail} mit der PDF als Anhang.`
                : ''}
            </Text>

            <SignaturePad onChange={setUnterschrift} />

            <Pressable
              onPress={signaturBestaetigen}
              disabled={!unterschrift || exportiert}
              className={`flex-row items-center justify-center gap-2 rounded-full bg-db-red px-4 py-3 ${
                !unterschrift ? 'opacity-50' : ''
              }`}
            >
              {exportiert ? <Loader2 size={16} color="#fff" /> : <Download size={16} color="#fff" />}
              <Text className="text-sm font-semibold text-white">Unterschreiben &amp; PDF erstellen</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
