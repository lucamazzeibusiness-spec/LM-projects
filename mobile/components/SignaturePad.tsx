import { useRef } from 'react'
import { Pressable, Text, View } from 'react-native'
import SignatureScreen, { type SignatureViewRef } from 'react-native-signature-canvas'

interface Props {
  onChange: (dataUrl: string | null) => void
}

export default function SignaturePad({ onChange }: Props) {
  const ref = useRef<SignatureViewRef>(null)

  return (
    <View className="space-y-2">
      <View className="h-40 overflow-hidden rounded-lg border border-db-gray-200 dark:border-[#2A323D] bg-white">
        <SignatureScreen
          ref={ref}
          onEnd={() => ref.current?.readSignature()}
          onOK={(dataUrl) => onChange(dataUrl)}
          onEmpty={() => onChange(null)}
          onClear={() => onChange(null)}
          autoClear={false}
          penColor="#14181F"
          backgroundColor="rgba(255,255,255,1)"
          descriptionText=""
          webStyle=".m-signature-pad--footer { display: none; margin: 0; } .m-signature-pad--body { border: none; } .m-signature-pad { box-shadow: none; border: none; } body,html { height: 100%; }"
        />
      </View>
      <Pressable onPress={() => ref.current?.clearSignature()}>
        <Text className="text-xs font-medium text-db-navy-light dark:text-[#9AA4B0]">Löschen</Text>
      </Pressable>
    </View>
  )
}
