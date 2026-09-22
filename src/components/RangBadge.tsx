import { NavLink } from 'react-router-dom'
import { usePunkte } from '../context/PunkteContext'
import { rangFuer } from '../lib/rang'

export default function RangBadge() {
  const { stand } = usePunkte()
  const { aktuell } = rangFuer(stand.gesamt)

  return (
    <NavLink
      to="/fortschritt"
      title="Fortschritt ansehen"
      className="flex h-8 items-center gap-1.5 rounded-full bg-db-gray-100 px-2.5 text-xs font-semibold text-db-navy hover:bg-db-gray-200"
    >
      <span>{aktuell.icon}</span>
      <span className="hidden sm:inline">{aktuell.name} ·</span> {stand.gesamt} P
    </NavLink>
  )
}
