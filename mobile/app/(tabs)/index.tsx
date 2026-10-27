import { router } from 'expo-router'
import { ArrowRight, Bell, BellOff, CalendarCheck, ClipboardCheck, GraduationCap, Thermometer } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { GewerkBadge, PrioBadge, StatusBadge } from '../../components/Badges'
import KarteDesTages from '../../components/KarteDesTages'
import { useAzubiProfil } from '../../context/AzubiProfilContext'
import { useAusbildungsplan } from '../../context/AusbildungsplanContext'
import { useBerichtsheft } from '../../context/BerichtsheftContext'
import { useLernaufgaben } from '../../context/LernaufgabenContext'
import { erinnerungAktivieren, erinnerungDeaktivieren, erinnerungIstAktiv, heuteErinnern } from '../../lib/erinnerung'
import { KRANKHEITSTAGE_GRENZE, KRANKHEITSTAGE_WARNUNG, krankheitstage } from '../../lib/fehlzeiten'
import { hatEchtenInhalt } from '../../lib/stichpunkte'
import { aktuelleWochentage, heuteISO, heutigerWochentagIndex, wochenSchluessel } from '../../lib/wochen'
import { naechstePruefungFuer } from '../../lib/pruefung'
import { type AusbildungsblockTyp } from '../../data/mock'

const typStyle: Record<AusbildungsblockTyp, string> = {
  Betrieb: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',
  Berufsschule: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300',
  'DB Training': 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300',
}

