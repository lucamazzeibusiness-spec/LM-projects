import type { BerichtsheftStatus, Gewerk, LernaufgabeStatus, Prioritaet } from '../data/mock'

const statusStyles: Record<LernaufgabeStatus, string> = {
  Offen: 'bg-db-gray-100 text-db-navy-light',
  'In Arbeit': 'bg-db-amber/10 text-db-amber',
  'Zur Kontrolle': 'bg-blue-50 text-blue-700',
  Erledigt: 'bg-db-green/10 text-db-green',
}

export function StatusBadge({ status }: { status: LernaufgabeStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  )
}

const prioStyles: Record<Prioritaet, string> = {
  Hoch: 'bg-db-red/10 text-db-red',
  Mittel: 'bg-db-amber/10 text-db-amber',
  Niedrig: 'bg-db-gray-100 text-db-navy-light',
}

export function PrioBadge({ prioritaet }: { prioritaet: Prioritaet }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${prioStyles[prioritaet]}`}>
      {prioritaet}
    </span>
  )
}

const gewerkStyles: Record<Gewerk, string> = {
  Elektrik: 'bg-blue-50 text-blue-700',
  Mechanik: 'bg-orange-50 text-orange-700',
  Mechatronik: 'bg-purple-50 text-purple-700',
}

export function GewerkBadge({ gewerk }: { gewerk: Gewerk }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${gewerkStyles[gewerk]}`}>
      {gewerk}
    </span>
  )
}

const berichtStyles: Record<BerichtsheftStatus, string> = {
  Entwurf: 'bg-db-gray-100 text-db-navy-light',
  Eingereicht: 'bg-db-amber/10 text-db-amber',
  Freigegeben: 'bg-db-green/10 text-db-green',
}

export function BerichtStatusBadge({ status }: { status: BerichtsheftStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${berichtStyles[status]}`}>
      {status}
    </span>
  )
}
