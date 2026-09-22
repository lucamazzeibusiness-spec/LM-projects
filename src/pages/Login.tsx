import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { DB_LOGO_PNG } from '../lib/dbLogo'

function fehlerText(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Für diese E-Mail existiert bereits ein Konto. Versuch es mit „Anmelden".'
    case 'auth/invalid-email':
      return 'Diese E-Mail-Adresse sieht nicht gültig aus.'
    case 'auth/weak-password':
      return 'Das Passwort muss mindestens 6 Zeichen lang sein.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-Mail oder Passwort stimmt nicht.'
    case 'auth/too-many-requests':
      return 'Zu viele Versuche. Bitte kurz warten und nochmal probieren.'
    case 'auth/network-request-failed':
      return 'Keine Verbindung. Prüf dein Internet und versuch es nochmal.'
    default:
      return 'Etwas ist schiefgelaufen. Bitte nochmal versuchen.'
  }
}

export default function Login() {
  const { registrieren, anmelden } = useAuth()
  const [modus, setModus] = useState<'anmelden' | 'registrieren'>('anmelden')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [ladt, setLadt] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault()
    setFehler(null)
    setLadt(true)
    try {
      if (modus === 'registrieren') {
        await registrieren(name, email, passwort)
      } else {
        await anmelden(email, passwort)
      }
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? String(err.code) : ''
      setFehler(fehlerText(code))
    } finally {
      setLadt(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-db-gray-50 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={DB_LOGO_PNG} alt="DB" className="h-12 w-auto" />
          <div>
            <p className="text-lg font-bold text-db-navy">Azubi</p>
            <p className="text-sm text-db-navy-light">
              {modus === 'registrieren' ? 'Erstell dein Konto, um loszulegen' : 'Melde dich an, um weiterzumachen'}
            </p>
          </div>
        </div>

        <form onSubmit={absenden} className="space-y-3 rounded-xl border border-db-gray-200 bg-db-surface p-5">
          {modus === 'registrieren' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-db-navy-light">Wie heißt du?</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Max"
                autoComplete="name"
                className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-db-navy-light">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="max@beispiel.de"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-db-navy-light">Passwort</label>
            <input
              type="password"
              value={passwort}
              onChange={(e) => setPasswort(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              autoComplete={modus === 'registrieren' ? 'new-password' : 'current-password'}
              minLength={6}
              required
              className="w-full rounded-lg border border-db-gray-200 px-3 py-2.5 text-sm text-db-navy outline-none focus:border-db-red"
            />
          </div>

          {fehler && <p className="rounded-lg bg-db-red/5 px-3 py-2 text-xs text-db-red-dark">{fehler}</p>}

          <button
            type="submit"
            disabled={ladt}
            className="w-full rounded-full bg-db-red px-4 py-3 text-sm font-semibold text-white hover:bg-db-red-dark disabled:opacity-50"
          >
            {ladt ? 'Einen Moment …' : modus === 'registrieren' ? 'Konto erstellen' : 'Anmelden'}
          </button>
        </form>

        <button
          onClick={() => {
            setFehler(null)
            setModus((m) => (m === 'anmelden' ? 'registrieren' : 'anmelden'))
          }}
          className="mt-4 w-full text-center text-xs font-medium text-db-navy-light hover:text-db-navy"
        >
          {modus === 'anmelden' ? 'Noch kein Konto? Jetzt registrieren' : 'Schon ein Konto? Hier anmelden'}
        </button>
      </div>
    </div>
  )
}
