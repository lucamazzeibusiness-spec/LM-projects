import { BadgeCheck, CalendarCheck, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, Loader2, Pencil, Plus, Square, X } from 'lucide-react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Dimensions, Modal, PanResponder, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { BerichtStatusBadge } from '../../components/Badges'
import GrammatikPruefung from '../../components/GrammatikPruefung'
import SignaturePad from '../../components/SignaturePad'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { useAusbildungsplan, type Wochenvorlage } from '../../context/AusbildungsplanContext'
import { berichtsheftStreak, usePunkte, vergebeneIds } from '../../context/PunkteContext'
import { useBerichtsheft } from '../../context/BerichtsheftContext'
import { ausbildungsnachweisVorschauHtml, exportBerichtsheftPdf } from '../../lib/exportBerichtsheft'
import { offeneNachweisWochen, type OffeneWoche, unterschriebeneWochen, wochenStatus } from '../../lib/unterschriften'
import { KRANKHEITSTAGE_GRENZE, KRANKHEITSTAGE_WARNUNG, krankheitstage } from '../../lib/fehlzeiten'
import { bulletEingabeVerarbeiten, haeufigeStichpunkte, hatEchtenInhalt, stichpunktAnhaengen } from '../../lib/stichpunkte'
import { feiertagAm } from '../../lib/feiertage'
import {
  arbeitstageDerWoche,
  datumAlsISO,
  ausbildungsjahrFuerWoche,
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
// Schnellauswahl für Tage ohne Ausbildungsinhalt – auch die gehören als Eintrag in den Nachweis.
const abwesenheiten = ['Urlaub', 'Krank', 'Feiertag']

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
    // An bundesweiten Feiertagen ist der Eintrag schon vorausgefüllt – nur noch speichern.
    taetigkeiten: feiertagAm(datumISO) ? '- Feiertag' : '',
    stunden: istFreitag ? 6 : 8,
    status: 'Entwurf',
  }
}

