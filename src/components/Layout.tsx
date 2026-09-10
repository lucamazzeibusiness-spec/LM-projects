import {
  AlertTriangle,
  ClipboardList,
  LayoutGrid,
  Package,
  Search,
  Train,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Start', icon: LayoutGrid, end: true },
  { to: '/auftraege', label: 'Aufträge', icon: ClipboardList },
  { to: '/fehlerdiagnose', label: 'Fehlerdiagnose', icon: Search },
  { to: '/ersatzteile', label: 'Ersatzteile', icon: Package },
  { to: '/schichtplan', label: 'Schichtplan', icon: Users },
]

function OnlineBadge() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        online ? 'bg-db-green/10 text-db-green' : 'bg-db-amber/10 text-db-amber'
      }`}
    >
      {online ? <Wifi size={14} /> : <WifiOff size={14} />}
      {online ? 'Online' : 'Offline-Modus'}
    </span>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-db-gray-50">
      <header className="sticky top-0 z-20 border-b border-db-gray-200 bg-db-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-db-red">
            <Train size={20} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide">DB Technik</span>
            <span className="text-xs text-white/60">Werkzeug für Elektrik · Mechanik · Mechatronik</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <OnlineBadge />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
              MT
            </div>
          </div>
        </div>
        <nav className="hidden max-w-6xl gap-1 px-4 pb-2 md:mx-auto md:flex">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-t-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-db-gray-50 text-db-navy' : 'text-white/80 hover:bg-white/10'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-4 md:pb-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-db-gray-200 bg-white md:hidden">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                isActive ? 'text-db-red' : 'text-db-navy-light'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function AlertBanner({ text }: { text: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-db-red/30 bg-db-red/5 px-3 py-2 text-sm text-db-red-dark">
      <AlertTriangle size={16} className="shrink-0" />
      {text}
    </div>
  )
}
