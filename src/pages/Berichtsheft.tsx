import { CalendarCheck, ChevronLeft, ChevronRight, Download, Loader2, Pencil, Plus, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { BerichtStatusBadge } from '../components/Badges'
import SignaturePad from '../components/SignaturePad'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import { useBerichtsheft } from '../hooks/useBerichtsheft'
import type { BerichtsheftEintrag, BerichtsheftKategorie } from '../data/mock'
import {
  arbeitstageDerWoche,
  heuteISO,
  heutigesDatumLabel,
  wochenLabel,
  wochenSchluessel,
  wochenStartEnde,
  wocheVerschieben,
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
  return {
    id: `B-${Date.now()}`,
    datumISO,
    datum: datumLabelFuer(datumISO),
    kategorie: 'Betrieblich',
    taetigkeiten: '',
    stunden: 8,
    status: 'Entwurf',
  }
}

export default function Berichtsheft() {
  const { profil } = useAzubiProfil()
  const { eintraege, setEintraege } = useBerichtsheft()
  const [bearbeitung, setBearbeitung] = useState<BerichtsheftEintrag | null>(null)
  const [exportiert, setExportiert] = useState(false)
  const [signaturOffen, setSignaturOffen] = useState(false)
  const [unterschrift, setUnterschrift] = useState<string | null>(null)
  const [ausgewaehlteWoche, setAusgewaehlteWoche] = useState(() => wochenSchluessel(heuteISO()))

  const heute = heuteISO()
  const heutigerEintrag = eintraege.find((e) => e.datumISO === heute)
  const heuteSchluessel = wochenSchluessel(heute)
  const istAktuelleWoche = ausgewaehlteWoche === heuteSchluessel

  const stundenAktuelleWoche = useMemo(
    () => eintraege.filter((e) => wochenSchluessel(e.datumISO) === heuteSchluessel).reduce((sum, e) => sum + e.stunden, 0),
    [eintraege, heuteSchluessel],
  )
  const offeneEntwuerfe = eintraege.filter((e) => e.status === 'Entwurf' && e.taetigkeiten.trim()).length

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
  const erfassteTage = montagFreitag.filter((d) => eintraegeNachDatum.get(d)?.taetigkeiten.trim()).length
  const wocheVollstaendig = erfassteTage === montagFreitag.length

  const alleWochenMitEintraegen = useMemo(() => {
    const set = new Set(eintraege.map((e) => wochenSchluessel(e.datumISO)))
    set.add(ausgewaehlteWoche)
    return [...set].sort()
  }, [eintraege, ausgewaehlteWoche])

  if (!profil) return null

  const heuteBearbeiten = () => setBearbeitung(heutigerEintrag ?? neuerTageseintragFuer(heute))

  const speichern = () => {
    if (!bearbeitung || !bearbeitung.taetigkeiten.trim()) return
    setEintraege((prev) => [bearbeitung, ...prev.filter((e) => e.id !== bearbeitung.id)])
    setBearbeitung(null)
  }

  const einreichen = (id: string) => {
    setEintraege((prev) =>
      prev.map((e) => (e.id === id && e.taetigkeiten.trim() ? { ...e, status: 'Eingereicht' } : e)),
    )
  }

  const vorherigeWoche = () => setAusgewaehlteWoche((w) => wocheVerschieben(w, -1))
  const naechsteWoche = () => setAusgewaehlteWoche((w) => wocheVerschieben(w, 1))
  const zurAktuellenWoche = () => setAusgewaehlteWoche(heuteSchluessel)

  const touchStartX = useRef<number | null>(null)
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
    if (!profil) return
    setExportiert(true)
    try {
      const { exportBerichtsheftPdf } = await import('../lib/exportBerichtsheft')
      const { von, bis } = wochenStartEnde(ausgewaehlteWoche)
      const nr = String(alleWochenMitEintraegen.indexOf(ausgewaehlteWoche) + 1).padStart(3, '0')
      exportBerichtsheftPdf(profil, wocheEintraege, { nr, von, bis, unterschriftDataUrl })
    } finally {
      setExportiert(false)
    }
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

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-db-gray-200 bg-white p-4">
          <p className="text-2xl font-semibold text-db-navy">{stundenAktuelleWoche} Std.</p>
          <p className="text-xs text-db-navy-light">Erfasst diese Woche</p>
        </div>
        <div className="rounded-xl border border-db-gray-200 bg-white p-4">
          <p className={`text-2xl font-semibold ${offeneEntwuerfe > 0 ? 'text-db-red' : 'text-db-green'}`}>
            {offeneEntwuerfe}
          </p>
          <p className="text-xs text-db-navy-light">Noch nicht eingereicht</p>
        </div>
      </div>

      {bearbeitung && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setBearbeitung(null)}
        >
          <div className="w-full max-w-md space-y-3 rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
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
                      ? 'border-db-navy bg-db-navy text-white'
                      : 'border-db-gray-200 bg-white text-db-navy-light'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <textarea
              value={bearbeitung.taetigkeiten}
              onChange={(e) => setBearbeitung((d) => d && { ...d, taetigkeiten: e.target.value })}
              rows={4}
              placeholder="Welche Tätigkeiten hast du heute ausgeführt oder welche Lerninhalte hattest du?"
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
              className="w-full rounded-full bg-db-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-db-navy-light"
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-db-gray-200 bg-white text-db-navy-light hover:border-db-navy/30"
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-db-gray-200 bg-white text-db-navy-light hover:border-db-navy/30"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!istAktuelleWoche && (
            <button
              onClick={zurAktuellenWoche}
              className="rounded-full border border-db-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-db-navy hover:border-db-navy/30"
            >
              Zur aktuellen Woche
            </button>
          )}
          <button
            onClick={() => {
              setUnterschrift(null)
              setSignaturOffen(true)
            }}
            disabled={exportiert}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-db-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-db-navy hover:border-db-navy/30 disabled:opacity-60"
          >
            {exportiert ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
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
                  className="flex w-full items-center justify-between rounded-xl border border-dashed border-db-gray-200 bg-white p-4 text-left hover:border-db-red/40"
                >
                  <span className="text-sm font-medium text-db-navy-light">{datumLabelFuer(datumISO)}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-db-red">
                    <Plus size={13} /> Eintragen
                  </span>
                </button>
              )
            }
            return (
              <div key={e.id} className="rounded-xl border border-db-gray-200 bg-white p-4">
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
                <p className="mt-2 text-sm text-db-navy">
                  {e.taetigkeiten || <span className="italic text-db-navy-light">Noch keine Angaben</span>}
                </p>
                {e.ausbilderKommentar && (
                  <p className="mt-2 rounded-lg bg-db-gray-50 p-2 text-xs text-db-navy-light">
                    <span className="font-semibold text-db-navy">Ausbilder:</span> {e.ausbilderKommentar}
                  </p>
                )}
                {e.status === 'Entwurf' && e.taetigkeiten.trim() && (
                  <button
                    onClick={() => einreichen(e.id)}
                    className="mt-3 rounded-full bg-db-red px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-db-red-dark"
                  >
                    Zur Freigabe einreichen
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {signaturOffen && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setSignaturOffen(false)}
        >
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
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

            <p className="text-xs text-db-navy-light">
              Mit deiner Unterschrift bestätigst du, dass die Angaben in diesem Ausbildungsnachweis richtig und
              vollständig sind.
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
