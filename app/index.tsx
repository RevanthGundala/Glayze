import React, { useEffect } from "react";
import { Text, SafeAreaView, View, TextInput, Platform } from "react-native";
import { Image } from "expo-image";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { lightTheme as theme } from "@/utils/theme";

export default function Index() {
  const router = useRouter();

  if (Platform.OS === "web") {
    console.log("Only available on iOS!");
    return (
      <View className="flex-1 bg-black">
        <View className="flex justify-center items-center h-32 w-32 rounded-full bg-white">
          <Button>Download on the App store</Button>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-row justify-center items-center pt-2">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 50, height: 50 }}
        />
      </View>
      <View className="pt-2 px-4">
        <Image
          source={require("@/assets/images/iphone.png")}
          style={{
            width: 450,
            height: 450,
            alignSelf: "center",
          }}
          contentFit="contain"
        />
      </View>
      <View className="space-y-2 mt-8">
        <Text
          className="text-center text-2xl font-semibold"
          style={{ color: theme.textColor }}
        >
          Welcome to Glayze!
        </Text>
        <Text
          className="text-center text-lg"
          style={{ color: theme.textColor }}
        >
          The ultimate app for trading tweets.
        </Text>
      </View>
      <ProgressBar sections={3} currentSection={0} />
      <View className="flex flex-row justify-center items-center pt-8">
        <Button
          buttonStyle={"rounded-full"}
          onPress={() => router.push("/login")}
          style={{ backgroundColor: theme.tabBarActiveTintColor }}
        >
          <View className="px-6 py-4 flex flex-row items-center justify-center space-x-2">
            <Text
              className="text-center font-bold"
              style={{ color: theme.secondaryTextColor }}
            >
              Get Started For Free
            </Text>
            <Image
              source={require("@/assets/images/forward-arrow.png")}
              style={{ width: 14, height: 14 }}
            />
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
