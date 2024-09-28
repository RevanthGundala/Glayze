import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { Header } from "@/components/header";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { GlayzeToast } from "@/components/ui/glayze-toast";
import { usePrivy } from "@privy-io/react-auth";
import { ProgressBar } from "@/components/ui/progress-bar";
import Toast from "react-native-toast-message";
import { useLogin } from "@privy-io/react-auth";

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const { authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete(isNewUser) {
      if (isNewUser) {
        router.push("/connect-to-twitter");
      } else {
        router.push("/home");
      }
    },
  });

  useEffect(() => {
    if (authenticated) {
      // User is authenticated, navigate to the desired screen
      router.push("/home"); // Replace "/home" with your target route
    }
  }, [authenticated]);

  const handleLogin = () => {
    try {
      login({
        loginMethods: ["sms", "wallet"],
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was an error logging in",
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <GlayzeToast />
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="flex-1 px-6 justify-center items-center">
        <View className="space-y-4">
          <View className="flex flex-row justify-center items-center px-6 pb-6">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 50, height: 50 }}
            />
          </View>
          <View>
            <Text
              className="text-lg mb-6 text-center"
              style={{ color: theme.textColor }}
            >
              Please log in to continue
            </Text>
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: theme.tabBarActiveTintColor,
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.textColor }}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/home");
              }}
              style={{
                backgroundColor: theme.tabBarInactiveTintColor,
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Text style={{ color: theme.textColor }}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
          <View className="pt-8">
            <ProgressBar sections={3} currentSection={0} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
