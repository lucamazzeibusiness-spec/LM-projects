export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme:modus'

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function aktuellesTheme(): Theme {
  const gespeichert = localStorage.getItem(STORAGE_KEY)
  return gespeichert === 'dark' || gespeichert === 'light' ? gespeichert : systemTheme()
}

export function themeAnwenden(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171c24' : '#ffffff')
}

export function themeSetzen(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme)
  themeAnwenden(theme)
}

// Wird beim App-Start einmalig aufgerufen (siehe main.tsx), bevor React rendert.
export function themeInitialisieren() {
  themeAnwenden(aktuellesTheme())
}
