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
import { client } from "@/utils/dynamic-client.native";
import Toast from "react-native-toast-message";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { Loading } from "@/components/loading";
import { useTheme } from "@/contexts/theme-context";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ConfirmEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const { theme } = useTheme();
  const { sdk, auth } = useReactiveClient(client);

  if (!sdk.loaded) return <Loading />;

  const handleConfirmCode = async () => {
    try {
      await auth.email.verifyOTP(code);
      auth.authenticatedUser?.newUser
        ? router.push("/connect-to-twitter")
        : router.push("/(authenticated)/(tabs)/home");
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error verifying code",
        text2: "Please try again",
        type: "error",
        autoHide: true,
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <Toast />
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
                  onPress={handleConfirmCode}
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
