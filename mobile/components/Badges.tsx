import { Text } from 'react-native'
import type { BerichtsheftStatus, Gewerk, LernaufgabeStatus, Prioritaet } from '../data/mock'

const statusStyles: Record<LernaufgabeStatus, string> = {
  Offen: 'bg-db-gray-100 dark:bg-[#1A2029] text-db-navy-light dark:text-[#9AA4B0]',
  'In Arbeit': 'bg-db-amber/10 text-db-amber',
  Erledigt: 'bg-db-green/10 text-db-green',
}

export function StatusBadge({ status }: { status: LernaufgabeStatus }) {
  return (
    <Text className={`overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </Text>
  )
}

const prioStyles: Record<Prioritaet, string> = {
  Hoch: 'bg-db-red/10 text-db-red',
  Mittel: 'bg-db-amber/10 text-db-amber',
  Niedrig: 'bg-db-gray-100 dark:bg-[#1A2029] text-db-navy-light dark:text-[#9AA4B0]',
}

export function PrioBadge({ prioritaet }: { prioritaet: Prioritaet }) {
  return (
    <Text className={`overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${prioStyles[prioritaet]}`}>
      {prioritaet}
    </Text>
  )
}

const gewerkStyles: Record<Gewerk, string> = {
  Elektrik: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',
  Mechanik: 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300',
  Mechatronik: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300',
}

export function GewerkBadge({ gewerk }: { gewerk: Gewerk }) {
  return (
    <Text className={`overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${gewerkStyles[gewerk]}`}>
      {gewerk}
    </Text>
  )
}

const berichtStyles: Record<BerichtsheftStatus, string> = {
  Entwurf: 'bg-db-gray-100 dark:bg-[#1A2029] text-db-navy-light dark:text-[#9AA4B0]',
  Eingereicht: 'bg-db-amber/10 text-db-amber',
  Freigegeben: 'bg-db-green/10 text-db-green',
}

export function BerichtStatusBadge({ status }: { status: BerichtsheftStatus }) {
  return (
    <Text className={`overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${berichtStyles[status]}`}>
      {status}
    </Text>
  )
}
