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
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { client } from "@/utils/dynamic-client.native";
import Toast from "react-native-toast-message";
import { useReactiveClient } from "@dynamic-labs/react-hooks";

export default function ConfirmEmail() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const { sdk, auth } = useReactiveClient(client);
  if (!sdk.loaded) return <Text>Loading...</Text>;

  const handleConfirmCode = async () => {
    try {
      await auth.email.verifyOTP(code);
      router.push("/connect-to-twitter");
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
    <SafeAreaView className="flex-1 bg-white">
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
          An email was sent to {email}. Please enter the code below to continue.
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
