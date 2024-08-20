import React, { useState } from "react";
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
import { colors } from "@/utils/theme";
import { Header } from "@/components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import { Loading } from "@/components/loading";
import { useTheme } from "@/contexts/theme-context";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useLoginWithEmail } from "@privy-io/expo";
import { GlayzeToast } from "@/components/ui/glayze-toast";

export default function ConfirmEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const { theme } = useTheme();
  const { loginWithCode } = useLoginWithEmail({
    onLoginSuccess(user, isNewUser) {
      console.log(user, isNewUser);
      isNewUser
        ? router.push("/connect-to-twitter")
        : router.push("/(authenticated)/(tabs)/home");
    },
    onError(error) {
      console.log(error);
      Toast.show({
        text1: "Error verifying code",
        text2: "Please try again",
        type: "error",
        autoHide: true,
      });
    },
  });

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <GlayzeToast />
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
          An email was sent to{" "}
          <Text style={{ fontWeight: "bold" }}>{email}</Text>. Please enter the
          code below to continue.
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
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
                  keyboardType="numeric"
                />
              </View>
              <View className="pt-6">
                <Button
                  buttonStyle="w-full rounded-full py-3"
                  style={{
                    backgroundColor:
                      code !== ""
                        ? theme.tabBarActiveTintColor
                        : theme.tabBarInactiveTintColor,
                  }}
                  onPress={() =>
                    loginWithCode({ code, email: email as string })
                  }
                >
                  <Text
                    className="text-center font-semibold"
                    style={{
                      color: colors.white,
                    }}
                  >
                    Confirm
                  </Text>
                </Button>
              </View>
            </ScrollView>
            <ProgressBar sections={3} currentSection={1} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
