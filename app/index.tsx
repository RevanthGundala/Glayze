import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, View, ScrollView } from "react-native"; // Import ScrollView
import { Image } from "expo-image";
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
  }, [ready, user]);

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false} // Optional: Hides the vertical scroll indicator
        className="px-4" // Optional: Add horizontal padding
      >
        {/* Logo Section */}
        <View className="flex flex-row justify-center items-center mt-6">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 50, height: 50 }}
          />
        </View>

        {/* Main Images */}
        <View className="pb-2 mt-8">
          <Image
            source={require("@/assets/images/aux/iphone.png")}
            style={{
              width: "100%", // Makes the image responsive
              height: 475,
              alignSelf: "center",
            }}
            contentFit="contain"
          />
          <Image
            source={
              themeName === "dark"
                ? require("@/assets/images/dark/home-page.png")
                : require("@/assets/images/light/home-page.png") // Added light version
            }
            style={{
              width: "90%", // Adjusted for responsiveness
              height: 425,
              alignSelf: "center",
            }}
            contentFit="contain"
            className="absolute top-14 rounded-lg"
          />
        </View>

        {/* Welcome Text */}
        <View className="space-y-2 mt-4 border-t border-gray-200 pt-4">
          <Text
            className="text-center text-2xl font-semibold"
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

        {/* Get Started Button */}
        <View className="flex flex-row justify-center items-center mt-8">
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
      </ScrollView>
    </SafeAreaView>
  );
}
