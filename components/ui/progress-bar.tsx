import { View } from "react-native"


type ProgressBarProps = {
  sections: number
  currentSection: number
}

export const ProgressBar = ({ sections, currentSection }: ProgressBarProps) => {
  return (
    <View className="mt-4 flex flex-row space-x-2 justify-center items-center">
      {Array.from({ length: sections }).map((_, index) => (
        currentSection === index ? (
          <View key={index} className="h-2 w-14 bg-primary rounded-full"/>
        ) : (
          <View key={index} className="h-2 w-2 bg-white opacity-30 rounded-full"/>
        )
      ))}
    </View>
  )
}   