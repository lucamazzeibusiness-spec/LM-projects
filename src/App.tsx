import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useAzubiProfil } from './context/AzubiProfilContext'
import Ausbildungsplan from './pages/Ausbildungsplan'
import Berichtsheft from './pages/Berichtsheft'
import Dashboard from './pages/Dashboard'
import LernaufgabeDetail from './pages/LernaufgabeDetail'
import Lernaufgaben from './pages/Lernaufgaben'
import Onboarding from './pages/Onboarding'
import Wissen from './pages/Wissen'

export default function App() {
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
