import { CalendarCheck, ChevronLeft, ChevronRight, Download, Eye, Loader2, Pencil, Plus, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { BerichtStatusBadge } from '../components/Badges'
import SignaturePad from '../components/SignaturePad'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import { useBerichtsheft } from '../context/BerichtsheftContext'
import { berichtsheftStreak, usePunkte } from '../context/PunkteContext'
import type { BerichtsheftEintrag, BerichtsheftKategorie } from '../data/mock'
import { bulletEingabeVerarbeiten, hatEchtenInhalt } from '../lib/stichpunkte'
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
} from '../lib/wochen'

const kategorien: BerichtsheftKategorie[] = ['Betrieblich', 'Berufsschule', 'DB Training']

function datumLabelFuer(datumISO: string): string {
  return new Date(`${datumISO}T00:00:00`).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  })
}

function neuerTageseintragFuer(datumISO: string): BerichtsheftEintrag {
  const istFreitag = wochentagIndexVon(datumISO) === 4
  return {
    id: `B-${Date.now()}`,
    datumISO,
    datum: datumLabelFuer(datumISO),
    kategorie: 'Betrieblich',
    taetigkeiten: '',
    stunden: istFreitag ? 6 : 8,
    status: 'Entwurf',
  }
}

export default function Berichtsheft() {
  const { profil } = useAzubiProfil()
  const { eintraege, setEintraege } = useBerichtsheft()
  const { punkteVergeben, stand: punkteStand } = usePunkte()
  const [bearbeitung, setBearbeitung] = useState<BerichtsheftEintrag | null>(null)
  const [exportiert, setExportiert] = useState(false)
  const [vorschauUrl, setVorschauUrl] = useState<string | null>(null)
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

  const touchStartX = useRef<number | null>(null)

  if (!profil) return null

  const heuteBearbeiten = () => setBearbeitung(heutigerEintrag ?? neuerTageseintragFuer(heute))

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

  const vorherigeWoche = () =>
    setAusgewaehlteWoche((w) => {
      const ziel = wocheVerschieben(w, -1)
      if (beginnSchluessel && ziel < beginnSchluessel) return w
      return ziel
    })
  const naechsteWoche = () => setAusgewaehlteWoche((w) => wocheVerschieben(w, 1))
  const zurAktuellenWoche = () => setAusgewaehlteWoche(heuteSchluessel)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) vorherigeWoche()
      else naechsteWoche()
    }
    touchStartX.current = null
  }

  const wocheExportieren = async (unterschriftDataUrl: string) => {
    if (!profil || !nachweisMeta) return
    setExportiert(true)
    try {
      const { exportBerichtsheftPdf } = await import('../lib/exportBerichtsheft')
      const betreff = await exportBerichtsheftPdf(profil, wocheEintraege, { ...nachweisMeta, unterschriftDataUrl })
      if (profil.ausbilderEmail.trim()) {
        window.location.href = `mailto:${encodeURIComponent(profil.ausbilderEmail.trim())}?subject=${encodeURIComponent(betreff)}`
      }
    } finally {
      setExportiert(false)
    }
  }

  const vorschauSchliessen = () => {
    if (vorschauUrl) URL.revokeObjectURL(vorschauUrl)
    setVorschauUrl(null)
  }

  const vorschauOeffnen = async () => {
    if (!profil || !nachweisMeta) return
    const { ausbildungsnachweisVorschauUrl } = await import('../lib/exportBerichtsheft')
    if (vorschauUrl) URL.revokeObjectURL(vorschauUrl)
    setGeprueft(false)
    setVorschauUrl(ausbildungsnachweisVorschauUrl(profil, wocheEintraege, nachweisMeta))
  }

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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Berichtsheft</h1>
        <p className="text-sm text-db-navy-light">
          Trag jeden Tag kurz ein, was du gemacht hast – am Ende der Woche fasst die App das automatisch zu deinem
          Wochenbericht zusammen.
        </p>
      </div>

      {!heutigerEintrag ? (
        <button
          onClick={heuteBearbeiten}
          className="flex w-full items-center justify-between rounded-xl border border-db-red/30 bg-db-red/5 px-4 py-3.5 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-db-red-dark">
            <CalendarCheck size={18} /> Heutigen Eintrag ausfüllen ({heutigesDatumLabel()})
          </span>
          <span className="rounded-full bg-db-red px-3 py-1.5 text-xs font-semibold text-white">Jetzt</span>
        </button>
      ) : (
        <button
          onClick={heuteBearbeiten}
          className="flex w-full items-center justify-between rounded-xl border border-db-green/30 bg-db-green/5 px-4 py-3.5 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-db-green">
            <CalendarCheck size={18} /> Heute schon erfasst ({heutigesDatumLabel()})
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-db-navy-light">
            <Pencil size={13} /> Bearbeiten
          </span>
        </button>
      )}

      {bearbeitung && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setBearbeitung(null)}
        >
          <div className="w-full max-w-md space-y-3 rounded-2xl bg-db-surface p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-db-navy">Eintrag · {bearbeitung.datum}</p>
              <button onClick={() => setBearbeitung(null)} className="text-db-navy-light hover:text-db-navy">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {kategorien.map((k) => (
                <button
                  key={k}
                  onClick={() => setBearbeitung((d) => d && { ...d, kategorie: k })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    bearbeitung.kategorie === k
                      ? 'border-db-ink bg-db-ink text-white'
                      : 'border-db-gray-200 bg-db-surface text-db-navy-light'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <textarea
              value={bearbeitung.taetigkeiten}
              onChange={(e) => {
                const el = e.target
                const { wert, cursor } = bulletEingabeVerarbeiten(bearbeitung.taetigkeiten, el.value)
                if (cursor !== null) {
                  // Synchron setzen (nicht erst im nächsten Frame), sonst überholt ein schnell
                  // getipptes nächstes Zeichen die Korrektur und landet an der falschen Stelle.
                  el.value = wert
                  el.selectionStart = el.selectionEnd = cursor
                }
                setBearbeitung((d) => d && { ...d, taetigkeiten: wert })
              }}
              rows={4}
              placeholder="Welche Tätigkeiten hast du heute ausgeführt oder welche Lerninhalte hattest du? Jede neue Zeile wird automatisch zum Stichpunkt."
              className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy outline-none focus:border-db-red"
            />

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-db-navy-light">Stunden</label>
              <input
                type="number"
                min={0}
                max={12}
                step={0.5}
                value={bearbeitung.stunden}
                onChange={(e) => setBearbeitung((d) => d && { ...d, stunden: Number(e.target.value) })}
                className="w-20 rounded-lg border border-db-gray-200 px-2 py-1.5 text-sm text-db-navy outline-none focus:border-db-red"
              />
            </div>

            <button
              onClick={speichern}
              className="w-full rounded-full bg-db-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-db-ink-light"
            >
              Speichern
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3" data-testid="wochen-swipe" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="flex items-center justify-between gap-2 px-1">
          <button
            onClick={vorherigeWoche}
            disabled={!kannZurueck}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-db-gray-200 bg-db-surface text-db-navy-light hover:border-db-navy/30 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-sm font-semibold text-db-navy">
              Woche {wochenLabel(ausgewaehlteWoche)}
              {istAktuelleWoche && <span className="ml-1.5 text-xs font-medium text-db-red">· aktuell</span>}
            </p>
            <p className="text-xs text-db-navy-light">
              {erfassteTage}/{montagFreitag.length} Tage erfasst · {wocheStunden} Std. ·{' '}
              <span className={wocheVollstaendig ? 'text-db-green' : 'text-db-amber'}>
                {wocheVollstaendig ? 'vollständig' : 'in Bearbeitung'}
              </span>
            </p>
          </div>

          <button
            onClick={naechsteWoche}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-db-gray-200 bg-db-surface text-db-navy-light hover:border-db-navy/30"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!istAktuelleWoche && (
            <button
              onClick={zurAktuellenWoche}
              className="rounded-full border border-db-gray-200 bg-db-surface px-3 py-1.5 text-xs font-semibold text-db-navy hover:border-db-navy/30"
            >
              Zur aktuellen Woche
            </button>
          )}
          <button
            onClick={vorschauOeffnen}
            disabled={exportiert}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-db-gray-200 bg-db-surface px-3 py-1.5 text-xs font-semibold text-db-navy hover:border-db-navy/30 disabled:opacity-60"
          >
            {exportiert ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            Ausbildungsnachweis
          </button>
        </div>

        <div className="space-y-3">
          {anzeigeTage.map((datumISO) => {
            const e = eintraegeNachDatum.get(datumISO)
            if (!e) {
              return (
                <button
                  key={datumISO}
                  onClick={() => setBearbeitung(neuerTageseintragFuer(datumISO))}
                  className="flex w-full items-center justify-between rounded-xl border border-dashed border-db-gray-200 bg-db-surface p-4 text-left hover:border-db-red/40"
                >
                  <span className="text-sm font-medium text-db-navy-light">{datumLabelFuer(datumISO)}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-db-red">
                    <Plus size={13} /> Eintragen
                  </span>
                </button>
              )
            }
            return (
              <div key={e.id} className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-db-navy">{e.datum}</p>
                    <p className="text-xs text-db-navy-light">
                      {e.kategorie} · {e.stunden} Std.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BerichtStatusBadge status={e.status} />
                    <button
                      onClick={() => setBearbeitung(e)}
                      title="Eintrag bearbeiten"
                      className="text-db-navy-light hover:text-db-red"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-db-navy">
                  {e.taetigkeiten || <span className="italic text-db-navy-light">Noch keine Angaben</span>}
                </p>
                {e.ausbilderKommentar && (
                  <p className="mt-2 rounded-lg bg-db-gray-50 p-2 text-xs text-db-navy-light">
                    <span className="font-semibold text-db-navy">Ausbilder:</span> {e.ausbilderKommentar}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {vorschauUrl && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={vorschauSchliessen}
        >
          <div
            className="flex max-h-full w-full max-w-2xl flex-col space-y-3 rounded-2xl bg-db-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-db-navy">Vorschau · Ausbildungsnachweis</p>
                <p className="text-xs text-db-navy-light">
                  Woche {wochenLabel(ausgewaehlteWoche)} · {wocheEintraege.length} Einträge – noch ohne Unterschrift
                </p>
              </div>
              <button onClick={vorschauSchliessen} className="text-db-navy-light hover:text-db-navy">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-db-navy-light">
              Prüf die Angaben in Ruhe. Passt noch was nicht, schließ die Vorschau, korrigier den Tageseintrag über
              den Stift und öffne die Vorschau erneut.
            </p>

            <iframe title="Ausbildungsnachweis-Vorschau" src={vorschauUrl} className="h-[60vh] w-full rounded-lg border border-db-gray-200 sm:h-[65vh]" />

            <label className="flex items-start gap-2 text-xs text-db-navy-light">
              <input
                type="checkbox"
                checked={geprueft}
                onChange={(e) => setGeprueft(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-db-red"
              />
              Ich habe die Angaben geprüft und bestätige, dass sie richtig und vollständig sind.
            </label>

            <div className="flex gap-2">
              <button
                onClick={vorschauSchliessen}
                className="flex-1 rounded-full border border-db-gray-200 bg-db-surface px-4 py-2.5 text-sm font-semibold text-db-navy hover:border-db-navy/30"
              >
                Bearbeiten
              </button>
              <button
                onClick={weiterZurUnterschrift}
                disabled={!geprueft}
                className="flex-1 rounded-full bg-db-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-db-red-dark disabled:opacity-40"
              >
                Bestätigt · weiter zur Unterschrift
              </button>
            </div>
          </div>
        </div>
      )}

      {signaturOffen && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setSignaturOffen(false)}
        >
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-db-surface p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-db-navy">Unterschrift bestätigen</p>
                <p className="text-xs text-db-navy-light">
                  Woche {wochenLabel(ausgewaehlteWoche)} · {wocheEintraege.length} Einträge
                </p>
              </div>
              <button onClick={() => setSignaturOffen(false)} className="text-db-navy-light hover:text-db-navy">
                <X size={18} />
              </button>
            </div>

            <button onClick={zurueckZurVorschau} className="text-xs font-medium text-db-navy-light hover:text-db-navy">
              ← Nochmal zur Vorschau
            </button>

            <p className="text-xs text-db-navy-light">
              Mit deiner Unterschrift bestätigst du, dass die Angaben in diesem Ausbildungsnachweis richtig und
              vollständig sind.
              {profil?.ausbilderEmail.trim() && (
                <>
                  {' '}
                  Danach öffnet sich deine Mail-App mit vorausgefülltem Betreff an {profil.ausbilderEmail} – die PDF
                  musst du dort noch manuell anhängen.
                </>
              )}
            </p>

            <SignaturePad onChange={setUnterschrift} />

            <button
              onClick={signaturBestaetigen}
              disabled={!unterschrift || exportiert}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark disabled:opacity-50"
            >
              {exportiert ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Unterschreiben &amp; PDF erstellen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