export default function Dashboard() {
  const { profil } = useAzubiProfil()
  const { eintraege } = useBerichtsheft()
  const { vorlage } = useAusbildungsplan()
  const { lernaufgaben } = useLernaufgaben()
  const [erinnerungAn, setErinnerungAn] = useState(false)

  const heutigerEintrag = eintraege.find((e) => e.datumISO === heuteISO())
  // Tage ohne Block im Ausbildungsplan (standardmäßig Sa/So) gelten als frei – dort wird
  // weder erinnert noch ein fehlender Eintrag angemahnt.
  const heuteFrei = !vorlage[heutigerWochentagIndex()]

  useEffect(() => {
    erinnerungIstAktiv().then(setErinnerungAn)
  }, [])

  useEffect(() => {
    if (!heutigerEintrag && !heuteFrei) heuteErinnern('Dein Berichtsheft-Eintrag für heute fehlt noch.')
  }, [heutigerEintrag, heuteFrei])

  if (!profil) return null

  const offen = lernaufgaben.filter((a) => a.status !== 'Erledigt')
  // Vergangene Wochen mit Einträgen, deren Ausbildungsnachweis noch nicht unterschrieben und
  // exportiert wurde – die laufende Woche zählt nicht, die ist ja noch in Arbeit.
  const dieseWoche = wochenSchluessel(heuteISO())
  const offeneWochen = new Set(
    eintraege
      .filter((e) => e.status === 'Entwurf' && hatEchtenInhalt(e.taetigkeiten))
      .map((e) => wochenSchluessel(e.datumISO))
      .filter((w) => w < dieseWoche),
  ).size

  const heuteIndex = heutigerWochentagIndex()
  const heutigerBlock = vorlage[heuteIndex]
  const heutigerTag = aktuelleWochentage()[heuteIndex]

  const pruefung = naechstePruefungFuer(profil)
  const stats = [
    { label: 'Offene Aufgaben', value: offen.length, Icon: ClipboardCheck, tone: 'text-db-red', ziel: '/aufgaben' as const },
    pruefung
      ? { label: `Tage bis ${pruefung.titel}`, value: pruefung.tageVerbleibend, Icon: GraduationCap, tone: 'text-db-navy dark:text-[#EEF1F4]', ziel: '/ausbildungsplan' as const }
      : { label: 'Prüfungstermin eintragen', value: '–', Icon: GraduationCap, tone: 'text-db-navy-light', ziel: '/profil' as const },
  ]

  const erinnerungUmschalten = async () => {
    if (erinnerungAn) {
      await erinnerungDeaktivieren()
      setErinnerungAn(false)
    } else {
      const ok = await erinnerungAktivieren()
      setErinnerungAn(ok)
      if (ok && !heutigerEintrag && !heuteFrei) heuteErinnern('Dein Berichtsheft-Eintrag für heute fehlt noch.')
    }
  }

  return (
    <ScrollView className="flex-1 bg-db-gray-50 dark:bg-[#10141B]" contentContainerClassName="gap-6 p-4">
      <View>
        <Text className="text-xl font-semibold text-db-navy dark:text-[#EEF1F4]">Guten Tag, {profil.name}</Text>
        <Text className="text-sm text-db-navy-light dark:text-[#9AA4B0]">
          {profil.lehrjahr}. Lehrjahr · {profil.abteilung}
          {profil.ausbilder ? ` · Ausbilder: ${profil.ausbilder}` : ''}
        </Text>
      </View>

      <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Dein Tag heute</Text>
          <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
            {heutigerTag.tag}, {heutigerTag.datum}
          </Text>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          {heutigerBlock ? (
            <>
              <Text className={`shrink-0 overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium ${typStyle[heutigerBlock.typ]}`}>
                {heutigerBlock.typ}
              </Text>
              {heutigerBlock.thema ? (
                <Text className="flex-1 text-sm text-db-navy dark:text-[#EEF1F4]" numberOfLines={1}>
                  {heutigerBlock.thema}
                </Text>
              ) : (
                <Pressable onPress={() => router.push('/ausbildungsplan')} className="flex-1">
                  <Text className="text-sm italic text-db-navy-light dark:text-[#9AA4B0]" numberOfLines={1}>
                    Noch kein Thema eingetragen
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <Text className="text-sm italic text-db-navy-light dark:text-[#9AA4B0]">Kein Ausbildungsplan-Eintrag für heute</Text>
          )}
        </View>

        <View className="mt-3 gap-2 border-t border-db-gray-100 pt-3">
          <Pressable onPress={() => router.push('/berichtsheft')} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <CalendarCheck size={15} color={heutigerEintrag ? '#1E8A3C' : heuteFrei ? '#5C6670' : '#EC0016'} />
              <Text
                className={`text-sm ${
                  heutigerEintrag ? 'text-db-green' : heuteFrei ? 'text-db-navy-light dark:text-[#9AA4B0]' : 'font-semibold text-db-red'
                }`}
              >
                {heutigerEintrag
                  ? 'Berichtsheft heute eingetragen'
                  : heuteFrei
                    ? 'Heute frei – kein Eintrag nötig'
                    : 'Berichtsheft-Eintrag fehlt noch'}
              </Text>
            </View>
            <ArrowRight size={14} color="#5C6670" />
          </Pressable>
        </View>
      </View>

      <KarteDesTages />

      <KrankheitstageKarte anzahl={krankheitstage(eintraege)} />

      <View className="flex-row gap-3">
        {stats.map(({ label, value, Icon, tone, ziel }) => (
          <Pressable
            key={label}
            onPress={() => router.push(ziel)}
            className="flex-1 rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4"
          >
            <Icon size={18} color={tone === 'text-db-red' ? '#EC0016' : tone === 'text-db-navy-light' ? '#5C6670' : '#14181F'} />
            <Text className="mt-2 text-2xl font-semibold text-db-navy dark:text-[#EEF1F4]">{value}</Text>
            <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">{label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={erinnerungUmschalten}
        className="flex-row items-center justify-between rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] px-4 py-3"
      >
        <View className="flex-row items-center gap-2">
          {erinnerungAn ? <Bell size={16} color="#1E8A3C" /> : <BellOff size={16} color="#5C6670" />}
          <Text className="text-sm text-db-navy dark:text-[#EEF1F4]">
            {erinnerungAn ? 'Tägliche Erinnerung aktiv' : 'Tägliche Erinnerung aktivieren'}
          </Text>
        </View>
        <Text className="text-xs font-medium text-db-red">{erinnerungAn ? 'Deaktivieren' : 'Aktivieren'}</Text>
      </Pressable>

      {offeneWochen > 0 && (
        <Pressable
          onPress={() => router.push('/berichtsheft')}
          className="flex-row items-center justify-between rounded-xl border border-db-amber/30 bg-db-amber/5 px-4 py-3"
        >
          <Text className="text-sm font-medium text-db-amber">
            {offeneWochen === 1 ? '1 vergangene Woche' : `${offeneWochen} vergangene Wochen`} noch nicht als
            Ausbildungsnachweis eingereicht
          </Text>
          <ArrowRight size={16} color="#D98600" />
        </Pressable>
      )}

      <View className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24]">
        <View className="flex-row items-center justify-between border-b border-db-gray-200 dark:border-[#2A323D] px-4 py-3">
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Nächste Aufgaben</Text>
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
                <Text className="text-sm font-medium text-db-navy dark:text-[#EEF1F4]">{a.titel}</Text>
                <Text className="text-xs text-db-navy-light dark:text-[#9AA4B0]">
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

function KrankheitstageKarte({ anzahl }: { anzahl: number }) {
  const rest = KRANKHEITSTAGE_GRENZE - anzahl
  const stufe = anzahl >= KRANKHEITSTAGE_GRENZE ? 'rot' : anzahl >= KRANKHEITSTAGE_WARNUNG ? 'gelb' : 'normal'
  const farbe = { rot: 'text-db-red', gelb: 'text-db-amber', normal: 'text-db-navy dark:text-[#EEF1F4]' }[stufe]
  const iconFarbe = { rot: '#EC0016', gelb: '#D98600', normal: '#14181F' }[stufe]
  const balken = { rot: 'bg-db-red', gelb: 'bg-db-amber', normal: 'bg-db-green' }[stufe]
  return (
    <Pressable
      onPress={() => router.push('/berichtsheft')}
      className="rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-4"
    >
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-1.5">
          <Thermometer size={16} color={iconFarbe} />
          <Text className="text-sm font-semibold text-db-navy dark:text-[#EEF1F4]">Krankheitstage</Text>
        </View>
        <Text className={`text-sm font-semibold ${farbe}`}>
          {anzahl} von {KRANKHEITSTAGE_GRENZE}
        </Text>
      </View>
      <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-db-gray-100 dark:bg-[#1A2029]">
        <View className={`h-full rounded-full ${balken}`} style={{ width: `${Math.min(100, (anzahl / KRANKHEITSTAGE_GRENZE) * 100)}%` }} />
      </View>
      <Text className={`mt-1.5 text-xs ${stufe === 'normal' ? 'text-db-navy-light dark:text-[#9AA4B0]' : farbe}`}>
        {stufe === 'rot'
          ? 'Grenze erreicht – sprich am besten mit deinem Ausbilder.'
          : `Noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'} bis zur Grenze · gezählt aus deinen Berichtsheft-Einträgen`}
      </Text>
    </Pressable>
  )
}
