import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Header } from "@/components/header";
import { lightTheme as theme } from "@/utils/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Image } from "expo-image";
import {
  OAuthProviderType,
  useLoginWithEmail,
  useLoginWithOAuth,
} from "@privy-io/expo";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { sendCode } = useLoginWithEmail({
    onSendCodeSuccess(args) {
      console.log(args);
      router.push("/confirm-email?email=" + email);
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="px-6 py-2"
          >
            <View className="space-y-6 mt-8">
              <View className="flex flex-row justify-center items-center px-6 pb-6">
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View>
                <Text className="text-lg" style={{ color: theme.textColor }}>
                  Email
                </Text>
                <Input
                  placeholder="Your Email"
                  value={email}
                  onChangeText={setEmail}
                  style={{
                    color: theme.textColor,
                    backgroundColor: theme.mutedForegroundColor,
                  }}
                />
              </View>
              <View>
                <Button
                  className="w-full rounded-full py-3"
                  style={{
                    backgroundColor:
                      email !== ""
                        ? theme.tabBarActiveTintColor
                        : theme.tabBarInactiveTintColor,
                  }}
                  onPress={() => sendCode({ email })}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{
                      color: theme.secondaryTextColor,
                    }}
                  >
                    Continue
                  </Text>
                </Button>
              </View>
              <View className="items-center">
                <Text style={{ color: theme.mutedForegroundColor }}>or</Text>
              </View>
              <View>
                <SignUpWithOAuth provider="google" />
              </View>
              <View>
                <SignUpWithOAuth provider="apple" />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SignUpWithOAuth = ({ provider }: { provider: OAuthProviderType }) => {
  const router = useRouter();
  const { login, state } = useLoginWithOAuth({
    onSuccess(user, isNewUser) {
      console.log(user, isNewUser);
      router.push("/(authenticated)/home");
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <View className="flex items-center justify-center">
      <Button
        className="w-full rounded-full py-3 border border-gray-200 flex-row items-center justify-center"
        style={{
          backgroundColor: theme.secondaryTextColor,
        }}
        onPress={() => login({ provider })}
      >
        <Image source={socialIcons[provider]} className="w-4 h-4 mr-3" />
        <Text className="text-center" style={{ color: theme.textColor }}>
          Login With {capitalizeFirstLetter(provider)}
        </Text>
      </Button>
      {/* {state.status === "loading" && <ActivityIndicator />} */}
    </View>
  );
};

const socialIcons = {
  google: require("../assets/images/socials/google.png"),
  apple: require("../assets/images/socials/apple.png"),
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
