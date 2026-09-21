import { router } from 'expo-router'
import { ArrowRight, Bell, BellOff, CalendarCheck, ClipboardCheck, GraduationCap } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { GewerkBadge, PrioBadge, StatusBadge } from '../../components/Badges'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { useAusbildungsplan } from '../../hooks/useAusbildungsplan'
import { useBerichtsheft } from '../../hooks/useBerichtsheft'
import { erinnerungAktivieren, erinnerungDeaktivieren, erinnerungIstAktiv, heuteErinnern } from '../../lib/erinnerung'
import { aktuelleWochentage, heuteISO, heutigerWochentagIndex } from '../../lib/wochen'
import { lernaufgaben, naechstePruefung, type AusbildungsblockTyp } from '../../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 text-blue-700',
  Berufsschule: 'bg-purple-50 text-purple-700',
  'DB Training': 'bg-orange-50 text-orange-700',
}

export default function Dashboard() {
  const { profil } = useAzubiProfil()
  const { eintraege } = useBerichtsheft()
  const { vorlage } = useAusbildungsplan()
  const [erinnerungAn, setErinnerungAn] = useState(false)

  const heutigerEintrag = eintraege.find((e) => e.datumISO === heuteISO())

  useEffect(() => {
    erinnerungIstAktiv().then(setErinnerungAn)
  }, [])

  useEffect(() => {
    if (!heutigerEintrag) heuteErinnern('Dein Berichtsheft-Eintrag für heute fehlt noch.')
  }, [heutigerEintrag])

  if (!profil) return null

  const offen = lernaufgaben.filter((a) => a.status !== 'Erledigt')
  const heute = offen.filter((a) => a.faelligkeit.startsWith('Heute'))
  const andereOffeneEntwuerfe = eintraege.filter(
    (e) => e.status === 'Entwurf' && e.taetigkeiten.trim() && e.datumISO !== heuteISO(),
  ).length

  const heuteIndex = heutigerWochentagIndex()
  const heutigerBlock = vorlage[heuteIndex]
  const heutigerTag = aktuelleWochentage()[heuteIndex]

  const stats = [
    { label: 'Offene Aufgaben', value: offen.length, Icon: ClipboardCheck, tone: 'text-db-red' },
    { label: `Tage bis ${naechstePruefung.titel}`, value: naechstePruefung.tageVerbleibend, Icon: GraduationCap, tone: 'text-db-navy' },
  ]

  const erinnerungUmschalten = async () => {
    if (erinnerungAn) {
      await erinnerungDeaktivieren()
      setErinnerungAn(false)
    } else {
      const ok = await erinnerungAktivieren()
      setErinnerungAn(ok)
      if (ok && !heutigerEintrag) heuteErinnern('Dein Berichtsheft-Eintrag für heute fehlt noch.')
    }
  }

  return (
    <ScrollView className="flex-1 bg-db-gray-50" contentContainerClassName="gap-6 p-4">
      <View>
        <Text className="text-xl font-semibold text-db-navy">Guten Tag, {profil.name}</Text>
        <Text className="text-sm text-db-navy-light">
          {profil.lehrjahr}. Lehrjahr · {profil.abteilung}
          {profil.ausbilder ? ` · Ausbilder: ${profil.ausbilder}` : ''}
        </Text>
      </View>

      <View className="rounded-xl border border-db-gray-200 bg-white p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-db-navy">Dein Tag heute</Text>
          <Text className="text-xs text-db-navy-light">
            {heutigerTag.tag}, {heutigerTag.datum}
          </Text>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          {heutigerBlock ? (
            <>
              <Text className={`shrink-0 overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${typStyle[heutigerBlock.typ]}`}>
                {heutigerBlock.typ}
              </Text>
              <Text className="flex-1 text-sm text-db-navy" numberOfLines={1}>
                {heutigerBlock.thema}
              </Text>
            </>
          ) : (
            <Text className="text-sm italic text-db-navy-light">Kein Ausbildungsplan-Eintrag für heute</Text>
          )}
        </View>

        <View className="mt-3 gap-2 border-t border-db-gray-100 pt-3">
          <Pressable onPress={() => router.push('/berichtsheft')} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <CalendarCheck size={15} color={heutigerEintrag ? '#1E8A3C' : '#EC0016'} />
              <Text className={`text-sm ${heutigerEintrag ? 'text-db-green' : 'font-semibold text-db-red'}`}>
                {heutigerEintrag ? 'Berichtsheft heute eingetragen' : 'Berichtsheft-Eintrag fehlt noch'}
              </Text>
            </View>
            <ArrowRight size={14} color="#5C6670" />
          </Pressable>
          {heute.length > 0 && (
            <Pressable onPress={() => router.push('/aufgaben')} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <ClipboardCheck size={15} color="#D98600" />
                <Text className="text-sm text-db-navy">
                  {heute.length} {heute.length === 1 ? 'Aufgabe' : 'Aufgaben'} heute fällig
                </Text>
              </View>
              <ArrowRight size={14} color="#5C6670" />
            </Pressable>
          )}
        </View>
      </View>

      <View className="flex-row gap-3">
        {stats.map(({ label, value, Icon, tone }) => (
          <View key={label} className="flex-1 rounded-xl border border-db-gray-200 bg-white p-4">
            <Icon size={18} color={tone === 'text-db-red' ? '#EC0016' : '#14181F'} />
            <Text className="mt-2 text-2xl font-semibold text-db-navy">{value}</Text>
            <Text className="text-xs text-db-navy-light">{label}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={erinnerungUmschalten}
        className="flex-row items-center justify-between rounded-xl border border-db-gray-200 bg-white px-4 py-3"
      >
        <View className="flex-row items-center gap-2">
          {erinnerungAn ? <Bell size={16} color="#1E8A3C" /> : <BellOff size={16} color="#5C6670" />}
          <Text className="text-sm text-db-navy">
            {erinnerungAn ? 'Tägliche Erinnerung aktiv' : 'Tägliche Erinnerung aktivieren'}
          </Text>
        </View>
        <Text className="text-xs font-medium text-db-red">{erinnerungAn ? 'Deaktivieren' : 'Aktivieren'}</Text>
      </Pressable>

      {andereOffeneEntwuerfe > 0 && (
        <Pressable
          onPress={() => router.push('/berichtsheft')}
          className="flex-row items-center justify-between rounded-xl border border-db-amber/30 bg-db-amber/5 px-4 py-3"
        >
          <Text className="text-sm font-medium text-db-amber">
            {andereOffeneEntwuerfe} älterer Berichtsheft-Eintrag {andereOffeneEntwuerfe === 1 ? 'wartet' : 'warten'} noch
            auf Einreichung
          </Text>
          <ArrowRight size={16} color="#D98600" />
        </Pressable>
      )}

      <View className="rounded-xl border border-db-gray-200 bg-white">
        <View className="flex-row items-center justify-between border-b border-db-gray-200 px-4 py-3">
          <Text className="text-sm font-semibold text-db-navy">Nächste Aufgaben</Text>
          <Pressable onPress={() => router.push('/aufgaben')} className="flex-row items-center gap-1">
            <Text className="text-xs font-medium text-db-red">Alle ansehen</Text>
            <ArrowRight size={14} color="#EC0016" />
          </Pressable>
        </View>
        <View className="divide-y divide-db-gray-100">
          {offen.slice(0, 4).map((a) => (
            <Pressable
              key={a.id}
              onPress={() => router.push(`/aufgaben/${a.id}`)}
              className="gap-2 px-4 py-3"
            >
              <View>
                <Text className="text-sm font-medium text-db-navy">{a.titel}</Text>
                <Text className="text-xs text-db-navy-light">
                  {a.anlage} · {a.ort} · fällig {a.faelligkeit}
                </Text>
              </View>
              <View className="flex-row flex-wrap items-center gap-2">
                <GewerkBadge gewerk={a.gewerk} />
                <PrioBadge prioritaet={a.prioritaet} />
                <StatusBadge status={a.status} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}
