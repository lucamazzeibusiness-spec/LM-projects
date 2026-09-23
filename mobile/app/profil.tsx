import { router } from 'expo-router'
import ProfilBearbeitenForm from '../components/ProfilBearbeitenForm'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import type { AzubiProfil } from '../data/mock'

export default function Profil() {
  const { profil, profilSpeichern } = useAzubiProfil()

  return (
    <ProfilBearbeitenForm
      profil={profil}
      onSpeichern={(p: AzubiProfil) => profilSpeichern(p)}
      onFertig={() => router.back()}
    />
  )
}
