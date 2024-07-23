import React from 'react'
import { Text, SafeAreaView, View } from 'react-native'
import { Image } from 'expo-image'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'expo-router'

export default function Index(){
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-background">
      
        {/* <View className="pt-6">
      <Image source={require("@/assets/images/iphone.png")} className="w-full h-full" />
      </View> */}

      <View className="space-y-2">
    <Text className="text-white text-center text-2xl font-semibold">
      Welcome to Glayze!
    </Text>
    <Text className="text-white opacity-70 text-center text-sm">The ultimate app for trading tweets.</Text>
      </View>       
      <ProgressBar sections={3} currentSection={0} />
      <View className="flex flex-row justify-center items-center pt-12">
      <Button buttonStyle={"flex flex-row justify-center items-center bg-primary rounded-full"} onPress={() => router.push('/connect')}>
          <Text className="text-black font-medium px-8 py-4">Get Started</Text>
      </Button>
      </View>
    </SafeAreaView>
  )
}