import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, View } from "react-native";
import { Image } from "expo-image";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { Href, useRouter } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import { Loading } from "@/components/loading";
import { usePrivy } from "@privy-io/react-auth";

export default function Index() {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { user, ready } = usePrivy();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (ready) {
      setIsInitialized(true);
      if (user) {
        router.replace("/(authenticated)/(tabs)/home" as Href<string>);
      }
    }
  }, [ready, user, router]);

  if (!isInitialized) {
    return <Loading />;
  }
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row justify-center items-center">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 50, height: 50 }}
        />
      </View>
      <View className="pb-2 px-4">
        <Image
          source={require("@/assets/images/aux/iphone.png")}
          style={{
            width: 475,
            height: 475,
            alignSelf: "center",
          }}
          contentFit="contain"
        />
        <Image
          source={
            themeName === "dark"
              ? require("@/assets/images/dark/home-page.png")
              : require("@/assets/images/dark/home-page.png") // TODO: Add light version
          }
          style={{
            width: 425,
            height: 425,
            alignSelf: "center",
          }}
          contentFit="contain"
          className="absolute top-14 rounded-lg"
        />
      </View>
      <View className="space-y-2 mt-4 border-t border-gray-200">
        <Text
          className="text-center text-2xl font-semibold pt-4"
          style={{
            color: theme.textColor,
          }}
        >
          Welcome to Glayze!
        </Text>
        <Text
          className="text-center text-lg"
          style={{ color: theme.textColor }}
        >
          The ultimate app for trading tweets
        </Text>
      </View>
      <View className="flex flex-row justify-center items-center pt-8">
        <Button
          buttonStyle={"rounded-full"}
          onPress={() => router.push("/login")}
          style={{ backgroundColor: theme.tabBarActiveTintColor }}
        >
          <View className="px-6 py-4 flex flex-row items-center justify-center space-x-2">
            <Text
              className="text-center font-bold"
              style={{ color: colors.white }}
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
