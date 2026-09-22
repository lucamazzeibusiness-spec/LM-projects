import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './context/AuthContext'
import { AzubiProfilProvider, useAzubiProfil } from './context/AzubiProfilContext'
import Ausbildungsplan from './pages/Ausbildungsplan'
import Berichtsheft from './pages/Berichtsheft'
import Dashboard from './pages/Dashboard'
import LernaufgabeDetail from './pages/LernaufgabeDetail'
import Lernaufgaben from './pages/Lernaufgaben'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Wissen from './pages/Wissen'

export default function App() {
  const { user, bereit } = useAuth()

  if (!bereit) {
    return <div className="min-h-screen bg-db-gray-50" />
  }

  if (!user) {
    return <Login />
  }

  // Erst ab hier mounten die Hooks, die aus localStorage lesen – die
  // Cloud-Daten wurden von AuthProvider bereits dort hineingespiegelt.
  return (
    <AzubiProfilProvider>
      <AppRoutes />
    </AzubiProfilProvider>
  )
}

function AppRoutes() {
  const { profil } = useAzubiProfil()

  if (!profil) {
    return <Onboarding />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lernaufgaben" element={<Lernaufgaben />} />
        <Route path="/lernaufgaben/:id" element={<LernaufgabeDetail />} />
        <Route path="/berichtsheft" element={<Berichtsheft />} />
        <Route path="/wissen" element={<Wissen />} />
        <Route path="/ausbildungsplan" element={<Ausbildungsplan />} />
        <Route path="/profil" element={<Onboarding />} />
      </Routes>
    </Layout>
  )
}
