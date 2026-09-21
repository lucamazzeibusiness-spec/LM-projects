import { ArrowRight, Bell, BellOff, CalendarCheck, ClipboardCheck, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GewerkBadge, PrioBadge, StatusBadge } from '../components/Badges'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import { useAusbildungsplan } from '../hooks/useAusbildungsplan'
import { useBerichtsheft } from '../hooks/useBerichtsheft'
import {
  erinnerungAktivieren,
  erinnerungDeaktivieren,
  erinnerungIstAktiv,
  erinnerungWirdUnterstuetzt,
  heuteErinnern,
} from '../lib/erinnerung'
import { aktuelleWochentage, heuteISO, heutigerWochentagIndex } from '../lib/wochen'
import { lernaufgaben, naechstePruefung, type AusbildungsblockTyp } from '../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  Berufsschule: 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  'DB Training': 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
}

export default function Dashboard() {
  const { profil } = useAzubiProfil()
  const { eintraege } = useBerichtsheft()
  const { vorlage } = useAusbildungsplan()
  const [erinnerungAn, setErinnerungAn] = useState(erinnerungIstAktiv)

  const heutigerEintrag = eintraege.find((e) => e.datumISO === heuteISO())

  useEffect(() => {
    if (!heutigerEintrag) heuteErinnern('Dein Berichtsheft-Eintrag für heute fehlt noch.')
  }, [heutigerEintrag])

  if (!profil) return null

  const offen = lernaufgaben.filter((a) => a.status !== 'Erledigt')
  const heute = offen.filter((a) => a.faelligkeit.startsWith('Heute'))
  const andereOffeneEntwuerfe = eintraege.filter(
    (e) => e.status === 'Entwurf' && e.taetigkeiten.trim() && e.datumISO !== heuteISO(),
  ).length

  const heuteIndex = heutigerWochentagIndex()
  const heutigerBlock = vorlage[heuteIndex]
  const heutigerTag = aktuelleWochentage()[heuteIndex]

  const stats = [
    { label: 'Offene Aufgaben', value: offen.length, icon: ClipboardCheck, tone: 'text-db-red' },
    { label: `Tage bis ${naechstePruefung.titel}`, value: naechstePruefung.tageVerbleibend, icon: GraduationCap, tone: 'text-db-navy' },
  ]

  const erinnerungUmschalten = async () => {
    if (erinnerungAn) {
      erinnerungDeaktivieren()
      setErinnerungAn(false)
    } else {
      const ok = await erinnerungAktivieren()
      setErinnerungAn(ok)
      if (ok && !heutigerEintrag) heuteErinnern('Dein Berichtsheft-Eintrag für heute fehlt noch.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Guten Tag, {profil.name}</h1>
        <p className="text-sm text-db-navy-light">
          {profil.lehrjahr}. Lehrjahr · {profil.abteilung}
          {profil.ausbilder ? ` · Ausbilder: ${profil.ausbilder}` : ''}
        </p>
      </div>

      <div className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-db-navy">Dein Tag heute</h2>
          <span className="text-xs text-db-navy-light">
            {heutigerTag.tag}, {heutigerTag.datum}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {heutigerBlock ? (
            <>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${typStyle[heutigerBlock.typ]}`}>
                {heutigerBlock.typ}
              </span>
              <span className="truncate text-sm text-db-navy">{heutigerBlock.thema}</span>
            </>
          ) : (
            <span className="text-sm italic text-db-navy-light">Kein Ausbildungsplan-Eintrag für heute</span>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-db-gray-100 pt-3">
          <Link
            to="/berichtsheft"
            className={`flex items-center justify-between text-sm ${heutigerEintrag ? 'text-db-green' : 'font-semibold text-db-red'}`}
          >
            <span className="flex items-center gap-1.5">
              <CalendarCheck size={15} />
              {heutigerEintrag ? 'Berichtsheft heute eingetragen' : 'Berichtsheft-Eintrag fehlt noch'}
            </span>
            <ArrowRight size={14} />
          </Link>
          {heute.length > 0 && (
            <Link to="/lernaufgaben" className="flex items-center justify-between text-sm text-db-navy">
              <span className="flex items-center gap-1.5">
                <ClipboardCheck size={15} className="text-db-amber" />
                {heute.length} {heute.length === 1 ? 'Aufgabe' : 'Aufgaben'} heute fällig
              </span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-db-gray-200 bg-db-surface p-4">
            <Icon size={18} className={tone} />
            <p className="mt-2 text-2xl font-semibold text-db-navy">{value}</p>
            <p className="text-xs text-db-navy-light">{label}</p>
          </div>
        ))}
      </div>

      {erinnerungWirdUnterstuetzt() && (
        <button
          onClick={erinnerungUmschalten}
          className="flex w-full items-center justify-between rounded-xl border border-db-gray-200 bg-db-surface px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm text-db-navy">
            {erinnerungAn ? <Bell size={16} className="text-db-green" /> : <BellOff size={16} className="text-db-navy-light" />}
            {erinnerungAn ? 'Tägliche Erinnerung aktiv' : 'Tägliche Erinnerung aktivieren'}
          </span>
          <span className="text-xs font-medium text-db-red">{erinnerungAn ? 'Deaktivieren' : 'Aktivieren'}</span>
        </button>
      )}

      {andereOffeneEntwuerfe > 0 && (
        <Link
          to="/berichtsheft"
          className="flex items-center justify-between rounded-xl border border-db-amber/30 bg-db-amber/5 px-4 py-3 text-sm font-medium text-db-amber"
        >
          <span>
            {andereOffeneEntwuerfe} älterer Berichtsheft-Eintrag {andereOffeneEntwuerfe === 1 ? 'wartet' : 'warten'}{' '}
            noch auf Einreichung
          </span>
          <ArrowRight size={16} />
        </Link>
      )}

      <div className="rounded-xl border border-db-gray-200 bg-db-surface">
        <div className="flex items-center justify-between border-b border-db-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-db-navy">Nächste Aufgaben</h2>
          <Link to="/lernaufgaben" className="flex items-center gap-1 text-xs font-medium text-db-red hover:underline">
            Alle ansehen <ArrowRight size={14} />
          </Link>
        </div>
        <ul className="divide-y divide-db-gray-100">
          {offen.slice(0, 4).map((a) => (
            <li key={a.id}>
              <Link
                to={`/lernaufgaben/${a.id}`}
                className="flex flex-col gap-2 px-4 py-3 hover:bg-db-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-db-navy">{a.titel}</p>
                  <p className="text-xs text-db-navy-light">
                    {a.anlage} · {a.ort} · fällig {a.faelligkeit}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <GewerkBadge gewerk={a.gewerk} />
                  <PrioBadge prioritaet={a.prioritaet} />
                  <StatusBadge status={a.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
