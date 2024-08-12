import React from "react";
import { Text, SafeAreaView, View } from "react-native";
import { Image } from "expo-image";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { lightTheme as theme } from "@/utils/theme";
import { Platform } from "react-native";

export default function Index() {
  const router = useRouter();

  if (Platform.OS === "web") {
    console.log("Showing web layout");
    return (
      <View className="flex-1 bg-white">
        <View className="mt-40">
          <Text className="text-black font-semibold text-center text-4xl">
            Glayze
          </Text>
        </View>
        <View className="flex items-center justify-center mt-20">
          <Button
            buttonStyle="w-1/2 rounded-full py-3 border border-gray-200 flex-row items-center justify-center bg-white"
            onPress={() => router.push("/")}
          >
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 10, height: 10 }}
              contentFit="contain"
              onLoadStart={() => console.log("Loading")}
              onLoadEnd={() => console.log("Loaded")}
              onError={(e) => {
                console.log(e);
              }}
            />
            <Text className="text-center text-black">
              Download Glayze on the App store
            </Text>
          </Button>
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
          source={require("@/assets/images/aux/iphone.png")}
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
              Get Started
            </Text>
            <Image
              source={require("@/assets/images/dark/forward-arrow.png")}
              style={{ width: 12, height: 12 }}
            />
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
