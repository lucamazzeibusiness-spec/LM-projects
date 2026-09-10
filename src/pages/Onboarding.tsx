import { ChevronLeft, GraduationCap } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  azubiProfilBeispiel,
  curricula,
  lehrjahreGesamtFuer,
  type AusbildungsberufName,
  type AzubiProfil,
} from '../data/mock'
import { useAzubiProfil } from '../context/AzubiProfilContext'

const ausbildungsberufe: AusbildungsberufName[] = curricula.map((c) => c.beruf)

export default function Onboarding() {
  const { profil, profilSpeichern } = useAzubiProfil()
  const navigate = useNavigate()
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
  const fertig = () => {
    profilSpeichern(entwurf)
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-db-gray-50">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-db-red text-white">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-db-navy">DB Azubi</p>
            <p className="text-xs text-db-navy-light">Kurz einrichten, dann geht's los</p>
          </div>
        </div>

        <div className="mb-6 flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= schritt ? 'bg-db-red' : 'bg-db-gray-200'}`} />
          ))}
        </div>

        <div className="flex-1 space-y-4">
          {schritt === 1 && (
            <>
              <div>
                <h1 className="text-lg font-semibold text-db-navy">Wer bist du?</h1>
                <p className="text-sm text-db-navy-light">Und wo arbeitest du, welchen Beruf lernst du?</p>
              </div>

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
            </>
          )}

          {schritt === 2 && (
            <>
              <div>
                <h1 className="text-lg font-semibold text-db-navy">Lehrjahr</h1>
                <p className="text-sm text-db-navy-light">
                  In welchem Ausbildungsjahr bist du gerade? ({entwurf.ausbildungsberuf}, insgesamt{' '}
                  {entwurf.lehrjahreGesamt} Jahre)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
            </>
          )}

          {schritt === 3 && (
            <>
              <div>
                <h1 className="text-lg font-semibold text-db-navy">Abteilung & Werk</h1>
                <p className="text-sm text-db-navy-light">Wo genau bist du eingesetzt?</p>
              </div>

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
            </>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2">
          {schritt > 1 && (
            <button
              onClick={zurueck}
              className="flex items-center gap-1 rounded-full border border-db-gray-200 bg-white px-4 py-3 text-sm font-semibold text-db-navy hover:border-db-navy/30"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {schritt < 3 ? (
            <button
              onClick={weiter}
              disabled={schritt === 1 ? !schritt1Ok : !schritt2Ok}
              className="flex-1 rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark disabled:opacity-40"
            >
              Weiter
            </button>
          ) : (
            <button
              onClick={fertig}
              disabled={!schritt3Ok}
              className="flex-1 rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark disabled:opacity-40"
            >
              Los geht's
            </button>
          )}
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
