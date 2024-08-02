import React from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
} from "react-native";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lightTheme as theme } from "@/utils/theme";
import { Header } from "@/components/header";
import { useState } from "react";
import { useLoginWithEmail } from "@privy-io/expo";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

export default function ConfirmEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const { loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess(args) {
      console.log(args);
    },
    onLoginSuccess(args) {
      console.log(args);

      router.push("/(authenticated)/home");
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
      <View className="flex flex-row justify-center items-center pt-12 px-6">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View className="flex flex-row justify-center items-center pt-12 px-6">
        <Text style={{ color: theme.textColor }}>
          An email has been sent to {email}. Please enter the code below to
          continue.
        </Text>
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
            <View>
              <Input
                placeholder="Code"
                value={code}
                onChangeText={setCode}
                style={{
                  color: theme.textColor,
                  backgroundColor: theme.mutedForegroundColor,
                }}
              />
            </View>
            <View className="pt-6">
              <Button
                className="w-full rounded-full py-3"
                style={{
                  backgroundColor:
                    code !== ""
                      ? theme.tabBarActiveTintColor
                      : theme.tabBarInactiveTintColor,
                }}
                onPress={() => loginWithCode({ code, email: email as string })}
              >
                <Text
                  className="text-center font-semibold"
                  style={{
                    color: theme.secondaryTextColor,
                  }}
                >
                  Confirm
                </Text>
              </Button>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
