import { useRef, useState } from 'react'
import { Animated, Pressable, Text } from 'react-native'

interface FlashcardProps {
  front: string
  back: string
  onFlipChange?: (showingBack: boolean) => void
}

export default function Flashcard({ front, back, onFlipChange }: FlashcardProps) {
  const angle = useRef(new Animated.Value(0)).current
  const [showingBack, setShowingBack] = useState(false)

  const flip = () => {
    Animated.timing(angle, { toValue: 90, duration: 150, useNativeDriver: true }).start(() => {
      angle.setValue(-90)
      setShowingBack((b) => {
        const next = !b
        onFlipChange?.(next)
        return next
      })
      Animated.timing(angle, { toValue: 0, duration: 150, useNativeDriver: true }).start()
    })
  }

  const rotateY = angle.interpolate({ inputRange: [-90, 0, 90], outputRange: ['-90deg', '0deg', '90deg'] })

  return (
    <Pressable onPress={flip}>
      <Animated.View
        style={{ transform: [{ perspective: 1000 }, { rotateY }] }}
        className="min-h-40 justify-between rounded-xl border border-db-gray-200 dark:border-[#2A323D] bg-white dark:bg-[#171C24] p-5"
      >
        <Text className="text-sm font-medium leading-relaxed text-db-navy dark:text-[#EEF1F4]">
          {showingBack ? back : front}
        </Text>
        <Text className="mt-4 text-center text-[11px] font-medium uppercase tracking-wide text-db-navy-light dark:text-[#9AA4B0]">
          Tippen zum Umdrehen
        </Text>
      </Animated.View>
    </Pressable>
  )
}
