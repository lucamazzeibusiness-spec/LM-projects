import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AuftragDetail from './pages/AuftragDetail'
import Auftraege from './pages/Auftraege'
import Dashboard from './pages/Dashboard'
import Ersatzteile from './pages/Ersatzteile'
import Fehlerdiagnose from './pages/Fehlerdiagnose'
import Schichtplan from './pages/Schichtplan'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auftraege" element={<Auftraege />} />
        <Route path="/auftraege/:id" element={<AuftragDetail />} />
        <Route path="/fehlerdiagnose" element={<Fehlerdiagnose />} />
        <Route path="/ersatzteile" element={<Ersatzteile />} />
        <Route path="/schichtplan" element={<Schichtplan />} />
      </Routes>
    </Layout>
  )
}
