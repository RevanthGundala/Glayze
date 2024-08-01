import React, { useEffect } from "react";
import { Text, SafeAreaView, View, TextInput, Platform } from "react-native";
import { Image } from "expo-image";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { useLoginWithPasskey } from "@privy-io/expo/passkey";
import * as LocalAuthentication from "expo-local-authentication";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { authenticate } from "@/actions/authenticate";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const router = useRouter();
  const { state, loginWithPasskey } = useLoginWithPasskey({
    onSuccess(user, isNewUser) {
      // show a toast, send analytics event, etc...
      console.log("User logged in", user);
      if (!isNewUser) {
        router.replace("/(authenticated)/home");
      } else {
        router.push("/connect-to-twitter");
      }
    },
    onError(error) {
      console.log("Error logging in", error);
    },
  });
  const handleLoginWithPasskey = async () => {
    const authenticationTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log("Tupes: ", authenticationTypes);
    const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasBiometrics || !isEnrolled) {
      console.log("Biometrics not properly set up");

      // Schedule a notification instead of showing an alert
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Biometric Setup Required",
          body: "Please set up biometrics in your device settings to use passkey login.",
          data: { openSettings: true },
        },
        trigger: null, // null means the notification will show immediately
      });

      return;
    }

    try {
      const authResult = await authenticate();
      if (authResult) {
        console.log("Authentication successful");
        await loginWithPasskey({
          relyingParty: "https://glayze.app",
        });
      } else {
        console.log("Authentication failed");
        // Handle failed authentication
      }
    } catch (error) {
      console.log("Error during authentication or login", error);
      // Handle the error
    }
  };

  // Set up a notification response handler (do this once in your app's setup)
  Notifications.addNotificationResponseReceivedListener((response) => {
    if (response.notification.request.content.data.openSettings) {
      Linking.openSettings();
    }
  });

  if (Platform.OS === "web") {
    console.log("Web");
  }

  return (
    <SafeAreaView className="flex-1">
      {/* <View className="pt-6">
        <Image
          source={require("@/assets/images/iphone.png")}
          className="w-full h-full"
        />
      </View> */}

      <View className="space-y-2">
        <Text className="text-white text-center text-2xl font-semibold">
          Welcome to Glayze!
        </Text>
        <Text className="text-white opacity-70 text-center text-sm">
          The ultimate app for trading tweets.
        </Text>
      </View>
      <ProgressBar sections={3} currentSection={0} />
      <View className="flex flex-row justify-center items-center pt-12">
        <Button
          buttonStyle={
            "flex flex-row justify-center items-center bg-primary rounded-full"
          }
          onPress={() => router.push("/connect-to-twitter")}
        >
          <Text className="text-black font-medium px-8 py-4">Get Started</Text>
        </Button>
        <Button
          // Keeps button disabled until the code has been sent
          style={{ backgroundColor: "red" }}
          onPress={handleLoginWithPasskey}
        >
          <Text>Login with passkey</Text>
        </Button>

        {state?.status === "submitting-response" && (
          // Shows only while the login is being attempted
          <Text>Logging in...</Text>
        )}

        {state?.status === "error" && (
          <>
            <Text style={{ color: "red" }}>There was an error</Text>
            <Text style={{ color: "lightred" }}>{state?.error?.message}</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
