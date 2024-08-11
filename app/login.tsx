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
import { Href, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
// import { SocialProvider } from "@dynamic-labs/client";
import { client } from "@/utils/dynamic-client.native";
import { BaseWallet } from "@/components/base-wallet";
import { useReactiveClient } from "@dynamic-labs/react-hooks";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { auth, sdk } = useReactiveClient(client);

  if (!sdk.loaded) {
    return <Text>Loading...</Text>;
  }
  const handleEmailLogin = async () => {
    try {
      console.log("Logging in with email");
      await auth.email.sendOTP(email);
      console.log("Email sent");
      router.push(("/confirm-email?email=" + email) as Href);
    } catch (error) {
      Toast.show({
        text1: "Error sending email",
        text2: "Please try again",
        type: "error",
      });
      console.log(error);
    }
  };
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
            <View className="space-y-4">
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
                    backgroundColor: theme.backgroundColor,
                  }}
                />
              </View>
              <View>
                <Button
                  buttonStyle="w-full rounded-full py-3"
                  style={{
                    backgroundColor:
                      email !== ""
                        ? theme.tabBarActiveTintColor
                        : theme.tabBarInactiveTintColor,
                  }}
                  onPress={handleEmailLogin}
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
              {/* <View>
                <SignUpWithOAuth provider="google" />
                <SignUpWithOAuth provider="apple" />
              </View>
              <View className="items-center">
                <Text style={{ color: theme.mutedForegroundColor }}>or</Text>
              </View> */}
              <View>
                <BaseWallet />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// const SignUpWithOAuth = ({ provider }: { provider: SocialProvider }) => {
//   const router = useRouter();

//   const handleLoginWithOauth = async () => {
//     try {
//       console.log("Logging in with oauth");
//       await client.auth.social.connect({
//         provider,
//         redirectPathname: "/(authenticated)/home",
//       });
//     } catch (error) {
//       console.log(error);
//       Toast.show({
//         text1: "Error Logging in",
//         text2: "Please try again",
//         type: "error",
//       });
//     }
//   };

//   return (
//     <View className="flex items-center justify-center pb-3">
//       <Button
//         buttonStyle="w-full rounded-full py-3 border border-gray-200 flex-row items-center justify-center"
//         style={{
//           backgroundColor: theme.secondaryTextColor,
//         }}
//         onPress={handleLoginWithOauth}
//       >
//         <Image source={socialIcons[provider]} className="w-4 h-4 mr-3" />
//         <Text className="text-center" style={{ color: theme.textColor }}>
//           Login With {provider.charAt(0).toUpperCase() + provider.slice(1)}
//         </Text>
//       </Button>
//       {/* {state.status === "loading" && <ActivityIndicator />} */}
//     </View>
//   );
// };

// const socialIcons = {
//   google: require("../assets/images/socials/google.png"),
//   apple: require("../assets/images/socials/apple.png"),
// };
