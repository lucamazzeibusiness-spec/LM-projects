import { AlertTriangle, BookOpen, CalendarDays, ClipboardList, GraduationCap, LayoutGrid, LogOut, Moon, Sun } from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import RangBadge from './RangBadge'
import { useAuth } from '../context/AuthContext'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import { DB_LOGO_PNG } from '../lib/dbLogo'
import { aktuellesTheme, themeSetzen, type Theme } from '../lib/theme'

const navItems = [
  { to: '/', label: 'Start', icon: LayoutGrid, end: true },
  { to: '/lernaufgaben', label: 'Aufgaben', icon: ClipboardList },
  { to: '/berichtsheft', label: 'Berichtsheft', icon: BookOpen },
  { to: '/wissen', label: 'Wissen', icon: GraduationCap },
  { to: '/ausbildungsplan', label: 'Ausbildung', icon: CalendarDays },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { profil } = useAzubiProfil()
  const { abmelden } = useAuth()
  const [theme, setTheme] = useState<Theme>(aktuellesTheme)

  useEffect(() => {
    themeSetzen(theme)
  }, [theme])

  if (!profil) return null
  const initialen = profil.name.slice(0, 2).toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-db-gray-50">
      <header className="sticky top-0 z-20 border-b border-db-gray-200 bg-db-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <img src={DB_LOGO_PNG} alt="DB" className="h-8 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-db-navy">Azubi</span>
            <span className="text-xs text-db-navy-light">
              {profil.ausbildungsberuf} · {profil.lehrjahr}. Lehrjahr
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RangBadge />
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              title={theme === 'dark' ? 'Helles Design' : 'Dunkles Design'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-db-gray-100 text-db-navy hover:bg-db-gray-200"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={abmelden}
              title="Abmelden"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-db-gray-100 text-db-navy hover:bg-db-gray-200"
            >
              <LogOut size={15} />
            </button>
            <NavLink
              to="/profil"
              title="Profil bearbeiten"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-db-gray-100 text-xs font-semibold text-db-navy hover:bg-db-gray-200"
            >
              {initialen}
            </NavLink>
          </div>
        </div>
        <nav className="hidden max-w-6xl gap-1 px-4 md:mx-auto md:flex">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-db-red text-db-red'
                    : 'border-transparent text-db-navy-light hover:text-db-navy'
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

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-db-gray-200 bg-db-surface pb-[env(safe-area-inset-bottom)] md:hidden">
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
