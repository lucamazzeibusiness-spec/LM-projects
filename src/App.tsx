import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Ausbildungsplan from './pages/Ausbildungsplan'
import Berichtsheft from './pages/Berichtsheft'
import Dashboard from './pages/Dashboard'
import LernaufgabeDetail from './pages/LernaufgabeDetail'
import Lernaufgaben from './pages/Lernaufgaben'
import Wissen from './pages/Wissen'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lernaufgaben" element={<Lernaufgaben />} />
        <Route path="/lernaufgaben/:id" element={<LernaufgabeDetail />} />
        <Route path="/berichtsheft" element={<Berichtsheft />} />
        <Route path="/wissen" element={<Wissen />} />
        <Route path="/ausbildungsplan" element={<Ausbildungsplan />} />
      </Routes>
    </Layout>
  )
}
