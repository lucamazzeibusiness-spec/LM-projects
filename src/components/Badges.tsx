import type { AuftragStatus, Gewerk, Prioritaet } from '../data/mock'

const statusStyles: Record<AuftragStatus, string> = {
  Offen: 'bg-db-gray-100 text-db-navy-light',
  'In Arbeit': 'bg-db-amber/10 text-db-amber',
  Erledigt: 'bg-db-green/10 text-db-green',
}

export function StatusBadge({ status }: { status: AuftragStatus }) {
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
