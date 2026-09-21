import { router } from 'expo-router'
import ProfilForm from '../components/ProfilForm'
import { useAzubiProfil } from '../context/AzubiProfilContext'
import type { AzubiProfil } from '../data/mock'

export default function Profil() {
  const { profil, profilSpeichern } = useAzubiProfil()

  const fertig = (p: AzubiProfil) => {
    profilSpeichern(p)
    router.back()
  }

  return <ProfilForm profil={profil} onFertig={fertig} />
}
