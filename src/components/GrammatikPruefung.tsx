import { Check, Loader2, SpellCheck, X } from 'lucide-react'
import { useState } from 'react'
import { textPruefen, vorschlagAnwenden, type GrammatikFund } from '../lib/grammatik'
import { hatEchtenInhalt } from '../lib/stichpunkte'

interface GrammatikPruefungProps {
  text: string
  onTextChange: (text: string) => void
}

export default function GrammatikPruefung({ text, onTextChange }: GrammatikPruefungProps) {
  const [funde, setFunde] = useState<GrammatikFund[] | null>(null)
  const [geprueft, setGeprueft] = useState<string | null>(null)
  const [laedt, setLaedt] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  // Tippt man nach der Prüfung weiter, passen die Positionen der Funde nicht mehr –
  // dann werden die Ergebnisse verworfen statt an der falschen Stelle zu korrigieren.
  const veraltet = geprueft !== null && geprueft !== text
  const sichtbareFunde = veraltet ? null : funde

  const pruefen = async () => {
    setLaedt(true)
    setFehler(null)
    try {
      setFunde(await textPruefen(text))
      setGeprueft(text)
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Die Prüfung hat gerade nicht geklappt.')
      setFunde(null)
    } finally {
      setLaedt(false)
    }
  }

  const anwenden = (fund: GrammatikFund, ersatz: string) => {
    if (!funde) return
    const ergebnis = vorschlagAnwenden(text, funde, fund, ersatz)
    setFunde(ergebnis.funde)
    setGeprueft(ergebnis.text)
    onTextChange(ergebnis.text)
  }

  const ignorieren = (fund: GrammatikFund) => setFunde((f) => f && f.filter((x) => x.id !== fund.id))

  return (
    <div className="space-y-2">
      <button
        onClick={pruefen}
        disabled={laedt || !hatEchtenInhalt(text)}
        className="flex items-center gap-1.5 rounded-full border border-db-gray-200 bg-db-surface px-3 py-1.5 text-xs font-semibold text-db-navy hover:border-db-navy/30 disabled:opacity-40"
      >
        {laedt ? <Loader2 size={14} className="animate-spin" /> : <SpellCheck size={14} />}
        Rechtschreibung &amp; Grammatik prüfen
      </button>

      {fehler && <p className="text-xs text-db-red">{fehler}</p>}

      {sichtbareFunde && sichtbareFunde.length === 0 && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-db-green">
          <Check size={14} /> Keine Fehler gefunden
        </p>
      )}

      {sichtbareFunde && sichtbareFunde.length > 0 && (
        <ul className="space-y-2">
          {sichtbareFunde.map((fund) => (
            <li key={fund.id} className="rounded-lg border border-db-amber/30 bg-db-amber/5 p-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-db-navy">
                  <span className="font-semibold text-db-red line-through">{fund.fehlerText || '␣'}</span>
                  <span className="text-db-navy-light"> – {fund.meldung}</span>
                </p>
                <button
                  onClick={() => ignorieren(fund)}
                  aria-label="Ignorieren"
                  className="shrink-0 text-db-navy-light hover:text-db-navy"
                >
                  <X size={14} />
                </button>
              </div>
              {fund.vorschlaege.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {fund.vorschlaege.map((v) => (
                    <button
                      key={v}
                      onClick={() => anwenden(fund, v)}
                      className="rounded-full bg-db-green/10 px-2.5 py-1 text-xs font-semibold text-db-green hover:bg-db-green/20"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] text-db-navy-light">Prüfung über LanguageTool – der Text wird dafür kurz an languagetool.org gesendet.</p>
    </div>
  )
}
