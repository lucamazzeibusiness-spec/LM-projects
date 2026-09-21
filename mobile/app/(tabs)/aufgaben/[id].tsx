import { useLocalSearchParams } from 'expo-router'
import { Camera, Check, CheckCircle2, MessageSquare, Save, Target } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { GewerkBadge, PrioBadge, StatusBadge } from '../../../components/Badges'
import { lernaufgaben } from '../../../data/mock'
import { ladeGespeichert, speichere } from '../../../lib/storage'

interface Draft {
  checked: Record<string, boolean>
  notiz: string
  erledigt: boolean
}

const leererDraft: Draft = { checked: {}, notiz: '', erledigt: false }

export default function AufgabeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const aufgabe = lernaufgaben.find((a) => a.id === id)
  const storageKey = `lernaufgabe:${id}`

  const [draft, setDraft] = useState<Draft>(leererDraft)
  const [savedHint, setSavedHint] = useState(false)

  useEffect(() => {
    ladeGespeichert<Draft>(storageKey, leererDraft).then(setDraft)
  }, [storageKey])

  const aktualisieren = (updater: (d: Draft) => Draft) => {
    setDraft((d) => {
      const naechster = updater(d)
      speichere(storageKey, naechster)
      return naechster
    })
    setSavedHint(true)
    setTimeout(() => setSavedHint(false), 1200)
  }

  if (!aufgabe) {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-db-gray-50 p-4">
        <Text className="text-sm text-db-navy-light">Aufgabe nicht gefunden.</Text>
      </View>
    )
  }

  const total = aufgabe.checklist.length
  const done = aufgabe.checklist.filter((c) => draft.checked[c.id]).length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const toggle = (itemId: string) =>
    aktualisieren((d) => ({ ...d, checked: { ...d.checked, [itemId]: !d.checked[itemId] } }))

  return (
    <ScrollView className="flex-1 bg-db-gray-50" contentContainerClassName="gap-5 p-4">
      <View className="rounded-xl border border-db-gray-200 bg-white p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View>
            <Text className="text-xs font-medium text-db-navy-light">{aufgabe.id}</Text>
            <Text className="text-lg font-semibold text-db-navy">{aufgabe.titel}</Text>
          </View>
          <StatusBadge status={aufgabe.status} />
        </View>
        <Text className="mt-1 text-sm text-db-navy-light">
          {aufgabe.anlage} {aufgabe.baureihe ? `(${aufgabe.baureihe})` : ''} · {aufgabe.ort}
        </Text>
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <GewerkBadge gewerk={aufgabe.gewerk} />
          <PrioBadge prioritaet={aufgabe.prioritaet} />
          <Text className="text-xs text-db-navy-light">Fällig: {aufgabe.faelligkeit}</Text>
        </View>

        <View className="mt-4 flex-row items-start gap-2 rounded-lg bg-db-red/5 p-3">
          <Target size={16} color="#EC0016" style={{ marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-xs font-semibold text-db-red">Lernziel</Text>
            <Text className="text-sm text-db-navy">{aufgabe.lernziel}</Text>
          </View>
        </View>

        <Text className="mt-3 text-sm text-db-navy">{aufgabe.beschreibung}</Text>

        {aufgabe.ausbilderHinweis && (
          <View className="mt-3 flex-row items-start gap-2 rounded-lg border border-db-gray-200 bg-db-gray-50 p-3">
            <MessageSquare size={15} color="#5C6670" style={{ marginTop: 2 }} />
            <View className="flex-1">
              <Text className="text-xs font-semibold text-db-navy-light">Hinweis von deinem Ausbilder</Text>
              <Text className="text-sm text-db-navy">{aufgabe.ausbilderHinweis}</Text>
            </View>
          </View>
        )}
      </View>

      <View className="rounded-xl border border-db-gray-200 bg-white p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-db-navy">Arbeitsschritte</Text>
          <Text className="text-xs font-medium text-db-navy-light">
            {done}/{total} erledigt
          </Text>
        </View>
        <View className="mb-4 h-2 w-full overflow-hidden rounded-full bg-db-gray-100">
          <View className="h-full rounded-full bg-db-green" style={{ width: `${progress}%` }} />
        </View>

        <View className="gap-2">
          {aufgabe.checklist.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggle(item.id)}
              className={`flex-row items-center gap-3 rounded-lg border px-3 py-2.5 ${
                draft.checked[item.id] ? 'border-db-green/30 bg-db-green/5' : 'border-db-gray-200'
              }`}
            >
              <View
                className={`h-5 w-5 items-center justify-center rounded border ${
                  draft.checked[item.id] ? 'border-db-green bg-db-green' : 'border-db-gray-400'
                }`}
              >
                {draft.checked[item.id] && <Check size={13} color="#fff" />}
              </View>
              <Text className="flex-1 text-sm text-db-navy">{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable className="mt-4 flex-row items-center gap-2 rounded-lg border border-dashed border-db-gray-200 px-3 py-2.5">
          <Camera size={16} color="#5C6670" />
          <Text className="text-sm text-db-navy-light">Foto hinzufügen</Text>
        </Pressable>

        <View className="mt-4">
          <Text className="mb-1 text-xs font-medium text-db-navy-light">Was hast du gelernt / verstanden?</Text>
          <TextInput
            value={draft.notiz}
            onChangeText={(t) => aktualisieren((d) => ({ ...d, notiz: t }))}
            multiline
            numberOfLines={3}
            placeholder="z. B. Was war neu für dich, wo brauchst du noch Übung..."
            className="w-full rounded-lg border border-db-gray-200 px-3 py-2 text-sm text-db-navy"
            style={{ minHeight: 72, textAlignVertical: 'top' }}
          />
        </View>

        <Pressable
          onPress={() => aktualisieren((d) => ({ ...d, erledigt: !d.erledigt }))}
          className={`mt-4 flex-row items-center justify-center gap-2 rounded-full border px-3 py-3 ${
            draft.erledigt ? 'border-db-green bg-db-green/10' : 'border-db-red bg-db-red'
          }`}
        >
          <CheckCircle2 size={16} color={draft.erledigt ? '#1E8A3C' : '#fff'} />
          <Text className={`text-sm font-semibold ${draft.erledigt ? 'text-db-green' : 'text-white'}`}>
            {draft.erledigt ? 'Als erledigt markiert' : 'Als erledigt markieren'}
          </Text>
        </Pressable>

        <View className="mt-2 flex-row items-center justify-center gap-1">
          <Save size={12} color={savedHint ? '#1E8A3C' : '#5C6670'} />
          <Text className="text-xs text-db-navy-light">Entwurf wird lokal gespeichert – auch ohne Netzverbindung</Text>
        </View>
      </View>
    </ScrollView>
  )
}
