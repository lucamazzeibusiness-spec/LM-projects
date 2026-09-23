import { Check, ChevronLeft } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { curricula, lehrjahreGesamtFuer, type AusbildungsberufName, type AzubiProfil } from '../data/mock'
import { useAzubiProfil } from '../context/AzubiProfilContext'

const ausbildungsberufe: AusbildungsberufName[] = curricula.map((c) => c.beruf)

export default function ProfilBearbeiten() {
  const { profil, profilSpeichern } = useAzubiProfil()
  const navigate = useNavigate()
  const [entwurf, setEntwurf] = useState<AzubiProfil>(profil!)
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
    profilSpeichern(entwurf)
    setGespeichert(true)
    setTimeout(() => navigate('/'), 600)
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-db-gray-200 bg-db-surface text-db-navy hover:border-db-navy/30"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-db-navy">Profil bearbeiten</h1>
          <p className="text-sm text-db-navy-light">Änderungen werden erst mit „Speichern“ übernommen</p>
        </div>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4 space-y-4">
        <h2 className="text-sm font-semibold text-db-navy">Wer bist du?</h2>

        <Feld label="Wie heißt du?">
          <input
            value={entwurf.name}
            onChange={(e) => aktualisieren('name', e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </Feld>

        <Feld label="Wo arbeitest du? (Unternehmensbereich)">
          <input
            value={entwurf.unternehmensbereich}
            onChange={(e) => aktualisieren('unternehmensbereich', e.target.value)}
            placeholder="z. B. DB Fahrzeuginstandhaltung"
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </Feld>

        <Feld label="Was ist dein Ausbildungsberuf?">
          <div className="space-y-2">
            {ausbildungsberufe.map((beruf) => (
              <button
                key={beruf}
                onClick={() => aktualisieren('ausbildungsberuf', beruf)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  entwurf.ausbildungsberuf === beruf
                    ? 'border-db-red bg-db-red/5 text-db-red-dark'
                    : 'border-db-gray-200 text-db-navy hover:border-db-navy/30'
                }`}
              >
                {beruf}
              </button>
            ))}
          </div>
        </Feld>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4 space-y-4">
        <h2 className="text-sm font-semibold text-db-navy">Lehrjahr</h2>
        <p className="text-xs text-db-navy-light">
          {entwurf.ausbildungsberuf}, insgesamt {entwurf.lehrjahreGesamt} Jahre
        </p>

        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: entwurf.lehrjahreGesamt }, (_, i) => i + 1).map((jahr) => (
            <button
              key={jahr}
              onClick={() => aktualisieren('lehrjahr', jahr)}
              className={`rounded-xl border px-4 py-4 text-center transition-colors ${
                entwurf.lehrjahr === jahr
                  ? 'border-db-red bg-db-red/5 text-db-red-dark'
                  : 'border-db-gray-200 text-db-navy hover:border-db-navy/30'
              }`}
            >
              <span className="text-2xl font-bold">{jahr}</span>
              <p className="text-xs">. Lehrjahr</p>
            </button>
          ))}
        </div>

        <Feld label="Ausbildungsbeginn (für die Nummerierung im Ausbildungsnachweis)">
          <input
            type="date"
            value={entwurf.ausbildungsbeginn}
            onChange={(e) => aktualisieren('ausbildungsbeginn', e.target.value)}
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </Feld>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4 space-y-4">
        <h2 className="text-sm font-semibold text-db-navy">Abteilung &amp; Werk</h2>

        <Feld label="Abteilung">
          <input
            value={entwurf.abteilung}
            onChange={(e) => aktualisieren('abteilung', e.target.value)}
            placeholder="z. B. Fahrzeuginstandhaltung – Elektrik"
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </Feld>

        <Feld label="Werk / Standort">
          <input
            value={entwurf.werk}
            onChange={(e) => aktualisieren('werk', e.target.value)}
            placeholder="z. B. Werk Rummelsburg"
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </Feld>

        <Feld label="Ausbilder/-in (optional)">
          <input
            value={entwurf.ausbilder}
            onChange={(e) => aktualisieren('ausbilder', e.target.value)}
            placeholder="z. B. Herr Kowalski"
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </Feld>

        <Feld label="E-Mail für die Abgabe des Ausbildungsnachweises (optional)">
          <input
            type="email"
            value={entwurf.ausbilderEmail}
            onChange={(e) => aktualisieren('ausbilderEmail', e.target.value)}
            placeholder="z. B. Ausbildungswerkstatt.Musterstadt@deutschebahn.com"
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
          />
        </Feld>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-db-gray-200 bg-db-surface px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:sticky md:bottom-0 md:rounded-xl md:border md:px-4">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={speichern}
            disabled={!formularOk || gespeichert}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark disabled:opacity-40 md:w-auto md:px-8"
          >
            {gespeichert ? (
              <>
                <Check size={16} /> Gespeichert
              </>
            ) : (
              'Speichern'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function Feld({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-db-navy-light">{label}</label>
      {children}
    </div>
  )
}
