import { AlertTriangle, ArrowRight, BookOpen, ClipboardCheck, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GewerkBadge, PrioBadge, StatusBadge } from '../components/Badges'
import { azubiProfil, berichtsheft, lernaufgaben, naechstePruefung, sicherheitshinweise } from '../data/mock'

export default function Dashboard() {
  const offen = lernaufgaben.filter((a) => a.status !== 'Erledigt')
  const heute = offen.filter((a) => a.faelligkeit.startsWith('Heute'))
  const entwuerfe = berichtsheft.filter((b) => b.status === 'Entwurf').length

  const stats = [
    { label: 'Offene Lernaufgaben', value: offen.length, icon: ClipboardCheck, tone: 'text-db-red' },
    { label: 'Heute fällig', value: heute.length, icon: ClipboardCheck, tone: 'text-db-amber' },
    { label: 'Berichtsheft offen', value: entwuerfe, icon: BookOpen, tone: entwuerfe > 0 ? 'text-db-red' : 'text-db-green' },
    { label: `Tage bis ${naechstePruefung.titel}`, value: naechstePruefung.tageVerbleibend, icon: GraduationCap, tone: 'text-db-navy' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-db-navy">Guten Tag, {azubiProfil.name}</h1>
        <p className="text-sm text-db-navy-light">
          {azubiProfil.lehrjahr}. Lehrjahr · {azubiProfil.abteilung} · Ausbilder: {azubiProfil.ausbilder}
        </p>
      </div>

      {sicherheitshinweise.map((s) => (
        <div
          key={s.id}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
            s.stufe === 'Kritisch'
              ? 'border-db-red/30 bg-db-red/5 text-db-red-dark'
              : 'border-db-amber/30 bg-db-amber/5 text-db-amber'
          }`}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">{s.titel}</p>
            <p className="text-xs opacity-80">{s.ort} · gültig bis {s.gueltigBis}</p>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-db-gray-200 bg-white p-4">
            <Icon size={18} className={tone} />
            <p className="mt-2 text-2xl font-semibold text-db-navy">{value}</p>
            <p className="text-xs text-db-navy-light">{label}</p>
          </div>
        ))}
      </div>

      {entwuerfe > 0 && (
        <Link
          to="/berichtsheft"
          className="flex items-center justify-between rounded-xl border border-db-amber/30 bg-db-amber/5 px-4 py-3 text-sm font-medium text-db-amber"
        >
          <span>
            {entwuerfe} Berichtsheft-Eintrag {entwuerfe === 1 ? 'wartet' : 'warten'} noch auf Fertigstellung
          </span>
          <ArrowRight size={16} />
        </Link>
      )}

      <div className="rounded-xl border border-db-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-db-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-db-navy">Nächste Lernaufgaben</h2>
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