const offenLabel: Record<OffeneWoche['status'], { text: string; farbe: string }> = {
  leer: { text: 'Fehlt', farbe: 'text-db-red' },
  Entwurf: { text: 'Nicht eingereicht', farbe: 'text-db-amber' },
  Eingereicht: { text: 'Wartet auf Unterschrift', farbe: 'text-db-amber' },
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
  const [checkOffen, setCheckOffen] = useState(false)

  const heute = heuteISO()
  const heutigerEintrag = eintraege.find((e) => e.datumISO === heute)
  // Laut Ausbildungsplan freier Tag (standardmäßig Sa/So) oder bundesweiter Feiertag: Eintragen
  // geht, wird aber nicht angemahnt.
  const heuteFeiertag = feiertagAm(heute)
  const heuteFrei = !vorlage[wochentagIndexVon(heute)] || heuteFeiertag !== null
  const krankTage = krankheitstage(eintraege)
  const unterschriften = unterschriebeneWochen(eintraege)
  const jahrJetzt = heuteISO().slice(0, 4)

  // Eigene, oft verwendete Stichpunkte aus früheren Tagen (neueste zuerst) als Schnellauswahl.
  const fruehereTexte = useMemo(
    () =>
      [...eintraege]
        .filter((e) => e.id !== bearbeitung?.id)
        .sort((a, b) => b.datumISO.localeCompare(a.datumISO))
        .map((e) => e.taetigkeiten),
    [eintraege, bearbeitung?.id],
  )
  const vorschlaege = bearbeitung ? haeufigeStichpunkte(fruehereTexte, bearbeitung.taetigkeiten) : []
  const heuteSchluessel = wochenSchluessel(heute)
  const istAktuelleWoche = ausgewaehlteWoche === heuteSchluessel
  // Ungültige Eingaben (z. B. Tippfehler) gelten als nicht gesetzt – sonst würde die Nr. "NaN"
  // und die Wochennavigation ließe sich nicht mehr zurückblättern.
  const beginnISO = profil?.ausbildungsbeginn ? datumAlsISO(profil.ausbildungsbeginn) : null
  const offeneWochen = useMemo(() => offeneNachweisWochen(eintraege, beginnISO, heute), [eintraege, beginnISO, heute])
  const nachweisWochenGesamt = unterschriften.unterschrieben + offeneWochen.length
  const beginnSchluessel = beginnISO ? wochenSchluessel(beginnISO) : null
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

  const statusDerWoche = wochenStatus(wocheEintraege)
  const wocheStunden = wocheEintraege.reduce((sum, e) => sum + e.stunden, 0)
  const erfassteTage = montagFreitag.filter((d) => hatEchtenInhalt(eintraegeNachDatum.get(d)?.taetigkeiten ?? '')).length
  const wocheVollstaendig = erfassteTage === montagFreitag.length
  const fehlendeTage = montagFreitag.filter((d) => !hatEchtenInhalt(eintraegeNachDatum.get(d)?.taetigkeiten ?? ''))
  const fehlendeTageText = fehlendeTage
    .map((d) => new Date(`${d}T00:00:00`).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' }))
    .join(', ')

  const alleWochenMitEintraegen = useMemo(() => {
    const set = new Set(eintraege.map((e) => wochenSchluessel(e.datumISO)))
    set.add(ausgewaehlteWoche)
    return [...set].sort()
  }, [eintraege, ausgewaehlteWoche])

  const nachweisMeta = useMemo(() => {
    if (!profil) return null
    const { von, bis } = wochenStartEnde(ausgewaehlteWoche)
    const nrZahl = beginnISO
      ? wochenNummerSeit(beginnISO, ausgewaehlteWoche)
      : alleWochenMitEintraegen.indexOf(ausgewaehlteWoche) + 1
    const nr = String(Math.max(1, nrZahl)).padStart(3, '0')
    const jahr = Number(ausgewaehlteWoche.slice(0, 4))
    const ausbildungsjahr = ausbildungsjahrFuerWoche(
      profil.lehrjahr,
      profil.lehrjahreGesamt,
      beginnISO ?? '',
      ausgewaehlteWoche,
    )
    return { nr, von, bis, jahr, ausbildungsjahr }
  }, [profil, beginnISO, ausgewaehlteWoche, alleWochenMitEintraegen])

  // Der Ausbilder unterschreibt auf Papier oder per E-Mail – der Azubi hält das hier fest.
  const unterschriftSetzen = (unterschrieben: boolean) =>
    setEintraege((prev) =>
      prev.map((e) =>
        wochenSchluessel(e.datumISO) === ausgewaehlteWoche && hatEchtenInhalt(e.taetigkeiten)
          ? { ...e, status: unterschrieben ? ('Freigegeben' as const) : ('Eingereicht' as const) }
          : e,
      ),
    )

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

  const speichern = (unterschriftVerwerfen = false) => {
    if (!bearbeitung || !hatEchtenInhalt(bearbeitung.taetigkeiten)) return
    // Wird ein schon eingereichter Tag inhaltlich geändert, muss die Woche neu eingereicht werden.
    const vorher = eintraege.find((e) => e.id === bearbeitung.id)
    const geaendert =
      !vorher ||
      vorher.taetigkeiten !== bearbeitung.taetigkeiten ||
      vorher.stunden !== bearbeitung.stunden ||
      vorher.kategorie !== bearbeitung.kategorie
    if (geaendert && vorher?.status === 'Freigegeben' && !unterschriftVerwerfen) {
      Alert.alert(
        'Schon unterschrieben',
        'Dein Ausbilder hat diese Woche schon unterschrieben. Wenn du den Tag änderst, musst du die Woche neu unterschreiben lassen.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Trotzdem ändern', style: 'destructive', onPress: () => speichern(true) },
        ],
      )
      return
    }
    const gespeichert = geaendert ? { ...bearbeitung, status: 'Entwurf' as const } : bearbeitung
    setEintraege((prev) => [gespeichert, ...prev.filter((e) => e.id !== bearbeitung.id)])

    const ereignisId = `berichtsheft:${bearbeitung.datumISO}`
    const neueStreak = berichtsheftStreak([ereignisId, ...vergebeneIds(punkteStand)])
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
      // Nach dem Unterschreiben und Exportieren gilt die Woche als eingereicht.
      setEintraege((prev) =>
        prev.map((e) =>
          wochenSchluessel(e.datumISO) === ausgewaehlteWoche && e.status !== 'Freigegeben'
            ? { ...e, status: 'Eingereicht' as const }
            : e,
        ),
      )
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
          <Text
            className={`mt-1 text-xs font-medium ${
              krankTage >= KRANKHEITSTAGE_GRENZE
                ? 'text-db-red'
                : krankTage >= KRANKHEITSTAGE_WARNUNG
                  ? 'text-db-amber'
                  : 'text-db-navy-light dark:text-[#9AA4B0]'
            }`}
          >
            Krankheitstage insgesamt: {krankTage} von {KRANKHEITSTAGE_GRENZE}
          </Text>
          {nachweisWochenGesamt > 0 && (
            <View>
              <Pressable
                onPress={() => setCheckOffen((o) => !o)}
                disabled={offeneWochen.length === 0}
                className="flex-row items-center gap-1"
              >
                <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">
                  Vom Ausbilder unterschrieben: {unterschriften.unterschrieben} von {nachweisWochenGesamt} Wochen
                  {offeneWochen.length > 0 ? (
                    <Text className="text-db-amber"> · {offeneWochen.length} offen</Text>
                  ) : (
                    <Text className="text-db-green"> · alles vollständig</Text>
                  )}
                </Text>
                {offeneWochen.length > 0 && (
                  <View style={{ transform: [{ rotate: checkOffen ? '180deg' : '0deg' }] }}>
                    <ChevronDown size={13} color="#5C6670" />
                  </View>
                )}
              </Pressable>
              {checkOffen && offeneWochen.length > 0 && (
                <View className="mt-2 gap-0.5 rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-2">
                  <Text className="px-2 pb-1 text-xs text-db-navy-light dark:text-[#9AA4B0]">
                    Für die Prüfungsanmeldung muss jede Woche eingetragen und unterschrieben sein. Tipp auf eine Woche,
                    um sie zu öffnen.
                  </Text>
                  {offeneWochen.map((o) => (
                    <Pressable
                      key={o.woche}
                      onPress={() => {
                        setAusgewaehlteWoche(o.woche)
                        setCheckOffen(false)
                      }}
                      className="flex-row items-center justify-between gap-2 rounded-lg px-2 py-1.5"
                    >
                      <Text className="text-xs text-db-navy dark:text-[#EEF1F4]">
                        Woche {wochenLabel(o.woche)}
                        {o.woche.slice(0, 4) !== jahrJetzt && ` ${o.woche.slice(0, 4)}`}
                      </Text>
                      <Text className={`text-xs font-medium ${offenLabel[o.status].farbe}`}>{offenLabel[o.status].text}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        <Pressable
          onPress={heuteBearbeiten}
          className={`flex-row items-center justify-between rounded-xl border px-4 py-3.5 ${
            heutigerEintrag
              ? 'border-db-green/30 bg-db-green/5'
              : heuteFrei
                ? 'border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]'
                : 'border-db-red/30 bg-db-red/5'
          }`}
        >
          <View className="flex-row items-center gap-2">
            <CalendarCheck size={18} color={heutigerEintrag ? '#1E8A3C' : heuteFrei ? '#5C6670' : '#C40012'} />
            <Text
              className={`shrink text-sm font-semibold ${
                heutigerEintrag ? 'text-db-green' : heuteFrei ? 'text-db-navy-light dark:text-[#9AA4B0]' : 'text-db-red-dark'
              }`}
            >
              {heutigerEintrag
                ? `Heute schon erfasst (${heutigesDatumLabel()})`
                : heuteFrei
                  ? `${heuteFeiertag ?? 'Heute frei'} (${heutigesDatumLabel()}) – kein Eintrag nötig`
                  : `Heutigen Eintrag ausfüllen (${heutigesDatumLabel()})`}
            </Text>
          </View>
          {heutigerEintrag ? (
            <View className="flex-row items-center gap-1">
              <Pencil size={13} color="#5C6670" />
              <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Bearbeiten</Text>
            </View>
          ) : heuteFrei ? (
            <View className="flex-row items-center gap-1">
              <Plus size={13} color="#5C6670" />
              <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Trotzdem</Text>
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

          {statusDerWoche === 'Eingereicht' && (
            <View className="flex-row items-center justify-between gap-3 rounded-xl border border-db-amber/30 bg-db-amber/5 px-4 py-3">
              <Text className="flex-1 text-xs text-db-navy dark:text-[#EEF1F4]">
                Eingereicht – wartet auf die Unterschrift deines Ausbilders.
              </Text>
              <Pressable
                onPress={() => unterschriftSetzen(true)}
                className="flex-row items-center gap-1.5 rounded-full bg-db-green px-3 py-1.5"
              >
                <BadgeCheck size={14} color="#fff" />
                <Text className="text-xs font-semibold text-white">Ist unterschrieben</Text>
              </Pressable>
            </View>
          )}
          {statusDerWoche === 'Unterschrieben' && (
            <View className="flex-row items-center justify-between gap-3 rounded-xl border border-db-green/30 bg-db-green/5 px-4 py-3">
              <View className="flex-row items-center gap-1.5">
                <BadgeCheck size={15} color="#1E8A3C" />
                <Text className="text-xs font-semibold text-db-green">Vom Ausbilder unterschrieben</Text>
              </View>
              <Pressable onPress={() => unterschriftSetzen(false)}>
                <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Rückgängig</Text>
              </Pressable>
            </View>
          )}

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
                    <Text className="text-sm font-medium text-db-navy-light dark:text-[#9AA4B0]">
                      {datumLabelFuer(datumISO)}
                      {feiertagAm(datumISO) && ` · ${feiertagAm(datumISO)}`}
                    </Text>
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

              {!hatEchtenInhalt(bearbeitung.taetigkeiten) && (
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">Kein Ausbildungstag?</Text>
                  {abwesenheiten.map((a) => (
                    <Pressable
                      key={a}
                      onPress={() => {
                        setBearbeitung((d) => d && { ...d, taetigkeiten: `- ${a}` })
                        setTaetigkeitenAuswahl(undefined)
                      }}
                      className="rounded-full border border-dashed border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-3 py-1.5"
                    >
                      <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">{a}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

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
                spellCheck
                autoCorrect
                placeholder="Welche Tätigkeiten hast du heute ausgeführt oder welche Lerninhalte hattest du? Jede neue Zeile wird automatisch zum Stichpunkt."
                className="w-full rounded-lg border border-db-gray-200 dark:border-[#2A323D] px-3 py-2 text-sm text-db-navy dark:text-[#EEF1F4]"
                style={{ minHeight: 90, textAlignVertical: 'top' }}
              />

              {vorschlaege.length > 0 && (
                <View className="gap-1.5">
                  <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">Oft von dir eingetragen – antippen zum Übernehmen:</Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {vorschlaege.map((v) => (
                      <Pressable
                        key={v}
                        onPress={() => {
                          setBearbeitung((d) => d && { ...d, taetigkeiten: stichpunktAnhaengen(d.taetigkeiten, v) })
                          setTaetigkeitenAuswahl(undefined)
                        }}
                        className="flex-row items-center gap-1 rounded-full border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-2.5 py-1"
                      >
                        <Plus size={12} color="#5C6670" />
                        <Text className="text-xs text-db-navy dark:text-[#EEF1F4]">{v}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              <GrammatikPruefung
                text={bearbeitung.taetigkeiten}
                onTextChange={(t) => {
                  setBearbeitung((d) => d && { ...d, taetigkeiten: t })
                  setTaetigkeitenAuswahl(undefined)
                }}
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

              <Pressable onPress={() => speichern()} className="items-center rounded-full bg-db-navy px-4 py-2.5 dark:bg-[#3A4453]">
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

            {fehlendeTage.length > 0 && (
              <Text className="rounded-lg border border-db-amber/30 bg-db-amber/5 p-2.5 text-xs text-db-navy dark:text-[#EEF1F4]">
                <Text className="font-semibold text-db-amber">Noch leer: </Text>
                {fehlendeTageText}. Trag die Tage vor dem Unterschreiben ein – auch Urlaub, Krankheit oder Feiertag gehören als
                Eintrag in den Nachweis.
              </Text>
            )}

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
